import { formatTextMetrics, measureText } from "./input-metrics.mjs";
export function InputMetrics({
  value,
  limit,
  inputId,
  id,
}: {
  value: string;
  limit?: number;
  inputId?: string;
  id?: string;
}) {
  return (
    <p
      id={id || (inputId ? inputId + "-metrics" : undefined)}
      className={`input-metrics ${limit && measureText(value).characters > limit ? "is-over-limit" : ""}`}
      data-counter-for={inputId}
      data-max-chars={limit}
    >
      {formatTextMetrics(value, limit)}
    </p>
  );
}
