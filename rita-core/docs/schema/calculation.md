# Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json
```

Calculates a result

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                   |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [calculation.json](../../src/schema/calculation.json "open original schema") |

## Calculation Type

`object` ([Calculation](calculation.md))

# Calculation Properties

| Property                | Type     | Required | Nullable       | Defined by                                                                                                                                                            |
| :---------------------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)           | `string` | Required | cannot be null | [Calculation](calculation-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json#/properties/type")           |
| [operation](#operation) | `string` | Required | cannot be null | [Calculation](calculation-properties-operation.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json#/properties/operation") |
| [arguments](#arguments) | `array`  | Required | cannot be null | [Calculation](calculation-properties-arguments.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json#/properties/arguments") |

## type



`type`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Calculation](calculation-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json#/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value           | Explanation |
| :-------------- | :---------- |
| `"calculation"` |             |

## operation

The mathematical operation to be calculated. Modulo refers to the function mod(a,b)=a-(floor(a/b)\*b)

`operation`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Calculation](calculation-properties-operation.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json#/properties/operation")

### operation Type

`string`

### operation Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"add"`      |             |
| `"subtract"` |             |
| `"multiply"` |             |
| `"divide"`   |             |
| `"modulo"`   |             |

## arguments



`arguments`

*   is required

*   Type: an array of merged types ([Details](calculation-properties-arguments-items.md))

*   cannot be null

*   defined in: [Calculation](calculation-properties-arguments.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/calculation.json#/properties/arguments")

### arguments Type

an array of merged types ([Details](calculation-properties-arguments-items.md))

### arguments Constraints

**minimum number of items**: the minimum number of items for this array is: `2`
