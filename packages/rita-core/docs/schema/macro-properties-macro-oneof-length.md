# length Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/macro.json#/properties/macro/oneOf/1
```

Returns the length of an array

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                         |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [macro.json\*](../../src/schema/macro.json "open original schema") |

## 1 Type

`object` ([length](macro-properties-macro-oneof-length.md))

# 1 Properties

| Property        | Type     | Required | Nullable       | Defined by                                                                                                                                                                                       |
| :-------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)   | `string` | Optional | cannot be null | [Macro](macro-properties-macro-oneof-length-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/macro.json#/properties/macro/oneOf/1/properties/type") |
| [array](#array) | `object` | Optional | cannot be null | [Macro](atom.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/atom.json#/properties/macro/oneOf/1/properties/array")                                                |

## type



`type`

* is optional

* Type: `string`

* cannot be null

* defined in: [Macro](macro-properties-macro-oneof-length-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/macro.json#/properties/macro/oneOf/1/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"length"` |             |

## array

Describes an atom. Those can be used to read Data

`array`

* is optional

* Type: `object` ([Atom](atom.md))

* cannot be null

* defined in: [Macro](atom.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/atom.json#/properties/macro/oneOf/1/properties/array")

### array Type

`object` ([Atom](atom.md))
