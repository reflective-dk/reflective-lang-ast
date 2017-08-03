"use strict";

var chai = require('chai');
chai.should();

var ast = require.main.require('lib/ast');
var pred = require.main.require('lib/ast-predicate');
var numeric = require.main.require('lib/ast-numeric');

describe('Numeric node types', function() {
    describe('NumericNode', function() {
        it('should not be instantiable', function() {
            numeric.NumericNode.should.throw(/numeric/);
        });
    });

    describe('NumberNode', function() {
        it('should accept finite number literals', function() {
            new numeric.NumberNode(0).serialize().should.deep.equal({
                nodeType: 'number',
                value: 0
            });
            new numeric.NumberNode(42).serialize().should.deep.equal({
                nodeType: 'number',
                value: 42
            });
            new numeric.NumberNode(3.14).serialize().should.deep.equal({
                nodeType: 'number',
                value: 3.14
            });
        });
        it('should accept strings that parse to finite numbers', function() {
            new numeric.NumberNode('0').serialize().should.deep.equal({
                nodeType: 'number',
                value: 0
            });
            new numeric.NumberNode('42').serialize().should.deep.equal({
                nodeType: 'number',
                value: 42
            });
            new numeric.NumberNode('3.14').serialize().should.deep.equal({
                nodeType: 'number',
                value: 3.14
            });
        });
        it('should reject invalid input', function() {
            (function() {
                new numeric.NumberNode();
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.NumberNode(true);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.NumberNode(0/0);
            }).should.throw(/invalid arg/);
        });
    });

    var path = new ast.PathNode([ 'a', 'valid', 'path' ]);
    var string = new ast.StringNode('name');
    var boolean = new pred.BooleanNode(true);
    var number = new numeric.NumberNode(42);
    var arith = new numeric.AdditionNode(number, number);

    describe('AdditionNode', function() {
        it('should accept numeric nodes', function() {
            new numeric.AdditionNode([]).serialize().should.deep.equal({
                nodeType: 'add',
                children: []
            });
            new numeric.AdditionNode([ number, arith ]).serialize().should.deep.equal({
                nodeType: 'add',
                children: [ number.serialize(), arith.serialize() ]
            });
        });
        it('should accept path nodes', function() {
            new numeric.AdditionNode([ path ]).serialize().should.deep.equal({
                nodeType: 'add',
                children: [ path.serialize() ]
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new numeric.AdditionNode();
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.AdditionNode([ string ]);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.AdditionNode([ boolean ]);
            }).should.throw(/invalid arg/);
        });
    });

    describe('SubtractionNode', function() {
        it('should accept numeric nodes', function() {
            new numeric.SubtractionNode(number, number).serialize().should.deep.equal({
                nodeType: 'sub',
                left: number.serialize(),
                right: number.serialize()
            });
            new numeric.SubtractionNode(number, arith).serialize().should.deep.equal({
                nodeType: 'sub',
                left: number.serialize(),
                right: arith.serialize()
            });
            new numeric.SubtractionNode(arith, arith).serialize().should.deep.equal({
                nodeType: 'sub',
                left: arith.serialize(),
                right: arith.serialize()
            });
        });
        it('should accept path nodes', function() {
            new numeric.SubtractionNode(path, number).serialize().should.deep.equal({
                nodeType: 'sub',
                left: path.serialize(),
                right: number.serialize()
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new numeric.SubtractionNode();
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.SubtractionNode(number);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.SubtractionNode(number, boolean);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.SubtractionNode(string, number);
            }).should.throw(/invalid arg/);
        });
    });

    describe('MultiplicationNode', function() {
        it('should accept numeric nodes', function() {
            new numeric.MultiplicationNode([]).serialize().should.deep.equal({
                nodeType: 'mul',
                children: []
            });
            new numeric.MultiplicationNode([ number, arith ]).serialize().should.deep.equal({
                nodeType: 'mul',
                children: [ number.serialize(), arith.serialize() ]
            });
        });
        it('should accept path nodes', function() {
            new numeric.MultiplicationNode(path).serialize().should.deep.equal({
                nodeType: 'mul',
                children: [ path.serialize() ]
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new numeric.MultiplicationNode();
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.MultiplicationNode([ string ]);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.MultiplicationNode([ boolean ]);
            }).should.throw(/invalid arg/);
        });
    });

    describe('DivisionNode', function() {
        it('should accept numeric nodes', function() {
            new numeric.DivisionNode(number, number).serialize().should.deep.equal({
                nodeType: 'div',
                left: number.serialize(),
                right: number.serialize()
            });
            new numeric.DivisionNode(number, arith).serialize().should.deep.equal({
                nodeType: 'div',
                left: number.serialize(),
                right: arith.serialize()
            });
            new numeric.DivisionNode(arith, arith).serialize().should.deep.equal({
                nodeType: 'div',
                left: arith.serialize(),
                right: arith.serialize()
            });
        });
        it('should accept path nodes', function() {
            new numeric.DivisionNode(path, number).serialize().should.deep.equal({
                nodeType: 'div',
                left: path.serialize(),
                right: number.serialize()
            });
        });
        it('should reject other types of node', function() {
            (function() {
                new numeric.DivisionNode();
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.DivisionNode(number);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.DivisionNode(number, boolean);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.DivisionNode(string, number);
            }).should.throw(/invalid arg/);
        });
    });

    describe('CountNode', function() {
        it('should accept path nodes', function() {
            new numeric.CountNode(path).serialize().should.deep.equal({
                nodeType: 'count',
                path: path.serialize()
            });
        });
        it('should reject other types of input', function() {
            (function() {
                new numeric.CountNode();
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.CountNode([]);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.CountNode([ 'a', 'valid', 'path' ]);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.CountNode(42);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.CountNode(true);
            }).should.throw(/invalid arg/);
            (function() {
                new numeric.CountNode('path');
            }).should.throw(/invalid arg/);
        });
    });
});
