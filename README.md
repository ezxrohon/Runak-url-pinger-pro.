# 🫧🦋 ʀuɴAk — URL Pinger (Cloudflare Worker)

A Cloudflare Worker that pings a list of URLs every minute (via a cron
trigger) to keep them from going idle.

## What was fixed from the original version

The original `pinger.js` had a mismatch: the README said to configure URLs
via numbered environment variables, but the code only ever pinged a
hardcoded array and ignored `env` completely. This version actually reads
the numbered vars, so changing `wrangler.toml` (or the dashboard) is enough
— no code edits needed.

## Configuration

Set your URLs using **numbered keys** under `[vars]` in `wrangler.toml`:

```toml
[vars]
"1" = "https://example1.com"
"2" = "https://example2.com"
"3" = "https://example3.com"
```

Add as many as you want (`"4"`, `"5"`, ...). Order doesn't matter — they're
sorted numerically before pinging.

## Deploy

You'll need a (free) Cloudflare account.

1. Install Wrangler if you don't have it:
   ```bash
   npm install -g wrangler
   ```
2. Log in:
   ```bash
   wrangler login
   ```
3. From this folder, edit `wrangler.toml` with your real URLs, then deploy:
   ```bash
   wrangler deploy
   ```
4. Wrangler will print your Worker's URL (something like
   `https://runak-url-pinger.<your-subdomain>.workers.dev`).

### Changing URLs later

Either:
- Edit `wrangler.toml` and run `wrangler deploy` again, **or**
- Go to the Cloudflare dashboard → Workers & Pages → your Worker →
  **Settings → Variables**, edit the numbered variables there, and save
  (no redeploy needed for var-only changes).

## Monitoring

- Visit your Worker's URL (`/`) to see the currently configured URLs as JSON.
- Visit `/ping-now` to trigger a ping run manually and see the results.
- Check **Workers & Pages → your Worker → Logs** in the Cloudflare dashboard
  for the scheduled (cron) run history.

## Notes

- The cron trigger (`* * * * *`) runs every minute. Cloudflare's free plan
  allows scheduled triggers, but check current Workers plan limits if you
  add many URLs or a very frequent schedule.

---
credit: Kustbots — original concept
Elevenyts ❤️
