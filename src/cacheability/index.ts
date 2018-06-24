import "isomorphic-fetch";
import {
  camelCase,
  isBoolean,
  isNumber,
  isPlainObject,
  isString,
  kebabCase,
} from "lodash";
import { CacheControl, CacheHeaders, ConstructorArgs, Metadata } from "../types";

/**
 * A utility class to parse, store and print http cache headers.
 *
 */
export default class Cacheability {
  private static _headerKeys: Array<"cache-control" | "etag"> = ["cache-control", "etag"];

  private static _getDirectives(cacheControl: string): string[] {
    return cacheControl.split(", ");
  }

  private static _parseCacheControl(cacheControl: string): CacheControl {
    const obj: CacheControl = {};
    if (!cacheControl.length) return obj;
    const directives = Cacheability._getDirectives(cacheControl);

    directives.forEach((dir) => {
      if (dir.match(/=/)) {
        const [key, value] = dir.split("=");
        obj[camelCase(key)] = Number(value);
        return;
      }

      obj[camelCase(dir)] = true;
    });

    return obj;
  }

  private static _parseHeaders(headers: Headers): CacheHeaders {
    const metadata: CacheHeaders = {};

    Cacheability._headerKeys.forEach((key) => {
      const headerValue = headers.get(key);
      if (!headerValue) return;
      const metadataKey = camelCase(key) as "cacheControl" | "etag";
      metadata[metadataKey] = headerValue;
    });

    return metadata;
  }

  private static _setTTL({ maxAge, noCache, noStore, sMaxage }: CacheControl): number {
    if (noCache || noStore) return 0;
    const sec = sMaxage || maxAge;
    if (!isNumber(sec)) return Infinity;
    const ms = sec * 1000;
    return Date.now() + ms;
  }

  /**
   * The property holds the Cacheability instance's parsed cache
   * headers data, including cache control directives, etag, and
   * a derived TTL timestamp.
   *
   */
  public metadata: Metadata | undefined;

  constructor(args: ConstructorArgs = {}) {
    const { cacheControl, headers, metadata } = args;

    if (cacheControl) {
      this.parseCacheControl(cacheControl);
    } else if (headers) {
      this.parseHeaders(headers);
    } else if (metadata) {
      this.metadata = metadata;
    }
  }

  /**
   * The method checks whether the TTL timestamp stored in the Cacheability
   * instance is still valid, by comparing it to the current timestamp.
   *
   */
  public checkTTL(): boolean {
    if (!this.metadata || !isNumber(this.metadata.ttl)) {
      throw new TypeError("checkTTL expected this._metadata.ttl to be a number.");
    }

    return this.metadata.ttl > Date.now();
  }

  /**
   * The method takes a cache-control header field value, parses it into
   * an object literal and derives a TTL from the max-age or s-maxage
   * directives. If no max-age or s-maxage directives are present,
   * the TTL is given a value of Infinity. The data is stored on the
   * Cacheability instance's metadata property.
   *
   */
  public parseCacheControl(cacheControl: string): Metadata {
    if (!isString(cacheControl)) {
      throw new TypeError("parseCacheControl expected cacheControl to be a string.");
    }

    const parsedCacheControl = Cacheability._parseCacheControl(cacheControl);

    this.metadata = {
      cacheControl: parsedCacheControl,
      ttl: Cacheability._setTTL(parsedCacheControl),
    };

    return this.metadata;
  }

  /**
   * Takes a Headers instance or object literal of header key/values,
   * filters the cache-control and etag header fields, parses the
   * cache-control into an object literal and derives a TTL from the
   * max-age or s-maxage directives. If no max-age or s-maxage
   * directives are present, the TTL is given a value of Infinity.
   * The data is stored on the Cacheability instance's metadata property.
   *
   */
  public parseHeaders(headers: Headers | CacheHeaders): Metadata {
    if (!(headers instanceof Headers) && !isPlainObject(headers)) {
      const message = "parseHeaders expected headers to be an instance of Headers or a plain object.";
      throw new TypeError(message);
    }

    const { cacheControl = "", etag } = headers instanceof Headers
      ? Cacheability._parseHeaders(headers) : headers;

    const parsedCacheControl = Cacheability._parseCacheControl(cacheControl);

    this.metadata = {
      cacheControl: parsedCacheControl,
      etag,
      ttl: Cacheability._setTTL(parsedCacheControl),
    };

    return this.metadata;
  }

  /**
   * The method prints a cache-control header field value based on
   * the Cacheability instance's metadata. The max-age and/or s-maxage
   * are derived from the TTL stored in the metadata.
   *
   */
  public printCacheControl(): string {
    if (!this.metadata || !this.metadata.cacheControl) {
      throw new TypeError("printCacheControl expected this._metadata.cacheControl to be an object");
    }

    if (!Object.values(this.metadata.cacheControl).length) return "";
    const cacheControl: CacheControl = { ...this.metadata.cacheControl };

    if (cacheControl.sMaxage || cacheControl.maxAge) {
      const maxAge = this.checkTTL() ? Math.round((this.metadata.ttl - Date.now()) / 1000) : 0;
      if (cacheControl.sMaxage) cacheControl.sMaxage = maxAge;
      if (cacheControl.maxAge) cacheControl.maxAge = maxAge;
    }

    const directives: string[] = [];

    Object.keys(cacheControl).forEach((key) => {
      if (isBoolean(cacheControl[key])) {
        directives.push(kebabCase(key));
        return;
      }

      directives.push(`${kebabCase(key)}=${cacheControl[key]}`);
    });

    return directives.join(", ");
  }
}
