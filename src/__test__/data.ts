export const rawHeaders = {
  missingCacheControl: {
    "content-type": "application/json",
  },
  noCache: {
    "cache-control": "public, no-cache",
    "content-type": "application/json",
    etag: "33a64df551425fcc55e4d42a148795d9f25f89d4",
  },
  noStore: {
    "cache-control": "public, no-store",
    "content-type": "application/json",
    etag: "33a64df551425fcc55e4d42a148795d9f25f89d4",
  },
  shortMaxAge: {
    "cache-control": "public, max-age=1",
    "content-type": "application/json",
    etag: "33a64df551425fcc55e4d42a148795d9f25f89d4",
  },
};

export const cacheHeaders = {
  cacheControl: "public, max-age=3",
  etag: "33a64df551425fcc55e4d42a148795d9f25f89d4",
};

export const cacheControl = "public, max-age=2, s-maxage=2";

export const defaultMetadata = {
  cacheControl: {},
  ttl: Infinity,
};

export const metadata = {
  cacheControl: { maxAge: 5, public: true },
  etag: "33a64df551425fcc55e4d42a148795d9f25f89d4",
  ttl: 1512917159801,
};
