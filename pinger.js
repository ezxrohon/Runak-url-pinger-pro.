// 🫧🦋 ʀuɴAk — URL Pinger (Cloudflare Worker)
//
// Pings a list of URLs every minute (via cron trigger) to keep them awake.
// Configure URLs with numbered environment variables in wrangler.toml or
// the Cloudflare dashboard:
//   1 = https://example1.com
//   2 = https://example2.com
//   3 = https://example3.com
//   ...

function getConfiguredUrls(env) {
  return Object.keys(env)
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => env[key])
    .filter(Boolean);
}

export default {
  async scheduled(event, env, ctx) {
    const urls = getConfiguredUrls(env);

    if (urls.length === 0) {
      console.log("No URLs configured to ping");
      return;
    }

    const pingPromises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        console.log(`Pinged ${url}: ${response.status}`);
      } catch (error) {
        console.error(`Failed to ping ${url}: ${error.message}`);
      }
    });

    ctx.waitUntil(Promise.all(pingPromises));
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const urls = getConfiguredUrls(env);

    if (url.pathname === "/") {
      return new Response(
        JSON.stringify(
          {
            name: "🫧🦋 ʀuɴAk — URL Pinger",
            status: "running",
            configuredUrls: urls,
          },
          null,
          2
        ),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.pathname === "/ping-now") {
      // Manual trigger for testing — hit this URL to run a ping immediately.
      const results = await Promise.all(
        urls.map(async (u) => {
          try {
            const response = await fetch(u);
            return { url: u, status: response.status, ok: response.ok };
          } catch (error) {
            return { url: u, status: null, ok: false, error: error.message };
          }
        })
      );
      return new Response(JSON.stringify(results, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
