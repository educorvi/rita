# Untitled string in Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json#/properties/operation
```

The mathematical operation to be calculated. Modulo refers to the function mod(a,b)=a-(floor(a/b)\*b)

| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                     |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [calculation.json\*](../../src/schema/calculation.json "open original schema") |

## operation Type

`string`

## operation Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"add"`      |             |
| `"subtract"` |             |
| `"multiply"` |             |
| `"divide"`   |             |
| `"modulo"`   |             |
