export interface ConstructorArgs {
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

export interface Metadata {
  cacheControl: CacheControl;
  etag?: string;
  ttl: number;
}

/** @internal */
export type HeaderKeys = Array<"cache-control" | "etag">;

/** @internal */
export interface ParsedCacheHeaders {
  cacheControl: CacheControl;
  etag?: string;
}
