# Notes on `fetch()` and caching

A few patterns I like:

1. Prefer `AbortController` to cancel requests.
2. Use `sessionStorage` for ephemeral client-side caching.
3. Respect `Cache-Control` headers whenever possible.

More small demos soon.
