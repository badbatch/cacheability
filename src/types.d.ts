export interface ParsedHeaders {
  cacheControl?: string;
  etag?: string;
}

export interface CacheControl {
  maxAge?: number;
  sMaxage?: number;
  [key: string]: string | number | boolean;
}

export interface Metadata {
  cacheControl: CacheControl;
  etag?: string;
  ttl: number;
}
