"use strict";

var ast = require('./ast');
var numeric = require('./ast-numeric');
var util = require('./util');

module.exports = {
    PredicateNode: PredicateNode,
    PathExistsNode: PathExistsNode,
    BooleanNode: BooleanNode,
    EqNode: EqNode,
    LtNode: LtNode,
    LteNode: LteNode,
    GteNode: GteNode,
    GtNode: GtNode,
    AndNode: AndNode,
    OrNode: OrNode,
    NotNode: NotNode
};

/**
 * Represents a predicate (boolean expression)
 * @abstract @class @extends AstNode
 */
function PredicateNode() {
    util.throwAbstract('predicate');
}
util.inherit(PredicateNode, ast.AstNode);

/**
 * Represents the test whether a named path exists
 * @class @extends PredicateNode
 */
function PathExistsNode(pathNode) {
    this.child = util.checkarg(pathNode, ast.PathNode);
}
util.inherit(PathExistsNode, PredicateNode);
PathExistsNode.prototype.nodeType = function() { return 'pathExists'; };
PathExistsNode.prototype.attribs = function() { return [ 'child' ]; };

/**
 * Represents a boolean value
 * @class @extends PredicateNode
 */
function BooleanNode(contents) {
    this.value = typeof contents === 'string'
        ? contents.trim() == 'true'
        : !! contents;
}
util.inherit(BooleanNode, PredicateNode);
BooleanNode.prototype.nodeType = function() { return 'boolean'; };
BooleanNode.prototype.attribs = function() { return [ 'value' ]; };

/**
 * Represents comparison for equality of two nodes
 * @class @extends PredicateNode
 */
function EqNode(left, right) {
    if (Array.isArray(left) && left.length == 2) {
        right = left[1];
        left = left[0];
    }
    this.left = util.checkarg(left, ast.AstNode);
    this.right = util.checkarg(right, ast.AstNode);
}
util.inherit(EqNode, PredicateNode);
EqNode.prototype.nodeType = function() { return 'eq'; };
EqNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents less-than comparison of two numeric nodes
 * @class @extends PredicateNode
 */
function LtNode(left, right) {
    if (Array.isArray(left) && left.length == 2) {
        right = left[1];
        left = left[0];
    }
    this.left = util.checkarg(left, numeric.NumericNode);
    this.right = util.checkarg(right, numeric.NumericNode);
}
util.inherit(LtNode, PredicateNode);
LtNode.prototype.nodeType = function() { return 'lt'; };
LtNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents less-than-or-equal comparison of two numeric nodes
 * @class @extends PredicateNode
 */
function LteNode(left, right) {
    if (Array.isArray(left) && left.length == 2) {
        right = left[1];
        left = left[0];
    }
    this.left = util.checkarg(left, numeric.NumericNode);
    this.right = util.checkarg(right, numeric.NumericNode);
}
util.inherit(LteNode, PredicateNode);
LteNode.prototype.nodeType = function() { return 'lte'; };
LteNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents greater-than-or-equal comparison of two numeric nodes
 * @class @extends PredicateNode
 */
function GteNode(left, right) {
    if (Array.isArray(left) && left.length == 2) {
        right = left[1];
        left = left[0];
    }
    this.left = util.checkarg(left, numeric.NumericNode);
    this.right = util.checkarg(right, numeric.NumericNode);
}
util.inherit(GteNode, PredicateNode);
GteNode.prototype.nodeType = function() { return 'gte'; };
GteNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents greater-than comparison of two numeric nodes
 * @class @extends PredicateNode
 */
function GtNode(left, right) {
    if (Array.isArray(left) && left.length == 2) {
        right = left[1];
        left = left[0];
    }
    this.left = util.checkarg(left, numeric.NumericNode);
    this.right = util.checkarg(right, numeric.NumericNode);
}
util.inherit(GtNode, PredicateNode);
GtNode.prototype.nodeType = function() { return 'gt'; };
GtNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents logical 'and' of a set of predicate nodes
 * @class @extends PredicateNode
 */
function AndNode(children) {
    this.children = util.checkargs(children, [ PredicateNode, ast.PathNode ]);
}
util.inherit(AndNode, PredicateNode);
AndNode.prototype.nodeType = function() { return 'and'; };
AndNode.prototype.attribs = function() { return [ 'children' ]; };

/**
 * Represents logical 'or' of a set of predicate nodes
 * @class @extends PredicateNode
 */
function OrNode(children) {
    this.children = util.checkargs(children, [ PredicateNode, ast.PathNode ]);
}
util.inherit(OrNode, PredicateNode);
OrNode.prototype.nodeType = function() { return 'or'; };
OrNode.prototype.attribs = function() { return [ 'children' ]; };

/**
 * Represents logical negation of a predicate node
 * @class @extends PredicateNode
 */
function NotNode(child) {
    this.child = util.checkarg(child, [ PredicateNode, ast.PathNode ]);
}
util.inherit(NotNode, PredicateNode);
NotNode.prototype.nodeType = function() { return 'not'; };
NotNode.prototype.attribs = function() { return [ 'child' ]; };
