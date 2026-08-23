import type { CacheHint, ServerOptions } from "@modelcontextprotocol/server";

/**
 * Cache hint for the static tool/prompt/resource catalogs. The catalogs are
 * identical for every client, so they may be cached by shared caches.
 */
export const MCP_CATALOG_CACHE_HINT: CacheHint = {
  ttlMs: 300_000,
  cacheScope: "public",
};

/**
 * Cache hint for the widget HTML resource, which is versioned and immutable.
 */
export const MCP_RESOURCE_CACHE_HINT: CacheHint = {
  ttlMs: 300_000,
  cacheScope: "public",
};

/**
 * Cache hint for `server/discover`: capability metadata changes rarely, so a
 * short shared-cache lifetime avoids redundant discovery round trips.
 */
export const MCP_DISCOVER_CACHE_HINT: CacheHint = {
  ttlMs: 60_000,
  cacheScope: "public",
};

/**
 * Per-operation cache hints advertised on 2026-07-28 list/read results so
 * clients can cache catalogs instead of re-fetching them on every request.
 */
export const MCP_SERVER_CACHE_HINTS: NonNullable<ServerOptions["cacheHints"]> = {
  "tools/list": MCP_CATALOG_CACHE_HINT,
  "prompts/list": MCP_CATALOG_CACHE_HINT,
  "resources/list": MCP_CATALOG_CACHE_HINT,
  "resources/read": MCP_RESOURCE_CACHE_HINT,
  "server/discover": MCP_DISCOVER_CACHE_HINT,
};

