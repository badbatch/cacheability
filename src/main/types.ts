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
  [key: string]: string | number | boolean | undefined;
}

/** @private */
export type HeaderKeys = ("cache-control" | "etag")[];

export interface Metadata {
  cacheControl: CacheControl;
  etag?: string;
  ttl: number;
}

/** @private */
export interface ParsedCacheHeaders {
  cacheControl: CacheControl;
  etag?: string;
}
