export interface ObjectStringMap {
  [key: string]: string;
}

export interface CacheControl {
  maxAge?: number;
  sMaxage?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface Metadata {
  cacheControl?: CacheControl;
  etag?: string;
  ttl?: number;
}
