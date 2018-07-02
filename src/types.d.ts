export interface CacheabilityArgs {
  cacheControl?: string;
  headers?: Headers | CacheHeaders;
  metadata?: Metadata;
}

export interface CacheHeaders {
  cacheControl?: string;
  etag?: string;
}

export interface CacheControl {
  maxAge?: number;
  noCache?: boolean;
  noStore?: boolean;
  sMaxage?: number;
  [key: string]: string | number | boolean;
}

/** @hidden */
export type HeaderKeys = Array<"cache-control" | "etag">;

export interface Metadata {
  cacheControl: CacheControl;
  etag?: string;
  ttl: number;
}

/** @hidden */
export interface ParsedCacheHeaders {
  cacheControl: CacheControl;
  etag?: string;
}
