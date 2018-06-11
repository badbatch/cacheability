import { expect } from "chai";
import { cacheControl, cacheHeaders, metadata, rawHeaders } from "~/.test";
import { Cacheability } from "~/cacheability";

describe("the cacheability class", () => {
  let cacheability: Cacheability;

  describe("the constructor", () => {
    context("when metadata is passed into the constructor", () => {
      before(() => {
        cacheability = new Cacheability({ metadata });
      });

      it("then the constructor should set metadata to this._metadata", () => {
        expect(cacheability.metadata).to.equal(metadata);
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

  describe("the set metadata method", () => {
    before(() => {
      cacheability = new Cacheability();
      cacheability.metadata = metadata;
    });

    it("the method should set metadata to this._metadata", () => {
      expect(cacheability.metadata).to.equal(metadata);
    });
  });

  describe("the checkTTL method", () => {
    context("when this._metadata.cacheControl has a property of maxAge", () => {
      beforeEach(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(rawHeaders.shortMaxAge));
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
        cacheability.parseHeaders(new Headers(rawHeaders.missingCacheControl));
      });

      it("then this._metadata.ttl is valid and the method should return true", () => {
        expect(cacheability.checkTTL()).to.equal(true);
      });
    });

    context("when this._metadata.cacheControl has a property of noCache", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(rawHeaders.noCache));
      });

      it("then this._metadata.ttl is invalid and the method should return false", () => {
        expect(cacheability.checkTTL()).to.equal(false);
      });
    });

    context("when this._metadata.cacheControl has a property of noStore", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(rawHeaders.noStore));
      });

      it("then this._metadata.ttl is invalid and the method should return false", () => {
        expect(cacheability.checkTTL()).to.equal(false);
      });
    });
  });

  describe("the parseHeaders method", () => {
    context("when the headers have a cache-control with a max-age", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(new Headers(rawHeaders.shortMaxAge));
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
        cacheability.parseHeaders(new Headers(rawHeaders.missingCacheControl));
      });

      it("then the method should parse the headers and set the resulting data to this._metadata", () => {
        expect(cacheability.metadata.cacheControl).to.deep.equal({});
        expect(cacheability.metadata.etag).to.equal(undefined);
        expect(cacheability.metadata.ttl).to.equal(Infinity);
      });
    });

    context("when the headers are a plain object", () => {
      before(() => {
        cacheability = new Cacheability();
        cacheability.parseHeaders(cacheHeaders);
      });

      it("then the method should parse the object and set the resulting data to this._metadata", () => {
        expect(cacheability.metadata.cacheControl.maxAge).to.equal(3);
        expect(cacheability.metadata.cacheControl.public).to.equal(true);
        expect(cacheability.metadata.etag).to.equal("33a64df551425fcc55e4d42a148795d9f25f89d4");
        expect(cacheability.metadata.ttl).to.be.a("number");
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
        cacheability.parseHeaders(new Headers(rawHeaders.missingCacheControl));
      });

      it("then the method should return an empty string", () => {
        expect(cacheability.printCacheControl()).to.equal("");
      });
    });
  });
});
