# Main Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/schema.json
```

The entrypoint of the Rita schema

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                         |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [schema.json](../../src/schema/schema.json "open original schema") |

## Main Type

`object` ([Main](schema.md))

# Main Properties

| Property        | Type    | Required | Nullable       | Defined by                                                                                                                           |
| :-------------- | :------ | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [rules](#rules) | `array` | Required | cannot be null | [Main](schema-properties-ruleset.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/schema.json#/properties/rules") |

## rules

Array of all rules in this ruleset.

`rules`

*   is required

*   Type: `object[]` ([Rule](rule.md))

*   cannot be null

*   defined in: [Main](schema-properties-ruleset.md "https://raw.githubusercontent.com/educorvi/rita/main/src/schema/schema.json#/properties/rules")

### rules Type

`object[]` ([Rule](rule.md))
