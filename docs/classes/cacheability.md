[Documentation](../README.md) › [Cacheability](cacheability.md)

# Class: Cacheability

A utility class to parse, store and print http cache headers.

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

*Defined in [main/index.ts:92](https://github.com/bad-batch/cacheability/blob/311cae7/src/main/index.ts#L92)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`args` | [CacheabilityArgs](../interfaces/cacheabilityargs.md) | {} |

**Returns:** *[Cacheability](cacheability.md)*

## Properties

###  metadata

• **metadata**: *[Metadata](../interfaces/metadata.md)*

*Defined in [main/index.ts:92](https://github.com/bad-batch/cacheability/blob/311cae7/src/main/index.ts#L92)*

The property holds the Cacheability instance's parsed cache
headers data, including cache control directives, etag, and
a derived TTL timestamp.

## Methods

###  checkTTL

▸ **checkTTL**(): *boolean*

*Defined in [main/index.ts:114](https://github.com/bad-batch/cacheability/blob/311cae7/src/main/index.ts#L114)*

The method checks whether the TTL timestamp stored in the Cacheability
instance is still valid, by comparing it to the current timestamp.

**Returns:** *boolean*

___

###  printCacheControl

▸ **printCacheControl**(): *string*

*Defined in [main/index.ts:123](https://github.com/bad-batch/cacheability/blob/311cae7/src/main/index.ts#L123)*

The method prints a cache-control header field value based on
the Cacheability instance's metadata. The max-age and/or s-maxage
are derived from the TTL stored in the metadata.

**Returns:** *string*
