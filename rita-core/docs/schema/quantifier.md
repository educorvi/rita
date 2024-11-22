# Quantifier Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json
```

Quantifiers that can be used to evaluate rules on arrays in Data

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                 |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [quantifier.json](../../src/schema/quantifier.json "open original schema") |

## Quantifier Type

`object` ([Quantifier](quantifier.md))

## Quantifier Examples

```json
{
  "type": "forall",
  "array": {
    "type": "atom",
    "path": "arrayOfIntValues"
  },
  "placeholder": "forallItem",
  "rule": {
    "type": "comparison",
    "operation": "greater",
    "arguments": [
      5,
      {
        "type": "atom",
        "path": "forallItem"
      }
    ]
  }
}
```

# Quantifier Properties

| Property                              | Type     | Required | Nullable       | Defined by                                                                                                                                                                       |
| :------------------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)                         | `string` | Required | cannot be null | [Quantifier](quantifier-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/type")                         |
| [array](#array)                       | Merged   | Required | cannot be null | [Quantifier](quantifier-properties-data-array.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/array")                  |
| [placeholder](#placeholder)           | `string` | Required | cannot be null | [Quantifier](quantifier-properties-placeholder.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/placeholder")           |
| [indexPlaceholder](#indexplaceholder) | `string` | Optional | cannot be null | [Quantifier](quantifier-properties-indexplaceholder.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/indexPlaceholder") |
| [rule](#rule)                         | Merged   | Required | cannot be null | [Quantifier](formula.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/formula.json#/properties/rule")                                               |

## type



`type`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Quantifier](quantifier-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"forall"` |             |
| `"exists"` |             |

## array

This can either be an Atom that references an array in the data, or an array of rules

`array`

*   is required

*   Type: merged type ([Data array](quantifier-properties-data-array.md))

*   cannot be null

*   defined in: [Quantifier](quantifier-properties-data-array.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/array")

### array Type

merged type ([Data array](quantifier-properties-data-array.md))

one (and only one) of

*   [Untitled array in Quantifier](quantifier-properties-data-array-oneof-0.md "check type definition")

*   [Atom](atom.md "check type definition")

## placeholder

This is a placeholder name for the current array object. This is the property name with wich you can reference the current value in the subsequent rule

`placeholder`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Quantifier](quantifier-properties-placeholder.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/placeholder")

### placeholder Type

`string`

### placeholder Constraints

**minimum length**: the minimum number of characters for this string is: `1`

## indexPlaceholder

This is a placeholder name for the current index of the array object. This is the property name with wich you can reference the current index in the subsequent rule

`indexPlaceholder`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Quantifier](quantifier-properties-indexplaceholder.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/quantifier.json#/properties/indexPlaceholder")

### indexPlaceholder Type

`string`

### indexPlaceholder Constraints

**minimum length**: the minimum number of characters for this string is: `1`

### indexPlaceholder Default Value

The default value is:

```json
"index"
```

## rule



`rule`

*   is required

*   Type: merged type ([Formula](formula.md))

*   cannot be null

*   defined in: [Quantifier](formula.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/formula.json#/properties/rule")

### rule Type

merged type ([Formula](formula.md))

one (and only one) of

*   one (and only one) of

    *   [Non-Unary operator](operator-oneof-non-unary-operator.md "check type definition")

    *   [Unary operator](operator-oneof-unary-operator.md "check type definition")

*   [Atom](atom.md "check type definition")

*   [Plugin](plugin.md "check type definition")

*   [Comparison](comparison.md "check type definition")

*   [Quantifier](quantifier.md "check type definition")
