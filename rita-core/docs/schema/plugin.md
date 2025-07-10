# Plugin Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/plugin.json
```

Describes an plugin

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                         |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [plugin.json](../../src/schema/plugin.json "open original schema") |

## Plugin Type

`object` ([Plugin](plugin.md))

## Plugin Examples

```json
{
  "type": "plugin",
  "name": "http",
  "options": {
    "url": "https://example.com/api"
  },
  "formula": {
    "type": "atom",
    "path": "keyInResponse"
  }
}
```

# Plugin Properties

| Property            | Type     | Required | Nullable       | Defined by                                                                                                                                         |
| :------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)       | `string` | Required | cannot be null | [Plugin](plugin-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/plugin.json#/properties/type")       |
| [name](#name)       | `string` | Required | cannot be null | [Plugin](plugin-properties-name.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/plugin.json#/properties/name")       |
| [formula](#formula) | Merged   | Required | cannot be null | [Plugin](formula.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/formula.json#/properties/formula")                  |
| [options](#options) | `object` | Optional | cannot be null | [Plugin](plugin-properties-options.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/plugin.json#/properties/options") |

## type



`type`

* is required

* Type: `string`

* cannot be null

* defined in: [Plugin](plugin-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/plugin.json#/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"plugin"` |             |

## name

The plugins name

`name`

* is required

* Type: `string`

* cannot be null

* defined in: [Plugin](plugin-properties-name.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/plugin.json#/properties/name")

### name Type

`string`

## formula



`formula`

* is required

* Type: merged type ([Formula](formula.md))

* cannot be null

* defined in: [Plugin](formula.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/formula.json#/properties/formula")

### formula Type

merged type ([Formula](formula.md))

one (and only one) of

* one (and only one) of

  * [Non-Unary operator](operator-oneof-non-unary-operator.md "check type definition")

  * [Unary operator](operator-oneof-unary-operator.md "check type definition")

* [Atom](atom.md "check type definition")

* [Plugin](plugin.md "check type definition")

* [Comparison](comparison.md "check type definition")

* [Quantifier](quantifier.md "check type definition")

## options

The plugins options

`options`

* is optional

* Type: `object` ([Details](plugin-properties-options.md))

* cannot be null

* defined in: [Plugin](plugin-properties-options.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/plugin.json#/properties/options")

### options Type

`object` ([Details](plugin-properties-options.md))
