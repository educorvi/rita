# Untitled string in Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/dateCalculationUnit
```

Which unit is to use when adding/subtracting number from/with dates.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                     |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [calculation.json\*](../../src/schema/calculation.json 'open original schema') |

## dateCalculationUnit Type

`string`

## dateCalculationUnit Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | :---------- |
| `"seconds"` |             |
| `"minutes"` |             |
| `"hours"`   |             |
| `"days"`    |             |
| `"months"`  |             |
| `"years"`   |             |

## dateCalculationUnit Default Value

The default value is:

```json
"seconds"
```
