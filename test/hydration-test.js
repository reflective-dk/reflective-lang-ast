"use strict";

var chai = require('chai');
chai.should();

var ast = require.main.require('lib/ast');
var pred = require.main.require('lib/ast-predicate');
var numeric = require.main.require('lib/ast-numeric');
var rules = require.main.require('lib/ast-rules');

describe('AST serialization/hydration', function() {
    var path = new ast.PathNode([ 'a', 'valid', 'path' ]);
    var string = new ast.StringNode('name');
    var boolean = new pred.BooleanNode(true);
    var fullSet = new rules.FullSetNode();
    var rule = new rules.RuleNode([ string ], fullSet, boolean, boolean, boolean);
    var pattern = new rules.PatternNode(string, [ string, string ], [ rule, rule ]);

    describe('Serialization', function() {
        it('should convert an AST to a serialized form', function() {
            pattern.serialize().should.deep.equal({
                nodeType: 'pattern',
                title: string.serialize(),
                description: [ string.serialize(), string.serialize() ],
                rules: [ rule.serialize(), rule.serialize() ]
            });
        });
    });

    describe('Hydration', function() {
        it('should hydrate a serialized AST', function() {
            var serialized = pattern.serialize();
            var hydrated = ast.AstNode.hydrate(serialized);
            hydrated.serialize().should.deep.equal(serialized);
        });
    });
});
