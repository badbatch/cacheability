import { camelCase, isBoolean, isPlainObject, isString, kebabCase } from 'lodash';

require('isomorphic-fetch');

/**
 *
 * The cache headers parser
 */
export default class Cacheability {
  /**
   *
   * @private
   * @type {Array<string>}
   */
  _headerKeys = ['cache-control', 'etag'];
  /**
   *
   * @private
   * @type {Object}
   */
  _metadata = {};

  /**
   *
   * @return {Object}
   */
  get metadata() {
    return this._metadata;
  }

  /**
   *
   * @private
   * @param {string} cacheControl
   * @return {Array<string>}
   */
  _getDirectives(cacheControl) {
    return cacheControl.split(', ');
  }

  /**
   *
   * @private
   * @param {string} cacheControl
   * @return {Object}
   */
  _parseCacheControl(cacheControl = '') {
    const directives = this._getDirectives(cacheControl);
    const metadata = {};

    directives.forEach((dir) => {
      if (dir.match(/=/)) {
        const [key, value] = dir.split('=');
        metadata[camelCase(key)] = Number(value);
        return;
      }

      metadata[camelCase(dir)] = true;
    });

    return metadata;
  }

  /**
   *
   * @private
   * @param {Headers} headers
   * @return {Object}
   */
  _parseHeaders(headers) {
    const metadata = {};

    this._headerKeys.forEach((key) => {
      const header = headers.get(key);
      if (!header) return;
      metadata[camelCase(key)] = header;
    });

    return metadata;
  }

  /**
   *
   * @private
   * @param {Object} metadata
   * @param {number} metadata.maxAge
   * @param {number} metadata.sMaxage
   * @return {number}
   */
  _setTTL({ maxAge, sMaxage } = {}) {
    const sec = sMaxage || maxAge;
    if (!sec) return null;
    const ms = sec * 1000;
    return Date.now() + ms;
  }

  /**
   *
   * @return {boolean}
   */
  checkTTL() {
    return !this._metadata.ttl ? true : this._metadata.ttl > Date.now();
  }

  /**
   *
   * @param {string} cacheControl
   * @return {Object}
   */
  parseCacheControl(cacheControl) {
    if (!isString(cacheControl)) {
      this._metadata = {};
      return this._metadata;
    }

    this._metadata = { cacheControl: this._parseCacheControl(cacheControl) };
    this._metadata.ttl = this._setTTL(this._metadata.cacheControl);
    return this._metadata;
  }

  /**
   *
   * @param {Headers} headers
   * @return {Object}
   */
  parseHeaders(headers) {
    if (!(headers instanceof Headers) && !isPlainObject(headers)) {
      this._metadata = {};
      return this._metadata;
    }

    const metadata = headers instanceof Headers ? this._parseHeaders(headers) : headers;
    const cacheControl = metadata.cacheControl;
    metadata.cacheControl = this._parseCacheControl(cacheControl);
    metadata.ttl = this._setTTL(metadata.cacheControl);
    this._metadata = metadata;
    return this._metadata;
  }

  /**
   *
   * @return {string}
   */
  printCacheControl() {
    const cacheControl = { ...this._metadata.cacheControl };
    const ttl = this._metadata.ttl;
    const maxAge = this.checkTTL() ? Math.round((ttl - Date.now()) / 1000) : 0;
    if (cacheControl.sMaxage) cacheControl.sMaxage = maxAge;
    if (cacheControl.maxAge) cacheControl.maxAge = maxAge;
    const directives = [];

    Object.keys(cacheControl).forEach((key) => {
      if (isBoolean(cacheControl[key])) {
        directives.push(kebabCase(key));
        return;
      }

      directives.push(`${kebabCase(key)}=${cacheControl[key]}`);
    });

    return directives.join(', ');
  }

  /**
   *
   * @param {Object} metadata
   * @return {void}
   */
  setMetadata(metadata) {
    let _metadata = metadata;
    if (!isPlainObject(metadata)) _metadata = {};
    this._metadata = _metadata;
  }
}
