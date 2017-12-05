import { polyfill } from "es6-promise";
import "isomorphic-fetch";
import { camelCase, isBoolean, isPlainObject, isString, kebabCase } from "lodash";
import { CacheControl, Metadata, ObjectStringMap } from "./types";

polyfill();

export default class Cacheability {
  private static _getDirectives(cacheControl: string): string[] {
    return cacheControl.split(", ");
  }

  private static _parseCacheControl(cacheControl: string = ""): CacheControl {
    const directives = Cacheability._getDirectives(cacheControl);
    const obj: CacheControl = {};

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

  private static _setTTL(cacheControl?: CacheControl): number | undefined {
    if (!isPlainObject(cacheControl)) return undefined;
    const { maxAge, sMaxage } = cacheControl as CacheControl;
    const sec = sMaxage || maxAge;
    if (!sec) return undefined;
    const ms = sec * 1000;
    return Date.now() + ms;
  }

  private _headerKeys: string[] = ["cache-control", "etag"];
  private _metadata: Metadata = {};

  get metadata(): Metadata {
    return this._metadata;
  }

  public checkTTL(): boolean {
    return !this._metadata.ttl ? true : this._metadata.ttl > Date.now();
  }

  public parseCacheControl(cacheControl: string): Metadata {
    if (!isString(cacheControl)) {
      this._metadata = {};
      return this._metadata;
    }

    this._metadata = { cacheControl: Cacheability._parseCacheControl(cacheControl) };
    this._metadata.ttl = Cacheability._setTTL(this._metadata.cacheControl);
    return this._metadata;
  }

  public parseHeaders(headers: Headers | ObjectStringMap): Metadata {
    if (!(headers instanceof Headers) && !isPlainObject(headers)) {
      this._metadata = {};
      return this._metadata;
    }

    const metadata = headers instanceof Headers ? this._parseHeaders(headers) : headers;
    const cacheControl = Cacheability._parseCacheControl(metadata.cacheControl);
    const ttl = Cacheability._setTTL(cacheControl);
    this._metadata = { ...metadata, cacheControl, ttl };
    return this._metadata;
  }

  public printCacheControl(): string | undefined {
    if (!isPlainObject(this._metadata.cacheControl)) return undefined;
    const cacheControl: CacheControl = { ...this._metadata.cacheControl };
    const ttl = this._metadata.ttl;
    let maxAge = 0;

    if (this.checkTTL()) {
      const validTTL = ttl as number;
      maxAge = Math.round((validTTL - Date.now()) / 1000);
    }

    if (cacheControl.sMaxage) cacheControl.sMaxage = maxAge;
    if (cacheControl.maxAge) cacheControl.maxAge = maxAge;
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

  public setMetadata(metadata?: Metadata): void {
    let _metadata = metadata;
    if (!isPlainObject(metadata)) _metadata = {};
    this._metadata = _metadata as Metadata;
  }

  private _parseHeaders(headers: Headers): ObjectStringMap {
    const metadata: ObjectStringMap = {};

    this._headerKeys.forEach((key) => {
      const headerValue = headers.get(key);
      if (!headerValue) return;
      metadata[camelCase(key)] = headerValue;
    });

    return metadata;
  }
}
