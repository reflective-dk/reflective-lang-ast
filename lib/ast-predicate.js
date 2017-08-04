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
ast.AstNode.extend(PredicateNode);

/**
 * Represents the test whether a named path exists
 * @class @extends PredicateNode
 */
function PathExistsNode(pathNode) {
    this.child = util.checkarg(pathNode, ast.PathNode);
}
ast.AstNode.extend(PathExistsNode, 'pathExists', PredicateNode);
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
ast.AstNode.extend(BooleanNode, 'boolean', PredicateNode);
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
ast.AstNode.extend(EqNode, 'eq', PredicateNode);
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
    this.left = util.checkarg(left, [ numeric.NumericNode, ast.PathNode ]);
    this.right = util.checkarg(right, [ numeric.NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(LtNode, 'lt', PredicateNode);
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
    this.left = util.checkarg(left, [ numeric.NumericNode, ast.PathNode ]);
    this.right = util.checkarg(right, [ numeric.NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(LteNode, 'lte', PredicateNode);
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
    this.left = util.checkarg(left, [ numeric.NumericNode, ast.PathNode ]);
    this.right = util.checkarg(right, [ numeric.NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(GteNode, 'gte', PredicateNode);
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
    this.left = util.checkarg(left, [ numeric.NumericNode, ast.PathNode ]);
    this.right = util.checkarg(right, [ numeric.NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(GtNode, 'gt', PredicateNode);
GtNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents logical 'and' of a set of predicate nodes
 * @class @extends PredicateNode
 */
function AndNode(children) {
    this.children = util.checkargs(children, [ PredicateNode, ast.PathNode ]);
}
ast.AstNode.extend(AndNode, 'and', PredicateNode);
AndNode.prototype.attribs = function() { return [ 'children' ]; };

/**
 * Represents logical 'or' of a set of predicate nodes
 * @class @extends PredicateNode
 */
function OrNode(children) {
    this.children = util.checkargs(children, [ PredicateNode, ast.PathNode ]);
}
ast.AstNode.extend(OrNode, 'or', PredicateNode);
OrNode.prototype.attribs = function() { return [ 'children' ]; };

/**
 * Represents logical negation of a predicate node
 * @class @extends PredicateNode
 */
function NotNode(child) {
    this.child = util.checkarg(child, [ PredicateNode, ast.PathNode ]);
}
ast.AstNode.extend(NotNode, 'not', PredicateNode);
NotNode.prototype.attribs = function() { return [ 'child' ]; };
