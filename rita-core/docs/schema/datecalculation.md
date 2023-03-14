# Date Calculation Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json
```

Calculations involving dates

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                           |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [dateCalculation.json](../../src/schema/dateCalculation.json "open original schema") |

## Date Calculation Type

`object` ([Date Calculation](datecalculation.md))

# Date Calculation Properties

| Property                                    | Type     | Required | Nullable       | Defined by                                                                                                                                                                                             |
| :------------------------------------------ | :------- | :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)                               | `string` | Required | cannot be null | [Date Calculation](datecalculation-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/type")                               |
| [operation](#operation)                     | `string` | Required | cannot be null | [Date Calculation](datecalculation-properties-operation.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/operation")                     |
| [arguments](#arguments)                     | `array`  | Required | cannot be null | [Date Calculation](datecalculation-properties-arguments.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/arguments")                     |
| [dateCalculationUnit](#datecalculationunit) | `string` | Optional | cannot be null | [Date Calculation](datecalculation-properties-datecalculationunit.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/dateCalculationUnit") |
| [dateResultUnit](#dateresultunit)           | `string` | Optional | cannot be null | [Date Calculation](datecalculation-properties-dateresultunit.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/dateResultUnit")           |

## type



`type`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Date Calculation](datecalculation-properties-type.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value               | Explanation |
| :------------------ | :---------- |
| `"dateCalculation"` |             |

## operation

Add/subtract a time interval to/from a date or subtract two dates to get the interval between them

`operation`

*   is required

*   Type: `string`

*   cannot be null

*   defined in: [Date Calculation](datecalculation-properties-operation.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/operation")

### operation Type

`string`

### operation Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"add"`      |             |
| `"subtract"` |             |

## arguments



`arguments`

*   is required

*   Type: an array of merged types ([Details](datecalculation-properties-arguments-items.md))

*   cannot be null

*   defined in: [Date Calculation](datecalculation-properties-arguments.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/arguments")

### arguments Type

an array of merged types ([Details](datecalculation-properties-arguments-items.md))

### arguments Constraints

**maximum number of items**: the maximum number of items for this array is: `2`

**minimum number of items**: the minimum number of items for this array is: `2`

## dateCalculationUnit

What unit time intervals given as arguments will be in.

`dateCalculationUnit`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Date Calculation](datecalculation-properties-datecalculationunit.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/dateCalculationUnit")

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

## dateResultUnit

What unit time intervals representing the result will be in.

`dateResultUnit`

*   is optional

*   Type: `string`

*   cannot be null

*   defined in: [Date Calculation](datecalculation-properties-dateresultunit.md "https://raw.githubusercontent.com/educorvi/rita/main/rita-core/src/schema/dateCalculation.json#/properties/dateResultUnit")

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
