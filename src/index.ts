import { polyfill } from "es6-promise";
import "isomorphic-fetch";
import { camelCase, isBoolean, isNumber, isString, kebabCase } from "lodash";
import { CacheControl, Metadata, ParsedHeaders } from "./types";

polyfill();

export type CacheabilityCacheControl = CacheControl;
export type CacheabilityMetadata = Metadata;

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

  private static _parseHeaders(headers: Headers): ParsedHeaders {
    const metadata: ParsedHeaders = {};

    Cacheability._headerKeys.forEach((key) => {
      const headerValue = headers.get(key);
      if (!headerValue) return;
      const metadataKey = camelCase(key) as "cacheControl" | "etag";
      metadata[metadataKey] = headerValue;
    });

    return metadata;
  }

  private static _setTTL({ maxAge, sMaxage }: CacheControl): number {
    const sec = sMaxage || maxAge;
    if (!isNumber(sec)) return Infinity;
    const ms = sec * 1000;
    return Date.now() + ms;
  }

  private _metadata: Metadata;

  get metadata(): Metadata {
    return this._metadata;
  }

  set metadata(metadata: Metadata) {
    this._metadata = metadata;
  }

  public checkTTL(): boolean {
    if (!this._metadata || !this._metadata.ttl) {
      throw new TypeError("checkTTL expected this._metadata.ttl to be a number.");
    }

    return this._metadata.ttl > Date.now();
  }

  public parseCacheControl(cacheControl: string): Metadata {
    if (!isString(cacheControl)) {
      throw new TypeError("parseCacheControl expected cacheControl to be a string.");
    }

    const parsedCacheControl = Cacheability._parseCacheControl(cacheControl);

    this._metadata = {
      cacheControl: parsedCacheControl,
      ttl: Cacheability._setTTL(parsedCacheControl),
    };

    return this._metadata;
  }

  public parseHeaders(headers: Headers): Metadata {
    if (!(headers instanceof Headers)) {
      throw new TypeError("parseHeaders expected headers to be an instance of Headers.");
    }

    const { cacheControl = "", etag } = Cacheability._parseHeaders(headers);
    const parsedCacheControl = Cacheability._parseCacheControl(cacheControl);

    this._metadata = {
      cacheControl: parsedCacheControl,
      etag,
      ttl: Cacheability._setTTL(parsedCacheControl),
    };

    return this._metadata;
  }

  public printCacheControl(): string {
    if (!this._metadata || !this._metadata.cacheControl) {
      throw new TypeError("printCacheControl expected this._metadata.cacheControl to be an object");
    }

    if (!Object.values(this._metadata.cacheControl).length) return "";
    const cacheControl: CacheControl = { ...this._metadata.cacheControl };

    if (cacheControl.sMaxage || cacheControl.maxAge) {
      const maxAge = this.checkTTL() ? Math.round((this._metadata.ttl - Date.now()) / 1000) : 0;
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
