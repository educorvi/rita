import { SExpr, SNode } from '@educorvi/smtlib';

function Mod(arg1: SNode, arg2: SNode): SExpr {
    return new SExpr(
        '%',
        new SExpr('to_real', arg1),
        new SExpr('to_real', arg2)
    );
}

function GTS(arg1: SNode, arg2: SNode): SExpr {
    return new SExpr('>s', arg1, arg2);
}

function LTS(arg1: SNode, arg2: SNode): SExpr {
    return new SExpr('<s', arg1, arg2);
}

function GEqS(arg1: SNode, arg2: SNode): SExpr {
    return new SExpr('>=s', arg1, arg2);
}

function LEqS(arg1: SNode, arg2: SNode): SExpr {
    return new SExpr('<=s', arg1, arg2);
}

export { Mod, LEqS, GEqS, GTS, LTS };
