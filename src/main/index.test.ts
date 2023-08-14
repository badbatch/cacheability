import { cacheControl, cacheHeaders, defaultMetadata, metadata, rawHeaders } from '../__testUtils__/data.ts';
import { Cacheability } from './index.ts';

describe('the cacheability class', () => {
  let cacheability: Cacheability;

  describe('the constructor', () => {
    describe('when nothing is passed into the constructor', () => {
      beforeEach(() => {
        cacheability = new Cacheability();
      });

      it('then the constructor should set the default metadata to this._metadata', () => {
        expect(cacheability.metadata).toEqual(defaultMetadata);
      });
    });

    describe('when metadata is passed into the constructor', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ metadata });
      });

      it('then the constructor should set metadata to this._metadata', () => {
        expect(cacheability.metadata).toEqual(metadata);
      });
    });

    describe('when headers is passed into the constructor', () => {
      describe('when headers is an instance of Headers', () => {
        beforeEach(() => {
          cacheability = new Cacheability({ headers: new Headers(rawHeaders.shortMaxAge) });
        });

        it('then the constructor should parse the headers and set the resulting data to this._metadata', () => {
          expect(cacheability.metadata).toEqual({
            cacheControl: {
              maxAge: 1,
              public: true,
            },
            etag: '33a64df551425fcc55e4d42a148795d9f25f89d4',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ttl: expect.any(Number),
          });
        });
      });

      describe('when headers is a plain object', () => {
        beforeEach(() => {
          cacheability = new Cacheability({ headers: cacheHeaders });
        });

        it('then the constructor should parse the headers and set the resulting data to this._metadata', () => {
          expect(cacheability.metadata).toEqual({
            cacheControl: {
              maxAge: 3,
              public: true,
            },
            etag: '33a64df551425fcc55e4d42a148795d9f25f89d4',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ttl: expect.any(Number),
          });
        });
      });
    });

    describe('when cacheControl is passed into the constructor', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ cacheControl });
      });

      it('then the constructor should parse the cacheControl and set the resulting data to this._metadata', () => {
        expect(cacheability.metadata).toEqual({
          cacheControl: {
            maxAge: 2,
            public: true,
            sMaxage: 2,
          },
          etag: undefined,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ttl: expect.any(Number),
        });
      });
    });
  });

  describe('the checkTTL method', () => {
    describe('when this._metadata.cacheControl has a property of maxAge', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.shortMaxAge) });
      });

      describe('when this._metadata.ttl is valid', () => {
        it('then the method should return true', () => {
          expect(cacheability.checkTTL()).toBe(true);
        });
      });

      describe('when this._metadata.ttl has expired', () => {
        it('then the method should return false', async () => {
          await new Promise<void>(resolve => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });

          expect(cacheability.checkTTL()).toBe(false);
        });
      });
    });

    describe('when this._metadata.cacheControl does not have a property of maxAge', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.missingCacheControl) });
      });

      it('then this._metadata.ttl is valid and the method should return true', () => {
        expect(cacheability.checkTTL()).toBe(true);
      });
    });

    describe('when this._metadata.cacheControl has a property of noCache', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.noCache) });
      });

      it('then this._metadata.ttl is invalid and the method should return false', () => {
        expect(cacheability.checkTTL()).toBe(false);
      });
    });

    describe('when this._metadata.cacheControl has a property of noStore', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.noStore) });
      });

      it('then this._metadata.ttl is invalid and the method should return false', () => {
        expect(cacheability.checkTTL()).toBe(false);
      });
    });
  });

  describe('the printCacheControl method', () => {
    describe('when this._metadata.cacheControl has property values', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ cacheControl });
      });

      it('then the method should print a cache control with the updated maxAge based on the time ellapsed', async () => {
        await new Promise<void>(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });

        expect(cacheability.printCacheControl()).toBe('public, max-age=1, s-maxage=1');
      });
    });

    describe('when this._metadata.cacheControl does not have property values', () => {
      beforeEach(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.missingCacheControl) });
      });

      it('then the method should return an empty string', () => {
        expect(cacheability.printCacheControl()).toBe('');
      });
    });
  });
});
