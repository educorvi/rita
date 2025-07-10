# Non-Unary operator Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/operator.json#/oneOf/0
```

Requires at least two arguments

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                               |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [operator.json\*](../../src/schema/operator.json "open original schema") |

## 0 Type

`object` ([Non-Unary operator](operator-oneof-non-unary-operator.md))

# 0 Properties

| Property                | Type     | Required | Nullable       | Defined by                                                                                                                                                                                             |
| :---------------------- | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)           | `string` | Required | cannot be null | [Operator](operator-oneof-non-unary-operator-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/operator.json#/oneOf/0/properties/type")                    |
| [arguments](#arguments) | `array`  | Required | cannot be null | [Operator](operator-oneof-non-unary-operator-properties-multiple-arguments.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/operator.json#/oneOf/0/properties/arguments") |

## type



`type`

* is required

* Type: `string`

* cannot be null

* defined in: [Operator](operator-oneof-non-unary-operator-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/operator.json#/oneOf/0/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value   | Explanation |
| :------ | :---------- |
| `"and"` |             |
| `"or"`  |             |

## arguments



`arguments`

* is required

* Type: an array of merged types ([Formula](formula.md))

* cannot be null

* defined in: [Operator](operator-oneof-non-unary-operator-properties-multiple-arguments.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/operator.json#/oneOf/0/properties/arguments")

### arguments Type

an array of merged types ([Formula](formula.md))

### arguments Constraints

**minimum number of items**: the minimum number of items for this array is: `2`
