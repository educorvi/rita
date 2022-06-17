# Untitled string in Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/dateResultUnit
```

Which unit is to use when working with dates. For example, if two days are subtracted, should the result be in days, or months? Also usable, when adding days/months/years to a date

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                     |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [calculation.json\*](../../src/schema/calculation.json 'open original schema') |

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
