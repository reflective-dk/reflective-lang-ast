"use strict";

var chai = require('chai');
chai.should();

var ast = require.main.require('lib/ast');
var pred = require.main.require('lib/ast-predicate');
var numeric = require.main.require('lib/ast-numeric');
var rules = require.main.require('lib/ast-rules');

describe('Rule language-specific node types', function() {
    var path = new ast.PathNode([ 'a', 'valid', 'path' ]);
    var string = new ast.StringNode('name');
    var boolean = new pred.BooleanNode(true);
    var fullSet = new rules.FullSetNode();
    var rule = new rules.RuleNode([ string ], fullSet, boolean, boolean, boolean);

    describe('PatternNode', function() {
        it('should accept valid input', function() {
            new rules.PatternNode(string, [], [])
                .serialize().should.deep.equal({
                    nodeType: 'pattern',
                    title: string.serialize(),
                    description: [],
                    rules: []
                });
            new rules.PatternNode(string, [ string, string ], [ rule, rule ])
                .serialize().should.deep.equal({
                    nodeType: 'pattern',
                    title: string.serialize(),
                    description: [ string.serialize(), string.serialize() ],
                    rules: [ rule.serialize(), rule.serialize() ]
                });
        });
        it('should reject invalid input', function() {
            (function() {
                new rules.PatternNode(boolean, [], []);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.PatternNode(string, [ rule ], []);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.PatternNode(string, [], [ string ]);
            }).should.throw(/invalid arg/);
        });
    });

    describe('RuleNode', function() {
        it('should accept valid input', function() {
            new rules.RuleNode([ string ], fullSet, boolean, boolean, boolean)
                .serialize().should.deep.equal({
                    nodeType: 'rule',
                    description: [ string. serialize() ],
                    partitioning: fullSet.serialize(),
                    filter: boolean.serialize(),
                    condition: boolean.serialize(),
                    implication: boolean.serialize()
                });
        });
        it('should reject invalid input', function() {
            (function() {
                new rules.RuleNode([], string, boolean, boolean, boolean);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.RuleNode([], fullSet, string, boolean, boolean);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.RuleNode([], fullSet, boolean, string, boolean);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.RuleNode([], fullSet, boolean, boolean, string);
            }).should.throw(/invalid arg/);
        });
    });

    describe('PartitioningNode', function() {
        it('should not be instantiable', function() {
            rules.PartitioningNode.should.throw(/partitioning/);
        });
    });

    describe('FullSetNode', function() {
        it('should disregard any input', function() {
            new rules.FullSetNode().serialize().should.deep.equal({
                nodeType: 'fullSet'
            });
            new rules.FullSetNode(42).serialize().should.deep.equal({
                nodeType: 'fullSet'
            });
            new rules.FullSetNode(rule).serialize().should.deep.equal({
                nodeType: 'fullSet'
            });
            new rules.FullSetNode(path).serialize().should.deep.equal({
                nodeType: 'fullSet'
            });
        });
    });

    describe('GroupByNode', function() {
        it('should accept path nodes', function() {
            new rules.GroupByNode(path).serialize().should.deep.equal({
                nodeType: 'groupBy',
                path: path.serialize()
            });
        });
        it('should reject other types of input', function() {
            (function() {
                new rules.GroupByNode();
            }).should.throw(/invalid arg/);
            (function() {
                new rules.GroupByNode([]);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.GroupByNode([ 'a', 'valid', 'path' ]);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.GroupByNode(42);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.GroupByNode(true);
            }).should.throw(/invalid arg/);
            (function() {
                new rules.GroupByNode('path');
            }).should.throw(/invalid arg/);
        });
    });

    describe('SizeNode', function() {
        it('should disregard any input', function() {
            new rules.SizeNode().serialize().should.deep.equal({
                nodeType: 'size'
            });
            new rules.SizeNode(42).serialize().should.deep.equal({
                nodeType: 'size'
            });
            new rules.SizeNode(rule).serialize().should.deep.equal({
                nodeType: 'size'
            });
            new rules.SizeNode(path).serialize().should.deep.equal({
                nodeType: 'size'
            });
        });
    });
});
