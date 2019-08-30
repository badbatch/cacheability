import { isNumber } from "lodash";
import Cacheability from ".";
import { cacheControl, cacheHeaders, defaultMetadata, metadata, rawHeaders } from "../__test__/data";

describe("the cacheability class", () => {
  let cacheability: Cacheability;

  describe("the constructor", () => {
    describe("when nothing is passed into the constructor", () => {
      beforeAll(() => {
        cacheability = new Cacheability();
      });

      it("then the constructor should set the default metadata to this._metadata", () => {
        expect(cacheability.metadata).toEqual(defaultMetadata);
      });
    });

    describe("when metadata is passed into the constructor", () => {
      beforeAll(() => {
        cacheability = new Cacheability({ metadata });
      });

      it("then the constructor should set metadata to this._metadata", () => {
        expect(cacheability.metadata).toEqual(metadata);
      });
    });

    describe("when headers is passed into the constructor", () => {
      describe("when headers is an instance of Headers", () => {
        beforeAll(() => {
          cacheability = new Cacheability({ headers: new Headers(rawHeaders.shortMaxAge) });
        });

        it("then the constructor should parse the headers and set the resulting data to this._metadata", () => {
          expect(cacheability.metadata.cacheControl.maxAge).toEqual(1);
          expect(cacheability.metadata.cacheControl.public).toEqual(true);
          expect(cacheability.metadata.etag).toEqual("33a64df551425fcc55e4d42a148795d9f25f89d4");
          expect(isNumber(cacheability.metadata.ttl)).toBe(true);
        });
      });

      describe("when headers is a plain object", () => {
        beforeAll(() => {
          cacheability = new Cacheability({ headers: cacheHeaders });
        });

        it("then the constructor should parse the headers and set the resulting data to this._metadata", () => {
          expect(cacheability.metadata.cacheControl.maxAge).toEqual(3);
          expect(cacheability.metadata.cacheControl.public).toEqual(true);
          expect(cacheability.metadata.etag).toEqual("33a64df551425fcc55e4d42a148795d9f25f89d4");
          expect(isNumber(cacheability.metadata.ttl)).toBe(true);
        });
      });
    });

    describe("when cacheControl is passed into the constructor", () => {
      beforeAll(() => {
        cacheability = new Cacheability({ cacheControl });
      });

      it("then the constructor should parse the cacheControl and set the resulting data to this._metadata", () => {
        expect(cacheability.metadata.cacheControl.maxAge).toEqual(2);
        expect(cacheability.metadata.cacheControl.public).toEqual(true);
        expect(isNumber(cacheability.metadata.ttl)).toBe(true);
      });
    });
  });

  describe("the checkTTL method", () => {
    describe("when this._metadata.cacheControl has a property of maxAge", () => {
      beforeEach(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.shortMaxAge) });
      });

      describe("when this._metadata.ttl is valid", () => {
        it("then the method should return true", () => {
          expect(cacheability.checkTTL()).toEqual(true);
        });
      });

      describe("when this._metadata.ttl has expired", () => {
        it("then the method should return false", done => {
          setTimeout(() => {
            expect(cacheability.checkTTL()).toEqual(false);
            done();
          }, 1000);
        });
      });
    });

    describe("when this._metadata.cacheControl does not have a property of maxAge", () => {
      beforeAll(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.missingCacheControl) });
      });

      it("then this._metadata.ttl is valid and the method should return true", () => {
        expect(cacheability.checkTTL()).toEqual(true);
      });
    });

    describe("when this._metadata.cacheControl has a property of noCache", () => {
      beforeAll(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.noCache) });
      });

      it("then this._metadata.ttl is invalid and the method should return false", () => {
        expect(cacheability.checkTTL()).toEqual(false);
      });
    });

    describe("when this._metadata.cacheControl has a property of noStore", () => {
      beforeAll(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.noStore) });
      });

      it("then this._metadata.ttl is invalid and the method should return false", () => {
        expect(cacheability.checkTTL()).toEqual(false);
      });
    });
  });

  describe("the printCacheControl method", () => {
    describe("when this._metadata.cacheControl has property values", () => {
      beforeAll(() => {
        cacheability = new Cacheability({ cacheControl });
      });

      it("then the method should print a cache control with the updated maxAge based on the time ellapsed", done => {
        setTimeout(() => {
          expect(cacheability.printCacheControl()).toEqual("public, max-age=1, s-maxage=1");
          done();
        }, 1000);
      });
    });

    describe("when this._metadata.cacheControl does not have property values", () => {
      beforeAll(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.missingCacheControl) });
      });

      it("then the method should return an empty string", () => {
        expect(cacheability.printCacheControl()).toEqual("");
      });
    });
  });
});
