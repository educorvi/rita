# Macro Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/macro.json
```

Describes macros. Available macros are `now` and `length`

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                       |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [macro.json](../../src/schema/macro.json "open original schema") |

## Macro Type

`object` ([Macro](macro.md))

# Macro Properties

| Property        | Type     | Required | Nullable       | Defined by                                                                                                                        |
| :-------------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)   | `string` | Required | cannot be null | [Macro](macro-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/macro.json#/properties/type")   |
| [macro](#macro) | Merged   | Required | cannot be null | [Macro](macro-properties-macro.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/macro.json#/properties/macro") |

## type



`type`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Macro](macro-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/macro.json#/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value     | Explanation |
| :-------- | :---------- |
| `"macro"` |             |

## macro



`macro`

*   is required

*   Type: merged type ([Details](macro-properties-macro.md))

*   cannot be null

*   defined in: [Macro](macro-properties-macro.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/macro.json#/properties/macro")

### macro Type

merged type ([Details](macro-properties-macro.md))

one (and only one) of

*   [now](macro-properties-macro-oneof-now.md "check type definition")

*   [length](macro-properties-macro-oneof-length.md "check type definition")
