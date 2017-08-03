"use strict";

var chai = require('chai');
chai.should();

var ast = require.main.require('lib/ast');

describe('General node types', function() {
    describe('AstNode', function() {
        it('should not be instantiable', function() {
            ast.AstNode.should.throw(/node/);
        });
    });

    describe('StringNode', function() {
        it('should accept string input', function() {
            new ast.StringNode('').serialize().should.deep.equal({
                nodeType: 'string',
                value: ''
            });
            new ast.StringNode('some string').serialize().should.deep.equal({
                nodeType: 'string',
                value: 'some string'
            });
        });
        it('should reject non-string input', function() {
            (function() {
                new ast.StringNode(42);
            }).should.throw(/invalid arg/);
            (function() {
                new ast.StringNode(true);
            }).should.throw(/invalid arg/);
        });
    });

    describe('PathNode', function() {
        it('should accept valid paths', function() {
            new ast.PathNode([ 'a', 'valid', 'path' ]).serialize().should.deep.equal({
                nodeType: 'path',
                path: [ 'a', 'valid', 'path' ]
            });
        });
        it('should reject invalid paths', function() {
            (function() {
                new ast.PathNode('');
            }).should.throw(/invalid arg/);
            (function() {
                new ast.PathNode(42);
            }).should.throw(/invalid arg/);
            (function() {
                new ast.PathNode(true);
            }).should.throw(/invalid arg/);
        });
    });
});
