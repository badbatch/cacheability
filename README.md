# cacheability

A utility class to parse, store and print http cache headers.

[![Build Status](https://travis-ci.org/bad-batch/cacheability.svg?branch=master)](https://travis-ci.org/bad-batch/cacheability)
[![codecov](https://codecov.io/gh/bad-batch/cacheability/branch/master/graph/badge.svg)](https://codecov.io/gh/bad-batch/cacheability)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=sonarqube%3Acacheability&metric=alert_status)](https://sonarcloud.io/dashboard?id=sonarqube%3Acacheability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://badge.fury.io/js/cacheability.svg)](https://badge.fury.io/js/cacheability)
[![dependencies Status](https://david-dm.org/bad-batch/cacheability/status.svg)](https://david-dm.org/bad-batch/cacheability)
[![devDependencies Status](https://david-dm.org/bad-batch/cacheability/dev-status.svg)](https://david-dm.org/bad-batch/cacheability?type=dev)

## Installation

```bash
yarn add cacheability
```

## Documentation

### Initialisation

The constructor takes either a Headers instance, object literal of header key/values, cache-control header field value
or Cacheability metadata object, parses it, if required, and then stores the result on the Cacheability instance's
metadata property.

```javascript
import Cacheability from "cacheability";

const headers = new Headers({
  "cache-control": "public, max-age=60",
  "content-type": "application/json",
  "etag": "33a64df551425fcc55e4d42a148795d9f25f89d4",
});

const cacheability = new Cacheability({ headers });

const { cacheControl, etag, ttl } = cacheability.metadata;
// cacheControl is { maxAge: 60, public: true }
// etag is 33a64df551425fcc55e4d42a148795d9f25f89d4
// ttl is 1516060712991 if Date.now is 1516060501948
```

### Properties

#### metadata

The property holds the Cacheability instance's parsed cache headers data, including cache control directives, etag,
and a derived TTL timestamp.

### Methods

#### checkTTL

The method checks whether the TTL timestamp stored in the Cacheability instance is still valid, by comparing it to the
current timestamp.

```javascript
const cacheability = new Cacheability({ cacheControl: "public, max-age=3" });

// One second elapses...

const isValid = cacheability.checkTTL();
// isValid is true

// Three seconds elapse...

const isStillValid = cacheability.checkTTL();
// isStillValid is false
```

#### printCacheControl

The method prints a cache-control header field value based on the Cacheability instance's metadata. The max-age and/or
s-maxage are derived from the TTL stored in the metadata.

```javascript
const cacheability = new Cacheability({ cacheControl: "public, max-age=60, s-maxage=60" });

// Five seconds elapse...

const cacheControl = cacheability.printCacheControl();
// cacheControl is "public, max-age=55, s-maxage=55"
```

Additional documentation can be found on the Cacheability [github pages](https://bad-batch.github.io/cacheability/).

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

Cacheability is [MIT Licensed](LICENSE).