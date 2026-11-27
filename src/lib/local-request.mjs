export function isLocalRequest(headers) {
  const host = headers.get("host");
  const origin = headers.get("origin");
  if (!host) return false;
  try {
    const address = new URL(`http://${host}`);
    return (
      address.host === host &&
      ["127.0.0.1", "localhost"].includes(address.hostname) &&
      (!origin || origin === address.origin)
    );
  } catch {
    return false;
  }
}
