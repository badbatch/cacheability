import {
  camelCase,
  isBoolean,
  isNumber,
  isPlainObject,
  isString,
  kebabCase,
} from "lodash";

import { CacheControl, CacheHeaders, Metadata } from "../types";

if (!process.env.WEB_ENV) {
  require("isomorphic-fetch");
}

export type CacheabilityCacheControl = CacheControl;
export type CacheabilityMetadata = Metadata;

export class Cacheability {
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

  private static _setTTL({ maxAge, sMaxage }: CacheControl): number {
    const sec = sMaxage || maxAge;
    if (!isNumber(sec)) return Infinity;
    const ms = sec * 1000;
    return Date.now() + ms;
  }

  public metadata: Metadata;

  public checkTTL(): boolean {
    if (!this.metadata || !this.metadata.ttl) {
      throw new TypeError("checkTTL expected this._metadata.ttl to be a number.");
    }

    return this.metadata.ttl > Date.now();
  }

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
