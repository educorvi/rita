# Binary operator Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/operator.json#/oneOf/0
```

| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                               |
| :------------------ | :--------- | :------------- | :----------- | :---------------- | :-------------------- | :------------------ | :----------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [operator.json\*](../../src/schema/operator.json 'open original schema') |

## 0 Type

`object` ([Binary operator](operator-oneof-binary-operator.md))

# 0 Properties

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                                                         |
| :------------------------ | :------- | :------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)             | `string` | Required | cannot be null | [Operator](operator-oneof-binary-operator-properties-type.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/operator.json#/oneOf/0/properties/type')             |
| [parameters](#parameters) | `array`  | Required | cannot be null | [Operator](operator-oneof-binary-operator-properties-parameters.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/operator.json#/oneOf/0/properties/parameters') |

## type

`type`

-   is required

-   Type: `string`

-   cannot be null

-   defined in: [Operator](operator-oneof-binary-operator-properties-type.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/operator.json#/oneOf/0/properties/type')

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value   | Explanation |
| :------ | :---------- |
| `"and"` |             |
| `"or"`  |             |
| `"xor"` |             |

## parameters

`parameters`

-   is required

-   Type: an array of merged types ([Formula](term.md))

-   cannot be null

-   defined in: [Operator](operator-oneof-binary-operator-properties-parameters.md 'https://raw.githubusercontent.com/educorvi/rita/main/src/schema/operator.json#/oneOf/0/properties/parameters')

### parameters Type

an array of merged types ([Formula](term.md))

### parameters Constraints

**minimum number of items**: the minimum number of items for this array is: `2`
