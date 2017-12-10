import { expect } from "chai";
import Cacheability from "../../src";

const cacheControl = "public, max-age=2, s-maxage=2";

const cacheHeadersMissing = {
  "content-type": "application/json",
};

const defaultHeaders = {
  "cache-control": "public, max-age=1",
  "content-type": "application/json",
  "etag": "33a64df551425fcc55e4d42a148795d9f25f89d4",
};

describe("the cacheability class", () => {
  let cacheability: Cacheability;

  describe("the checkTTL method", () => {
    context("when this._metadata.cacheControl has a property of maxAge", () => {
      beforeEach(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(defaultHeaders));
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
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(cacheHeadersMissing));
      });

      it("then this._metadata.ttl is valid and the method should return true", () => {
        expect(cacheability.checkTTL()).to.equal(true);
      });
    });
  });

  describe("the parseHeaders method", () => {
    context("when the headers have a cache-control with a max-age", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(defaultHeaders));
      });

      it("then the method should parse the headers and set the resulting data to this._metadata", () => {
        expect(cacheability.metadata.cacheControl.maxAge).to.equal(1);
        expect(cacheability.metadata.cacheControl.public).to.equal(true);
        expect(cacheability.metadata.etag).to.equal("33a64df551425fcc55e4d42a148795d9f25f89d4");
        expect(cacheability.metadata.ttl).to.be.a("number");
      });
    });

    context("when the headers do not have a cache-control", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(cacheHeadersMissing));
      });

      it("then the method should parse the headers and set the resulting data to this._metadata", () => {
        expect(cacheability.metadata.cacheControl).to.deep.equal({});
        expect(cacheability.metadata.etag).to.equal(undefined);
        expect(cacheability.metadata.ttl).to.equal(Infinity);
      });
    });
  });

  describe("the parseCacheControl method", () => {
    context("when the cache-control has a max-age", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseCacheControl(cacheControl);
      });

      it("then the method should parse the cache control and set the resulting data to this._metadata", () => {
        expect(cacheability.metadata.cacheControl.maxAge).to.equal(2);
        expect(cacheability.metadata.cacheControl.public).to.equal(true);
        expect(cacheability.metadata.ttl).to.be.a("number");
      });
    });
  });

  describe("the printCacheControl method", () => {
    context("when this._metadata.cacheControl has property values", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseCacheControl(cacheControl);
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
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(cacheHeadersMissing));
      });

      it("then the method should return an empty string", () => {
        expect(cacheability.printCacheControl()).to.equal("");
      });
    });
  });
});
