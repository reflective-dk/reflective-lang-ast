"use strict";

var ast = require('./ast');
var pred = require('./ast-predicate');
var util = require('./util');

module.exports = {
    PatternNode: PatternNode,
    RuleNode: RuleNode,
    PartitioningNode: PartitioningNode,
    FullSetNode: FullSetNode,
    GroupByNode: GroupByNode,
    SizeNode: SizeNode
};

/**
 * Represents a rule pattern, a named set of rules
 * @class @extends AstNode
 */
function PatternNode(title, description, rules) {
    this.title = util.checkarg(title, ast.StringNode);
    this.description = util.checkargs(description, ast.StringNode);
    this.rules = util.checkargs(rules, RuleNode);
}
util.inherit(PatternNode, ast.AstNode);
PatternNode.prototype.nodeType = function() { return 'pattern'; };
PatternNode.prototype.attribs = function() {
    return [ 'title', 'description', 'rules' ];
};

/**
 * Represents a named object rule
 * @class @extends AstNode
 */
function RuleNode(description, partitioning, filter, condition, implication) {
    if (!partitioning && description.length == 5) {
        partitioning = description[1];
        filter = description[2];
        condition = description[3];
        implication = description[4];
        description = description[0];
    }
    this.description = util.checkargs(description, ast.StringNode);
    this.partitioning = util.checkarg(partitioning, PartitioningNode);
    this.filter = util.checkarg(filter, pred.PredicateNode);
    this.condition = util.checkarg(condition, pred.PredicateNode);
    this.implication = util.checkarg(implication, pred.PredicateNode);
}
util.inherit(RuleNode, ast.AstNode);
RuleNode.prototype.nodeType = function() { return 'rule'; };
RuleNode.prototype.attribs = function() {
    return [ 'description', 'partitioning', 'filter', 'condition', 'implication' ];
};

/**
 * Represents an object partitioning
 * @abstract @class @extends AstNode
 */
function PartitioningNode() {
    util.throwAbstract('partitioning');
}
util.inherit(PartitioningNode, ast.AstNode);

/**
 * Represents the trivial partitioning of a single complete partition
 * @class @extends PartitioningNode
 */
function FullSetNode() {
}
util.inherit(FullSetNode, PartitioningNode);
FullSetNode.prototype.nodeType = function() { return 'fullSet'; };

/**
 * Represents a partitioning by path value
 * @class @extends PartitioningNode
 */
function GroupByNode(path) {
    this.path = util.checkarg(path, ast.PathNode);
}
util.inherit(GroupByNode, PartitioningNode);
GroupByNode.prototype.nodeType = function() { return 'groupBy'; };
GroupByNode.prototype.attribs = function() { return [ 'path' ]; };

/**
 * Represents the size operation, counting the number of elements of a partitioning
 * @class @extends AstNode
 */
function SizeNode() {
}
util.inherit(SizeNode, ast.AstNode);
SizeNode.prototype.nodeType = function() { return 'size'; };
