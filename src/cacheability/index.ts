import "isomorphic-fetch";
import {
  camelCase,
  isBoolean,
  isNumber,
  isPlainObject,
  isString,
  kebabCase,
} from "lodash";
import {
  CacheabilityArgs,
  CacheControl,
  CacheHeaders,
  HeaderKeys,
  Metadata,
  ParsedCacheHeaders,
} from "../types";

/**
 * A utility class to parse, store and print http cache headers.
 *
 * ```typescript
 * import Cacheability from "cacheability";
 *
 * const headers = new Headers({
 *   "cache-control": "public, max-age=60",
 *   "content-type": "application/json",
 *   "etag": "33a64df551425fcc55e4d42a148795d9f25f89d4",
 * });
 *
 * const cacheability = new Cacheability({ headers });
 *
 * const { cacheControl, etag, ttl } = cacheability.metadata;
 * // cacheControl is { maxAge: 60, public: true }
 * // etag is 33a64df551425fcc55e4d42a148795d9f25f89d4
 * // ttl is 1516060712991 if Date.now is 1516060501948
 * ```
 */
export class Cacheability {
  private static _headerKeys: HeaderKeys = ["cache-control", "etag"];

  private static _getDirectives(cacheControl: string): string[] {
    return cacheControl.split(", ");
  }

  private static _parseCacheControl(cacheControl?: string): CacheControl {
    const obj: CacheControl = {};
    if (!isString(cacheControl) || !cacheControl.length) return obj;
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

  private static _parseHeaders(headers: Headers | CacheHeaders): ParsedCacheHeaders {
    let parsed: CacheHeaders = {};

    if (headers instanceof Headers) {
      Cacheability._headerKeys.forEach((key) => {
        const headerValue = headers.get(key);
        if (!headerValue) return;
        const metadataKey = camelCase(key) as "cacheControl" | "etag";
        parsed[metadataKey] = headerValue;
      });
    } else if (isPlainObject(headers)) {
      parsed = headers;
    }

    return {
      cacheControl: Cacheability._parseCacheControl(parsed.cacheControl),
      etag: parsed.etag,
    };
  }

  private static _setDefaultMetadata(): Metadata {
    return {
      cacheControl: {},
      ttl: Infinity,
    };
  }

  private static _setMetadata({ cacheControl, etag }: ParsedCacheHeaders): Metadata {
    return {
      cacheControl,
      etag,
      ttl: Cacheability._setTTL(cacheControl),
    };
  }

  private static _setTTL({ maxAge, noCache, noStore, sMaxage }: CacheControl): number {
    if (noCache || noStore) return 0;
    const sec = sMaxage || maxAge;
    if (!isNumber(sec)) return Infinity;
    const ms = sec * 1000;
    return Date.now() + ms;
  }

  private static _validateMetadata(metadata: Metadata): Metadata {
    if (!isPlainObject(metadata)) return this._setDefaultMetadata();
    const { cacheControl, etag, ttl } = metadata;

    return {
      cacheControl: isPlainObject(cacheControl) ? cacheControl : {},
      etag: isString(etag) ? etag : undefined,
      ttl: isNumber(ttl) ? ttl : Infinity,
    };
  }

  /**
   * The property holds the Cacheability instance's parsed cache
   * headers data, including cache control directives, etag, and
   * a derived TTL timestamp.
   */
  public readonly metadata: Metadata;

  constructor(args: CacheabilityArgs = {}) {
    const { cacheControl, headers, metadata } = args;

    if (cacheControl) {
      this.metadata = Cacheability._setMetadata({
        cacheControl: Cacheability._parseCacheControl(cacheControl),
      });
    } else if (headers) {
      this.metadata = Cacheability._setMetadata(
        Cacheability._parseHeaders(headers),
      );
    } else if (metadata) {
      this.metadata = Cacheability._validateMetadata(metadata);
    } else {
      this.metadata = Cacheability._setDefaultMetadata();
    }
  }

  /**
   * The method checks whether the TTL timestamp stored in the Cacheability
   * instance is still valid, by comparing it to the current timestamp.
   *
   * ```typescript
   * cacheability.parseCacheControl("public, max-age=3");
   *
   * // One second elapses...
   *
   * const isValid = cacheability.checkTTL();
   * // isValid is true
   *
   * // Three seconds elapse...
   *
   * const isStillValid = cacheability.checkTTL();
   * // isStillValid is false
   * ```
   */
  public checkTTL(): boolean {
    return this.metadata.ttl > Date.now();
  }

  /**
   * The method prints a cache-control header field value based on
   * the Cacheability instance's metadata. The max-age and/or s-maxage
   * are derived from the TTL stored in the metadata.
   *
   * ```typescript
   * cacheability.parseCacheControl("public, max-age=60, s-maxage=60");
   *
   * // Five seconds elapse...
   *
   * const cacheControl = cacheability.printCacheControl();
   * // cacheControl is "public, max-age=55, s-maxage=55"
   * ```
   */
  public printCacheControl(): string {
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
