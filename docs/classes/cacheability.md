**[Documentation](../README.md)**

[Globals](../README.md) › [Cacheability](cacheability.md)

# Class: Cacheability

A utility class to parse, store and print http cache headers.

```typescript
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

## Hierarchy

* **Cacheability**

## Index

### Constructors

* [constructor](cacheability.md#constructor)

### Properties

* [metadata](cacheability.md#metadata)

### Methods

* [checkTTL](cacheability.md#checkttl)
* [printCacheControl](cacheability.md#printcachecontrol)

## Constructors

###  constructor

\+ **new Cacheability**(`args`: [CacheabilityArgs](../interfaces/cacheabilityargs.md)): *[Cacheability](cacheability.md)*

*Defined in [main/index.ts:109](https://github.com/bad-batch/cacheability/blob/9e3b985/src/main/index.ts#L109)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`args` | [CacheabilityArgs](../interfaces/cacheabilityargs.md) |  {} |

**Returns:** *[Cacheability](cacheability.md)*

## Properties

###  metadata

• **metadata**: *[Metadata](../interfaces/metadata.md)*

*Defined in [main/index.ts:109](https://github.com/bad-batch/cacheability/blob/9e3b985/src/main/index.ts#L109)*

The property holds the Cacheability instance's parsed cache
headers data, including cache control directives, etag, and
a derived TTL timestamp.

## Methods

###  checkTTL

▸ **checkTTL**(): *boolean*

*Defined in [main/index.ts:145](https://github.com/bad-batch/cacheability/blob/9e3b985/src/main/index.ts#L145)*

The method checks whether the TTL timestamp stored in the Cacheability
instance is still valid, by comparing it to the current timestamp.

```typescript
const cacheability = new Cacheability({ cacheControl: "public, max-age=3" });

// One second elapses...

const isValid = cacheability.checkTTL();
// isValid is true

// Three seconds elapse...

const isStillValid = cacheability.checkTTL();
// isStillValid is false
```

**Returns:** *boolean*

___

###  printCacheControl

▸ **printCacheControl**(): *string*

*Defined in [main/index.ts:163](https://github.com/bad-batch/cacheability/blob/9e3b985/src/main/index.ts#L163)*

The method prints a cache-control header field value based on
the Cacheability instance's metadata. The max-age and/or s-maxage
are derived from the TTL stored in the metadata.

```typescript
const cacheability = new Cacheability({ cacheControl: "public, max-age=60, s-maxage=60" });

// Five seconds elapse...

const cacheControl = cacheability.printCacheControl();
// cacheControl is "public, max-age=55, s-maxage=55"
```

**Returns:** *string*