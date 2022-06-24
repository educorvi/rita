# Atom Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/atom.json
```

Describes an atom. Those can be used to read Data

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                     |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [atom.json](../../src/schema/atom.json "open original schema") |

## Atom Type

`object` ([Atom](atom.md))

# Atom Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                   |
| :------------ | :------- | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| [type](#type) | `string` | Required | cannot be null | [Atom](atom-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/atom.json#/properties/type") |
| [path](#path) | `string` | Required | cannot be null | [Atom](atom-properties-path.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/atom.json#/properties/path") |

## type



`type`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Atom](atom-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/atom.json#/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | :---------- |
| `"atom"` |             |

## path

The path to the atom in the data

`path`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Atom](atom-properties-path.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/atom.json#/properties/path")

### path Type

`string`
