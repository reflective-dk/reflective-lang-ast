"use strict";

var chai = require('chai');
chai.should();

var ast = require.main.require('lib/ast');
var pred = require.main.require('lib/ast-predicate');
var numeric = require.main.require('lib/ast-numeric');

describe('Predicate node types', function() {
    describe('PredicateNode', function() {
        it('should not be instantiable', function() {
            pred.PredicateNode.should.throw(/predicate/);
        });
    });

    describe('PathExistsNode', function() {
        it('should accept a valid path as input', function() {
            var path = new ast.PathNode([ 'a', 'valid', 'path' ]);
            new pred.PathExistsNode(path).serialize().should.deep.equal({
                nodeType: 'pathExists',
                child: path.serialize()
            });
        });
        it('should reject invalid input', function() {
            (function() {
                new pred.PathExistsNode();
            }).should.throw(/invalid arg/);
            (function() {
                new pred.PathExistsNode([]);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.PathExistsNode('somePath');
            }).should.throw(/invalid arg/);
            (function() {
                new pred.PathExistsNode([ 'a', 'valid', 'path' ]);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.PathExistsNode(42);
            }).should.throw(/invalid arg/);
        });
    });

    describe('BooleanNode', function() {
        it('should accept any type of input and convert it to true or false', function() {
            new pred.BooleanNode(true).serialize().should.deep.equal({
                nodeType: 'boolean',
                value: true
            });
            new pred.BooleanNode(false).serialize().should.deep.equal({
                nodeType: 'boolean',
                value: false
            });
            new pred.BooleanNode('true').serialize().should.deep.equal({
                nodeType: 'boolean',
                value: true
            });
            new pred.BooleanNode('false').serialize().should.deep.equal({
                nodeType: 'boolean',
                value: false
            });
            new pred.BooleanNode('any other string is false').serialize().should.deep.equal({
                nodeType: 'boolean',
                value: false
            });
            new pred.BooleanNode('').serialize().should.deep.equal({
                nodeType: 'boolean',
                value: false
            });
            new pred.BooleanNode(0).serialize().should.deep.equal({
                nodeType: 'boolean',
                value: false
            });
            new pred.BooleanNode(1).serialize().should.deep.equal({
                nodeType: 'boolean',
                value: true
            });
            new pred.BooleanNode({}).serialize().should.deep.equal({
                nodeType: 'boolean',
                value: true
            });
            new pred.BooleanNode().serialize().should.deep.equal({
                nodeType: 'boolean',
                value: false
            });
        });
    });

    var path = new ast.PathNode([ 'name' ]);
    var string = new ast.StringNode('some string');
    var boolean = new pred.BooleanNode(true);
    var number = new numeric.NumberNode(42);
    var arith = new numeric.AdditionNode(number, number);
    var eq = new pred.EqNode(path, path);
    var comp = new pred.LtNode(number, number);
    var and = new pred.AndNode([ boolean, eq, comp ]);
    var or = new pred.OrNode([ boolean, eq, comp, and ]);

    describe('EqNode', function() {
        it('should accept nodes of any type', function() {
            new pred.EqNode(path, path).serialize().should.deep.equal({
                nodeType: 'eq',
                left: path.serialize(),
                right: path.serialize()
            });
            new pred.EqNode(number, string).serialize().should.deep.equal({
                nodeType: 'eq',
                left: number.serialize(),
                right: string.serialize()
            });
            new pred.EqNode(eq, comp).serialize().should.deep.equal({
                nodeType: 'eq',
                left: eq.serialize(),
                right: comp.serialize()
            });
        });
        it('should reject invalid input', function() {
            (function() {
                new pred.EqNode();
            }).should.throw(/invalid arg/);
            (function() {
                new pred.EqNode(42);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.EqNode(42, 42);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.EqNode('name', 'other');
            }).should.throw(/invalid arg/);
        });
    });

    describe('LtNode', function() {
        it('should accept numeric nodes', function() {
            new pred.LtNode(number, number).serialize().should.deep.equal({
                nodeType: 'lt',
                left: number.serialize(),
                right: number.serialize()
            });
            new pred.LtNode(number, arith).serialize().should.deep.equal({
                nodeType: 'lt',
                left: number.serialize(),
                right: arith.serialize()
            });
            new pred.LtNode(arith, arith).serialize().should.deep.equal({
                nodeType: 'lt',
                left: arith.serialize(),
                right: arith.serialize()
            });
        });
        it('should accept path nodes', function() {
            console.log('in test', path);
            new pred.LtNode(path, path).serialize().should.deep.equal({
                nodeType: 'lt',
                left: path.serialize(),
                right: path.serialize()
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new pred.LtNode();
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LtNode(number);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LtNode(comp, comp);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LtNode(string, string);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LtNode(eq, eq);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LtNode(boolean, boolean);
            }).should.throw(/invalid arg/);
        });
    });

    describe('LteNode', function() {
        it('should accept numeric nodes', function() {
            new pred.LteNode(number, number).serialize().should.deep.equal({
                nodeType: 'lte',
                left: number.serialize(),
                right: number.serialize()
            });
            new pred.LteNode(number, arith).serialize().should.deep.equal({
                nodeType: 'lte',
                left: number.serialize(),
                right: arith.serialize()
            });
            new pred.LteNode(arith, arith).serialize().should.deep.equal({
                nodeType: 'lte',
                left: arith.serialize(),
                right: arith.serialize()
            });
        });
        it('should accept path nodes', function() {
            new pred.LteNode(path, path).serialize().should.deep.equal({
                nodeType: 'lte',
                left: path.serialize(),
                right: path.serialize()
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new pred.LteNode();
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LteNode(number);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LteNode(comp, comp);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LteNode(string, string);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LteNode(eq, eq);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.LteNode(boolean, boolean);
            }).should.throw(/invalid arg/);
        });
    });

    describe('GteNode', function() {
        it('should accept numeric nodes', function() {
            new pred.GteNode(number, number).serialize().should.deep.equal({
                nodeType: 'gte',
                left: number.serialize(),
                right: number.serialize()
            });
            new pred.GteNode(number, arith).serialize().should.deep.equal({
                nodeType: 'gte',
                left: number.serialize(),
                right: arith.serialize()
            });
            new pred.GteNode(arith, arith).serialize().should.deep.equal({
                nodeType: 'gte',
                left: arith.serialize(),
                right: arith.serialize()
            });
        });
        it('should accept path nodes', function() {
            new pred.GteNode(path, path).serialize().should.deep.equal({
                nodeType: 'gte',
                left: path.serialize(),
                right: path.serialize()
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new pred.GteNode();
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GteNode(number);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GteNode(comp, comp);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GteNode(string, string);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GteNode(eq, eq);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GteNode(boolean, boolean);
            }).should.throw(/invalid arg/);
        });
    });

    describe('GtNode', function() {
        it('should accept numeric nodes', function() {
            new pred.GtNode(number, number).serialize().should.deep.equal({
                nodeType: 'gt',
                left: number.serialize(),
                right: number.serialize()
            });
            new pred.GtNode(number, arith).serialize().should.deep.equal({
                nodeType: 'gt',
                left: number.serialize(),
                right: arith.serialize()
            });
            new pred.GtNode(arith, arith).serialize().should.deep.equal({
                nodeType: 'gt',
                left: arith.serialize(),
                right: arith.serialize()
            });
        });
        it('should accept path nodes', function() {
            new pred.GtNode(path, path).serialize().should.deep.equal({
                nodeType: 'gt',
                left: path.serialize(),
                right: path.serialize()
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new pred.GtNode();
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GtNode(number);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GtNode(comp, comp);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GtNode(string, string);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GtNode(eq, eq);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.GtNode(boolean, boolean);
            }).should.throw(/invalid arg/);
        });
    });

    describe('AndNode', function() {
        it('should accept predicate nodes', function() {
            new pred.AndNode([]).serialize().should.deep.equal({
                nodeType: 'and',
                children: []
            });
            new pred.AndNode([ boolean ]).serialize().should.deep.equal({
                nodeType: 'and',
                children: [ boolean.serialize() ]
            });
            new pred.AndNode([ boolean, comp, and, or ]).serialize().should.deep.equal({
                nodeType: 'and',
                children: [
                    boolean.serialize(),
                    comp.serialize(),
                    and.serialize(),
                    or.serialize()
                ]
            });
        });
        it('should accept path nodes', function() {
            new pred.AndNode([ path ]).serialize().should.deep.equal({
                nodeType: 'and',
                children: [ path.serialize() ]
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new pred.AndNode([ number ]);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.AndNode([ string ]);
            }).should.throw(/invalid arg/);
        });
    });

    describe('OrNode', function() {
        it('should accept predicate nodes', function() {
            new pred.OrNode([]).serialize().should.deep.equal({
                nodeType: 'or',
                children: []
            });
            new pred.OrNode([ boolean ]).serialize().should.deep.equal({
                nodeType: 'or',
                children: [ boolean.serialize() ]
            });
            new pred.OrNode([ boolean, comp, and, or ]).serialize().should.deep.equal({
                nodeType: 'or',
                children: [
                    boolean.serialize(),
                    comp.serialize(),
                    and.serialize(),
                    or.serialize()
                ]
            });
        });
        it('should accept path nodes', function() {
            new pred.OrNode([ path ]).serialize().should.deep.equal({
                nodeType: 'or',
                children: [ path.serialize() ]
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new pred.OrNode([ number ]);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.OrNode([ string ]);
            }).should.throw(/invalid arg/);
        });
    });

    describe('NotNode', function() {
        it('should accept predicate nodes', function() {
            new pred.NotNode(boolean).serialize().should.deep.equal({
                nodeType: 'not',
                child: boolean.serialize()
            });
            new pred.NotNode(and).serialize().should.deep.equal({
                nodeType: 'not',
                child: and.serialize()
            });
            new pred.NotNode(or).serialize().should.deep.equal({
                nodeType: 'not',
                child: or.serialize()
            });
        });
        it('should accept path nodes', function() {
            new pred.NotNode(path).serialize().should.deep.equal({
                nodeType: 'not',
                child: path.serialize()
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new pred.NotNode(number);
            }).should.throw(/invalid arg/);
            (function() {
                new pred.NotNode(string);
            }).should.throw(/invalid arg/);
        });
    });
});
