import { expect } from "chai";
import "mocha";
import Cacheability from "../../src";

const cacheControl = "public, max-age=2";

const cacheHeaders = {
  cacheControl: "public, max-age=3",
  etag: "33a64df551425fcc55e4d42a148795d9f25f89d4",
};

const headers = {
  "cache-control": "public, max-age=1",
  "content-type": "application/json",
  "etag": "33a64df551425fcc55e4d42a148795d9f25f89d4",
};

describe("the cacheability class", () => {
  let cacheability: Cacheability;

  before(() => {
    cacheability = new Cacheability();
  });

  describe("when parsing a headers response object", () => {
    after(() => {
      cacheability.setMetadata();
    });

    describe("when headers is not an instance of the Headers class or a plain object", () => {
      it("should set metadata to an empty object", () => {
        const metadata = cacheability.parseHeaders(null);
        expect(metadata).to.deep.equal({});
      });
    });

    describe("when headers is an instance of the Headers class", () => {
      it("should parse the headers and set the resulting data to the metadata", () => {
        const metadata = cacheability.parseHeaders(new Headers(headers));
        expect(metadata.cacheControl.maxAge).to.equal(1);
        expect(metadata.cacheControl.public).to.equal(true);
        expect(metadata.etag).to.equal("33a64df551425fcc55e4d42a148795d9f25f89d4");
        expect(metadata.ttl).to.be.a("number");
      });

      describe("when the ttl is valid", () => {
        it("should return true from the .checkTTL() method", () => {
          expect(cacheability.checkTTL()).to.equal(true);
        });
      });

      describe("when the ttl is not valid", () => {
        it("should return false from the .checkTTL() method", (done) => {
          setTimeout(() => {
            expect(cacheability.checkTTL()).to.equal(false);
            done();
          }, 1000);
        });
      });
    });

    describe("when headers is a plain object", () => {
      it("should parse the headers and set the resulting data to the metadata", () => {
        const metadata = cacheability.parseHeaders(new Headers(cacheHeaders));
        expect(metadata.cacheControl.maxAge).to.equal(3);
        expect(metadata.cacheControl.public).to.equal(true);
        expect(metadata.etag).to.eql("33a64df551425fcc55e4d42a148795d9f25f89d4");
        expect(metadata.ttl).to.be.a("number");
      });
    });
  });

  describe("when parsing a cache control string", () => {
    after(() => {
      cacheability.setMetadata();
    });

    describe("when the param is not a string", () => {
      it("should set metadata to an empty object", () => {
        const metadata = cacheability.parseCacheControl(null);
        expect(metadata).to.deep.equal({});
      });
    });

    describe("when the param is a string", () => {
      it("should parse the cache control and set the resulting data to the metadata", () => {
        const metadata = cacheability.parseCacheControl(cacheControl);
        expect(metadata.cacheControl.maxAge).to.equal(2);
        expect(metadata.cacheControl.public).to.equal(true);
        expect(metadata.ttl).to.be.a("number");
      });
    });

    describe("when printing a cache control string", () => {
      it("should print a cache control with updated maxAge based on time ellapsed", (done) => {
        setTimeout(() => {
          expect(cacheability.printCacheControl()).to.equal("public, max-age=1");
          done();
        }, 1000);
      });
    });
  });
});
