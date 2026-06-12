# Formula Schema

```txt
https://raw.githubusercontent.com/educorvi/rita/main/src/schema/term.json
```



| Abstract            | Extensible | Status         | Identifiable            | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                     |
| :------------------ | :--------- | :------------- | :---------------------- | :---------------- | :-------------------- | :------------------ | :------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | Unknown identifiability | Forbidden         | Allowed               | none                | [term.json](../../src/schema/formula.json "open original schema") |

## Formula Type

merged type ([Formula](term.md))

one (and only one) of

*   one (and only one) of

    *   [Non-Unary operator](operator-oneof-non-unary-operator.md "check type definition")

    *   [Unary operator](operator-oneof-unary-operator.md "check type definition")

*   [Atom](atom.md "check type definition")

*   [Comparison](comparison.md "check type definition")
