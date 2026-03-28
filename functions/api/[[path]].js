/**
 * Cloudflare Pages Function — proxies all /api/* requests to the backend server.
 * Set API_BACKEND_URL in Cloudflare Pages environment variables, e.g.:
 *   https://your-api.railway.app
 */
export async function onRequest(context) {
  const { request, env } = context;

  const backendBase = (env.API_BACKEND_URL || "").replace(/\/$/, "");

  if (!backendBase) {
    return new Response(
      JSON.stringify({ error: "API_BACKEND_URL is not configured on this deployment." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(request.url);
  const targetUrl = `${backendBase}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("cf-connecting-ip");
  headers.delete("cf-ipcountry");
  headers.delete("cf-ray");
  headers.delete("cf-visitor");
  headers.delete("cf-ew-via");

  const isBodyless = ["GET", "HEAD"].includes(request.method.toUpperCase());

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: isBodyless ? undefined : request.body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstream.headers);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
