# Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json
```

Calculates a result

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                   |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :--------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [calculation.json](../../src/schema/calculation.json 'open original schema') |

## Calculation Type

`object` ([Calculation](calculation.md))

# Calculation Properties

| Property                                    | Type     | Required | Nullable       | Defined by                                                                                                                                                                      |
| :------------------------------------------ | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type)                               | `string` | Required | cannot be null | [Calculation](calculation-properties-type.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/type')                               |
| [operation](#operation)                     | `string` | Required | cannot be null | [Calculation](calculation-properties-operation.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/operation')                     |
| [arguments](#arguments)                     | `array`  | Required | cannot be null | [Calculation](calculation-properties-arguments.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/arguments')                     |
| [dateResultUnit](#dateresultunit)           | `string` | Optional | cannot be null | [Calculation](calculation-properties-dateresultunit.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/dateResultUnit')           |
| [dateCalculationUnit](#datecalculationunit) | `string` | Optional | cannot be null | [Calculation](calculation-properties-datecalculationunit.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/dateCalculationUnit') |

## type

`type`

-   is required

-   Type: `string`

-   cannot be null

-   defined in: [Calculation](calculation-properties-type.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/type')

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value           | Explanation |
| :-------------- | :---------- |
| `"calculation"` |             |

## operation

The mathematical operation to be calculated

`operation`

-   is required

-   Type: `string`

-   cannot be null

-   defined in: [Calculation](calculation-properties-operation.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/operation')

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

-   is required

-   Type: an array of merged types ([Details](calculation-properties-arguments-items.md))

-   cannot be null

-   defined in: [Calculation](calculation-properties-arguments.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/arguments')

### arguments Type

an array of merged types ([Details](calculation-properties-arguments-items.md))

### arguments Constraints

**minimum number of items**: the minimum number of items for this array is: `2`

## dateResultUnit

Which unit is to use when working with dates. For example, if two days are subtracted, should the result be in days, or months? Also usable, when adding days/months/years to a date

`dateResultUnit`

-   is optional

-   Type: `string`

-   cannot be null

-   defined in: [Calculation](calculation-properties-dateresultunit.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/dateResultUnit')

### dateResultUnit Type

`string`

### dateResultUnit Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | :---------- |
| `"seconds"` |             |
| `"minutes"` |             |
| `"hours"`   |             |
| `"days"`    |             |
| `"months"`  |             |
| `"years"`   |             |

### dateResultUnit Default Value

The default value is:

```json
"seconds"
```

## dateCalculationUnit

Which unit is to use when adding/subtracting number from/with dates.

`dateCalculationUnit`

-   is optional

-   Type: `string`

-   cannot be null

-   defined in: [Calculation](calculation-properties-datecalculationunit.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/calculation.json#/properties/dateCalculationUnit')

### dateCalculationUnit Type

`string`

### dateCalculationUnit Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | :---------- |
| `"seconds"` |             |
| `"minutes"` |             |
| `"hours"`   |             |
| `"days"`    |             |
| `"months"`  |             |
| `"years"`   |             |

### dateCalculationUnit Default Value

The default value is:

```json
"seconds"
```
