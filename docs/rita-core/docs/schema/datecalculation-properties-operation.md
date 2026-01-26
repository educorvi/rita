# Untitled string in Date Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/operation
```

Add/subtract a time interval to/from a date or subtract two dates to get the interval between them. If the first date is earlier than the second one, the result will be negative.

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                             |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [dateCalculation.json\*](../../src/schema/dateCalculation.json "open original schema") |

## operation Type

`string`

## operation Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"add"`      |             |
| `"subtract"` |             |
