import { build } from "esbuild";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import ts from "typescript";
import postcss from "postcss";
import { format } from "prettier";
import { simulationRegistry } from "../src/demos/registry.ts";
import { markup, script, vanillaDocument } from "../src/demos/vanilla.mjs";

const css = await readFile("src/demos/scene.css", "utf8");
const sceneModule = await readFile("src/demos/scenes.tsx", "utf8");
const modules = new Map();
for (const file of new Set(simulationRegistry.map((demo) => demo.file))) {
  const component = await readFile(file, "utf8");
  const tree = ts.createSourceFile(
    file,
    component,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  modules.set(file, { component, tree });
}
const names = Object.fromEntries(
  simulationRegistry.map((demo) => [demo.id, demo.component]),
);
const tree = ts.createSourceFile(
  "scenes.tsx",
  sceneModule,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const sceneMapNode = tree.statements
  .filter(ts.isVariableStatement)
  .flatMap((node) => [...node.declarationList.declarations])
  .find((node) => node.name.getText(tree) === "sceneMap");
const sceneConnections = new Map(
  sceneMapNode.initializer.properties.map((node) => [
    node.name.getText(tree).replace(/^['"]|['"]$/g, ""),
    node.initializer.getText(tree),
  ]),
);
if (
  new Set(simulationRegistry.map((d) => d.id)).size !==
  simulationRegistry.length
)
  throw Error("시뮬레이션 id가 중복됩니다.");
for (const demo of simulationRegistry) {
  if (
    !markup[demo.id] ||
    !script[demo.id] ||
    sceneConnections.get(demo.id) !== demo.component
  )
    throw Error(`${demo.id}: React·HTML 구현과 sceneMap 등록을 확인하세요.`);
  if (
    !/^[a-z0-9-]+$/.test(demo.id) ||
    demo.duration <= 0 ||
    demo.steps.length !== 4 ||
    demo.poster < 0 ||
    demo.poster >= demo.duration
  )
    throw Error(`${demo.id}: 시연 메타데이터를 확인하세요.`);
}
const metricJS = await readFile("src/demos/input-metrics.mjs", "utf8");
const metricTree = ts.createSourceFile(
  "input-metrics.mjs",
  metricJS,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.JS,
);
const metricFunctions = metricTree.statements
  .filter(
    (node) =>
      ts.isFunctionDeclaration(node) &&
      ["measureText", "formatTextMetrics", "limitText"].includes(
        node.name.text,
      ),
  )
  .map((node) =>
    node
      .getText(metricTree)
      .replace(
        "function measureText(value)",
        "function measureText(value: string)",
      )
      .replace(
        "function formatTextMetrics(value, limit)",
        "function formatTextMetrics(value: string, limit?: number)",
      )
      .replace(
        "function limitText(value, limit)",
        "function limitText(value: string, limit: number)",
      ),
  )
  .join("\n");
const metricComponent = (
  await readFile("src/demos/input-metrics.tsx", "utf8")
).replace(/^import[^;]+;\s*/, "");
function componentSource(name, file) {
  const { tree } = modules.get(file);
  const declarations = new Map();
  for (const statement of tree.statements) {
    if (statement.name) declarations.set(statement.name.text, statement);
    if (ts.isVariableStatement(statement))
      for (const declaration of statement.declarationList.declarations)
        if (ts.isIdentifier(declaration.name))
          declarations.set(declaration.name.text, statement);
  }
  const needed = new Set();
  function include(symbol) {
    const node = declarations.get(symbol);
    if (!node || needed.has(node)) return;
    needed.add(node);
    const visit = (child) => {
      if (ts.isIdentifier(child)) include(child.text);
      ts.forEachChild(child, visit);
    };
    visit(node);
  }
  if (!declarations.has(name))
    throw Error(`${file}: ${name} 함수를 찾을 수 없습니다.`);
  include(name);
  const body = tree.statements
    .filter((node) => needed.has(node))
    .map((node) => node.getText(tree))
    .join("\n\n");
  const imports = tree.statements
    .filter(
      (node) =>
        ts.isImportDeclaration(node) &&
        !node.moduleSpecifier.text.startsWith("./input-metrics"),
    )
    .map((node) => node.getText(tree))
    .join("\n");
  const metrics =
    /\b(InputMetrics|measureText|formatTextMetrics|limitText)\b/.test(body)
      ? metricFunctions + "\n" + metricComponent
      : "";
  return imports + "\n" + metrics + "\n" + body;
}
function componentCss(source) {
  // Include shared rules and states used by this UI, excluding other UI classes.
  const words = new Set(source.match(/[A-Za-z_][\w-]*/g));
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name))
      return;
    const selectors = rule.selectors.filter((selector) =>
      [...selector.matchAll(/\.([A-Za-z_][\w-]*)/g)].every((match) =>
        words.has(match[1]),
      ),
    );
    if (selectors.length) rule.selectors = selectors;
    else rule.remove();
  });
  root.walkAtRules((rule) => {
    if (rule.nodes && !rule.nodes.length) rule.remove();
  });
  return "[hidden]{display:none!important}\n" + root.toString();
}
const pretty = (source, parser) =>
  format(source, { parser, singleQuote: true, printWidth: 72 });
await mkdir("public", { recursive: true });
await mkdir("src/generated", { recursive: true });
await build({
  entryPoints: ["src/demos/entry.tsx"],
  bundle: true,
  format: "iife",
  outfile: "public/demo-bundle.js",
  minify: true,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
});
const sources = {};
for (const [id, name] of Object.entries(names)) {
  const selected = componentSource(
    name,
    simulationRegistry.find((demo) => demo.id === id).file,
  );
  const selectedCss = await pretty(
    componentCss(selected + markup[id] + script[id]),
    "css",
  );
  const reactPart = await pretty(
    `'use client';\nimport './ui.css';\n${selected}\nexport default ${name};`,
    "typescript",
  );
  sources[id] = {
    html: await pretty(vanillaDocument(id, selectedCss), "html"),
    react: await pretty(
      `'use client';\n${selected}\nconst css = ${JSON.stringify(selectedCss)};\nexport default function App(){return <><style>{css}</style><${name}/></>;}`,
      "typescript",
    ),
    reducedHtml: vanillaDocument(id, selectedCss, true),
    parts: {
      react: [
        {
          id: "component",
          label: "컴포넌트",
          filename: `${name}.tsx`,
          code: reactPart,
        },
        { id: "style", label: "CSS", filename: "ui.css", code: selectedCss },
      ],
      html: [
        {
          id: "markup",
          label: "HTML",
          filename: "ui.html",
          code: await pretty(markup[id], "html"),
        },
        { id: "style", label: "CSS", filename: "ui.css", code: selectedCss },
        {
          id: "script",
          label: "JavaScript",
          filename: "ui.js",
          code: await pretty(script[id], "babel"),
        },
      ],
    },
  };
}
await writeFile("src/generated/sources.json", JSON.stringify(sources));
await writeFile("src/generated/styles.json", JSON.stringify({ css }));
console.log(
  `${simulationRegistry.length}개 데모 · UI별 코드 조각 · 전체 실행 예제 준비 완료`,
);
