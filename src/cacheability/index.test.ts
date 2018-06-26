import { expect } from "chai";
import {
  cacheControl,
  cacheHeaders,
  defaultMetadata,
  metadata,
  rawHeaders,
} from "../__test__";
import Cacheability from "../cacheability";

describe("the cacheability class", () => {
  let cacheability: Cacheability;

  describe("the constructor", () => {
    context("when nothing is passed into the constructor", () => {
      before(() => {
        cacheability = new Cacheability();
      });

      it("then the constructor should set the default metadata to this._metadata", () => {
        expect(cacheability.metadata).to.deep.equal(defaultMetadata);
      });
    });

    context("when metadata is passed into the constructor", () => {
      before(() => {
        cacheability = new Cacheability({ metadata });
      });

      it("then the constructor should set metadata to this._metadata", () => {
        expect(cacheability.metadata).to.deep.equal(metadata);
      });
    });

    context("when headers is passed into the constructor", () => {
      context("when headers is an instance of Headers", () => {
        before(() => {
          cacheability = new Cacheability({ headers: new Headers(rawHeaders.shortMaxAge) });
        });

        it("then the constructor should parse the headers and set the resulting data to this._metadata", () => {
          expect(cacheability.metadata.cacheControl.maxAge).to.equal(1);
          expect(cacheability.metadata.cacheControl.public).to.equal(true);
          expect(cacheability.metadata.etag).to.equal("33a64df551425fcc55e4d42a148795d9f25f89d4");
          expect(cacheability.metadata.ttl).to.be.a("number");
        });
      });

      context("when headers is a plain object", () => {
        before(() => {
          cacheability = new Cacheability({ headers: cacheHeaders });
        });

        it("then the constructor should parse the headers and set the resulting data to this._metadata", () => {
          expect(cacheability.metadata.cacheControl.maxAge).to.equal(3);
          expect(cacheability.metadata.cacheControl.public).to.equal(true);
          expect(cacheability.metadata.etag).to.equal("33a64df551425fcc55e4d42a148795d9f25f89d4");
          expect(cacheability.metadata.ttl).to.be.a("number");
        });
      });
    });

    context("when cacheControl is passed into the constructor", () => {
      before(() => {
        cacheability = new Cacheability({ cacheControl });
      });

      it("then the constructor should parse the cacheControl and set the resulting data to this._metadata", () => {
        expect(cacheability.metadata.cacheControl.maxAge).to.equal(2);
        expect(cacheability.metadata.cacheControl.public).to.equal(true);
        expect(cacheability.metadata.ttl).to.be.a("number");
      });
    });
  });

  describe("the checkTTL method", () => {
    context("when this._metadata.cacheControl has a property of maxAge", () => {
      beforeEach(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.shortMaxAge) });
      });

      context("when this._metadata.ttl is valid", () => {
        it("then the method should return true", () => {
          expect(cacheability.checkTTL()).to.equal(true);
        });
      });

      context("when this._metadata.ttl has expired", () => {
        it("then the method should return false", (done) => {
          setTimeout(() => {
            expect(cacheability.checkTTL()).to.equal(false);
            done();
          }, 1000);
        });
      });
    });

    context("when this._metadata.cacheControl does not have a property of maxAge", () => {
      before(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.missingCacheControl) });
      });

      it("then this._metadata.ttl is valid and the method should return true", () => {
        expect(cacheability.checkTTL()).to.equal(true);
      });
    });

    context("when this._metadata.cacheControl has a property of noCache", () => {
      before(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.noCache) });
      });

      it("then this._metadata.ttl is invalid and the method should return false", () => {
        expect(cacheability.checkTTL()).to.equal(false);
      });
    });

    context("when this._metadata.cacheControl has a property of noStore", () => {
      before(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.noStore) });
      });

      it("then this._metadata.ttl is invalid and the method should return false", () => {
        expect(cacheability.checkTTL()).to.equal(false);
      });
    });
  });

  describe("the printCacheControl method", () => {
    context("when this._metadata.cacheControl has property values", () => {
      before(() => {
        cacheability = new Cacheability({ cacheControl });
      });

      it("then the method should print a cache control with the updated maxAge based on the time ellapsed", (done) => {
        setTimeout(() => {
          expect(cacheability.printCacheControl()).to.equal("public, max-age=1, s-maxage=1");
          done();
        }, 1000);
      });
    });

    context("when this._metadata.cacheControl does not have property values", () => {
      before(() => {
        cacheability = new Cacheability({ headers: new Headers(rawHeaders.missingCacheControl) });
      });

      it("then the method should return an empty string", () => {
        expect(cacheability.printCacheControl()).to.equal("");
      });
    });
  });
});
