"use strict";

var ast = require('./ast');
var util = require('./util');

module.exports = {
    NumericNode: NumericNode,
    AdditionNode: AdditionNode,
    SubtractionNode: SubtractionNode,
    MultiplicationNode: MultiplicationNode,
    DivisionNode: DivisionNode,
    NumberNode: NumberNode,
    CountNode: CountNode
};

/**
 * Represents a numeric operation or value
 * @abstract @class @extends AstNode
 */
function NumericNode() {
    util.throwAbstract('numeric');
}
ast.AstNode.extend(NumericNode);

/**
 * Represents the numeric sum of a set of nodes
 * @class @extends NumericNode
 */
function AdditionNode(children) {
    this.children = util.checkargs(children, [ NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(AdditionNode, 'add', NumericNode);
AdditionNode.prototype.attribs = function() { return [ 'children' ]; };

/**
 * Represents the numeric subtraction of two nodes
 * @class @extends NumericNode
 */
function SubtractionNode(left, right) {
    if (Array.isArray(left) && left.length == 2) {
        right = left[1];
        left = left[0];
    }
    this.left = util.checkarg(left, [ NumericNode, ast.PathNode ]);
    this.right = util.checkarg(right, [ NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(SubtractionNode, 'sub', NumericNode);
SubtractionNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents the numeric product of a set of nodes
 * @class @extends NumericNode
 */
function MultiplicationNode(children) {
    this.children = util.checkargs(children, [ NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(MultiplicationNode, 'mul', NumericNode);
MultiplicationNode.prototype.attribs = function() { return [ 'children' ]; };

/**
 * Represents the numeric division of two nodes
 * @class @extends NumericNode
 */
function DivisionNode(left, right) {
    if (Array.isArray(left) && left.length == 2) {
        right = left[1];
        left = left[0];
    }
    this.left = util.checkarg(left, [ NumericNode, ast.PathNode ]);
    this.right = util.checkarg(right, [ NumericNode, ast.PathNode ]);
}
ast.AstNode.extend(DivisionNode, 'div', NumericNode);
DivisionNode.prototype.attribs = function() { return [ 'left', 'right' ]; };

/**
 * Represents a numeric value
 * @class @extends NumericNode
 */
function NumberNode(contents) {
    var value = parseFloat(contents);
    this.value = util.checkarg(value, 'number');
}
ast.AstNode.extend(NumberNode, 'number', NumericNode);
NumberNode.prototype.attribs = function() { return [ 'value' ]; };

/**
 * Represents the 'count' of a named path
 * @class @extends NumericNode
 */
function CountNode(path) {
    this.path = util.checkarg(path, ast.PathNode);
}
ast.AstNode.extend(CountNode, 'count', NumericNode);
CountNode.prototype.attribs = function() { return [ 'path' ]; };
