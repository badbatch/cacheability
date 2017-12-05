import { expect } from "chai";
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

  describe("the checkTTL method", () => {
    beforeEach(() => {
      cacheability.parseHeaders(new Headers(headers));
    });

    afterEach(() => {
      cacheability.setMetadata();
    });

    context("when ttl is valid", () => {
      it("then the method should return true", () => {
        expect(cacheability.checkTTL()).to.equal(true);
      });
    });

    context("when ttl is not valid", () => {
      it("then the method should return false", (done) => {
        setTimeout(() => {
          expect(cacheability.checkTTL()).to.equal(false);
          done();
        }, 1000);
      });
    });
  });

  describe("the parseHeaders method", () => {
    afterEach(() => {
      cacheability.setMetadata();
    });

    context("when headers is not an instance of the Headers class or a plain object", () => {
      it("then the method should set metadata to an empty object", () => {
        const metadata = cacheability.parseHeaders(null);
        expect(cacheability.metadata).to.equal(metadata);
        expect(metadata).to.deep.equal({});
      });
    });

    context("when headers is an instance of the Headers class", () => {
      it("then the method should parse the headers and set the resulting data to the metadata", () => {
        const metadata = cacheability.parseHeaders(new Headers(headers));
        expect(cacheability.metadata).to.equal(metadata);
        expect(metadata.cacheControl.maxAge).to.equal(1);
        expect(metadata.cacheControl.public).to.equal(true);
        expect(metadata.etag).to.equal("33a64df551425fcc55e4d42a148795d9f25f89d4");
        expect(metadata.ttl).to.be.a("number");
      });
    });

    context("when headers is a plain object", () => {
      it("then the method should parse the headers and set the resulting data to the metadata", () => {
        const metadata = cacheability.parseHeaders(cacheHeaders);
        expect(cacheability.metadata).to.equal(metadata);
        expect(metadata.cacheControl.maxAge).to.equal(3);
        expect(metadata.cacheControl.public).to.equal(true);
        expect(metadata.etag).to.eql("33a64df551425fcc55e4d42a148795d9f25f89d4");
        expect(metadata.ttl).to.be.a("number");
      });
    });
  });

  describe("the parseCacheControl method", () => {
    afterEach(() => {
      cacheability.setMetadata();
    });

    context("when cacheControl is not a string", () => {
      it("then the method should set metadata to an empty object", () => {
        const metadata = cacheability.parseCacheControl(null);
        expect(cacheability.metadata).to.equal(metadata);
        expect(metadata).to.deep.equal({});
      });
    });

    context("when cacheControl is a string", () => {
      it("then the method should parse the cache control and set the resulting data to the metadata", () => {
        const metadata = cacheability.parseCacheControl(cacheControl);
        expect(cacheability.metadata).to.equal(metadata);
        expect(metadata.cacheControl.maxAge).to.equal(2);
        expect(metadata.cacheControl.public).to.equal(true);
        expect(metadata.ttl).to.be.a("number");
      });
    });
  });

  describe("the printCacheControl method", () => {
    beforeEach(() => {
      cacheability.parseCacheControl(cacheControl);
    });

    afterEach(() => {
      cacheability.setMetadata();
    });

    context("when the method is executed", () => {
      it("then the method should print a cache control with updated maxAge based on time ellapsed", (done) => {
        setTimeout(() => {
          expect(cacheability.printCacheControl()).to.equal("public, max-age=1");
          done();
        }, 1000);
      });
    });
  });
});
