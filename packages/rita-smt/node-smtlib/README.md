# Node.js API for SMT-LIB 2.6

Forked from [stanford-oval/node-smtlib](https://github.com/stanford-oval/node-smtlib)

SMT-LIB 2.6 is an interoperability format to communicate with
different SMT solvers, such as CVC5 or Z3.

The syntax of SMT-LIB is similar to Lisp:

```
(set-logic ALL)
(declare-const x Bool)
(declare-const y Bool)
(assert (and (or x y) x (not y)))
(check-sat)
```

This package provides a high-level API to construct SMT-Lib
expressions, taking care of escaping:

```js
const smt = require('@educorvi/smtlib');
let solver = new smt.LocalCVC5Solver();
solver.enableAssignments();
solver.add(smt.DeclareConst('x', 'Bool'));
solver.add(smt.DeclareConst('y', 'Bool'));
solver.assert(smt.And(smt.Or('x', 'y'), 'x', smt.Not('y')));
solver
    .checkSat()
    .then((result) => {
        console.log(result.satisfiable); // => true
        console.log(result.model); // => { x: true, y: false }
    })
    .catch(console.error);
```

The library also includes code to interact with a locally installed CVC5 as an external process.
