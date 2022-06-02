# Untitled string in Comparison Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/comparison.json#/properties/operation
```

Selects how the arguments should be compared

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                   |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [comparison.json\*](../../src/schema/comparison.json "open original schema") |

## operation Type

`string`

## operation Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value              | Explanation |
| :----------------- | :---------- |
| `"greater"`        |             |
| `"smaller"`        |             |
| `"greaterOrEqual"` |             |
| `"smallerOrEqual"` |             |
| `"equal"`          |             |
