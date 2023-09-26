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
  [key: string]: string | number | boolean | undefined;
  maxAge?: number;
  noCache?: boolean;
  noStore?: boolean;
  sMaxage?: number;
}

export type HeaderKeys = ('cache-control' | 'etag')[];

export interface Metadata {
  cacheControl: CacheControl;
  etag?: string;
  ttl: number;
}

export interface ParsedCacheHeaders {
  cacheControl: CacheControl;
  etag?: string;
}
