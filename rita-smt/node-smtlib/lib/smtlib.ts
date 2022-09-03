// -*- mode: typescript; indent-tabs-mode: nil; js-basic-offset: 4 -*-
//
// Copyright 2017-2020 Giovanni Campagna <gcampagn@cs.stanford.edu>
//
// See LICENSE for details

function stringEscape(str: string): string {
    return '"' + str.replace(/(["\\])/g, '\\$1').replace(/\n/g, '\\n') + '"';
    // the following comment fixes broken syntax highlighting in GtkSourceView
    //]/
}

export type SNode = SExpr | string;

class SExpr {
    private _children: SNode[];

    constructor(...children: SNode[]) {
        this._children = children;
    }

    toString(): string {
        return '(' + this._children.join(' ') + ')';
    }
}

function Comment(comment: string): string {
    return '; ' + comment;
}

function SetLogic(logic: string): SExpr {
    return new SExpr('set-logic', logic);
}
function SetOption(opt: string, value: SNode = 'true'): SExpr {
    return new SExpr('set-option', ':' + opt, value);
}
function DeclareDatatype(name: string, constructors: SNode[]): SExpr {
    const sortdec = new SExpr(name, '0');
    const datatypedec = new SExpr(
        ...constructors.map((c) =>
            Array.isArray(c) ? new SExpr(...c) : new SExpr(c)
        )
    );

    return new SExpr(
        'declare-datatypes',
        new SExpr(sortdec),
        new SExpr(datatypedec)
    );
}
function DeclareSort(name: string): SExpr {
    return new SExpr('declare-sort', name, '0');
}
function DeclareFun(name: string, args: SNode[], ret: SNode): SExpr {
    return new SExpr('declare-fun', name, new SExpr(...args), ret);
}

function DeclareConst(name: string, ret: SNode): SExpr {
    return new SExpr('declare-const', name, ret);
}
function DefineFun(name: string, args: SNode[], ret: SNode, def: SNode): SExpr {
    return new SExpr('define-fun', name, new SExpr(...args), ret, def);
}
function Assert(assert: SNode): SExpr {
    return new SExpr('assert', assert);
}
function Predicate(pred: SNode, ...args: SNode[]): SNode {
    if (args.length === 0) return pred;
    else return new SExpr(pred, ...args);
}
function Implies(lhs: SNode, rhs: SNode): SExpr {
    return new SExpr('=>', lhs, rhs);
}
function And(...args: SNode[]): SNode {
    if (args.length === 1) return args[0];
    return new SExpr('and', ...args);
}
function Or(...args: SNode[]): SNode {
    if (args.length === 1) return args[0];
    return new SExpr('or', ...args);
}
function Not(expr: SNode): SExpr {
    return new SExpr('not', expr);
}
function Eq(lhs: SNode, rhs: SNode): SExpr {
    return new SExpr('=', lhs, rhs);
}
function NEq(lhs: SNode, rhs: SNode): SExpr {
    return Not(Eq(lhs, rhs));
}
function LEq(lhs: SNode, rhs: SNode): SExpr {
    return new SExpr('<=', lhs, rhs);
}
function GEq(lhs: SNode, rhs: SNode): SExpr {
    return new SExpr('>=', lhs, rhs);
}
function LT(lhs: SNode, rhs: SNode): SExpr {
    return new SExpr('<', lhs, rhs);
}
function GT(lhs: SNode, rhs: SNode): SExpr {
    return new SExpr('>', lhs, rhs);
}
function Add(...args: SNode[]): SNode {
    if (args.length === 1) return args[0];
    return new SExpr('+', ...args);
}
function Sub(...args: SNode[]): SNode {
    if (args.length === 1) return args[0];
    return new SExpr('-', ...args);
}
function Mult(...args: SNode[]): SNode {
    if (args.length === 1) return args[0];
    return new SExpr('*', ...args);
}
function Div(...args: SNode[]): SNode {
    if (args.length === 1) return args[0];
    return new SExpr('/', ...args);
}
function SetType(elementType: SNode): SExpr {
    return new SExpr('Set', elementType);
}
function StringLiteral(str: string): SNode {
    return stringEscape(str);
}
function Named(name: SNode, expr: SNode): SExpr {
    return new SExpr('!', expr, ':named', name);
}
function CheckSat(): SExpr {
    return new SExpr('check-sat');
}

export {
    SExpr,
    Comment,
    SetLogic,
    SetOption,
    DeclareSort,
    DeclareDatatype,
    DeclareConst,
    DeclareFun,
    DefineFun,
    Assert,
    Predicate,
    Implies,
    And,
    Or,
    Not,
    Eq,
    NEq,
    LEq,
    GEq,
    LT,
    GT,
    Add,
    Sub,
    Mult,
    Div,
    Named,
    SetType,
    StringLiteral,
    CheckSat,
};
