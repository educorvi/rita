# Untitled string in Date Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/dateResultUnit
```

What unit time intervals representing the result will be in.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [dateCalculation.json\*](../../src/schema/dateCalculation.json "open original schema") |

## dateResultUnit Type

`string`

## dateResultUnit Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | :---------- |
| `"seconds"` |             |
| `"minutes"` |             |
| `"hours"`   |             |
| `"days"`    |             |
| `"months"`  |             |
| `"years"`   |             |

## dateResultUnit Default Value

The default value is:

```json
"seconds"
```
