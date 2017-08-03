"use strict";

var util = require('./util');

module.exports = {
    AstNode: AstNode,
    PathNode: PathNode,
    StringNode: StringNode
};

/**
 * Generic Abstract Syntax Tree (AST) Node
 * @abstract @class
 */
function AstNode() {
    util.throwAbstract('node');
}
AstNode.prototype.serialize = function() {
    var self = this;
    var result = {
        nodeType: this.nodeType()
    };
    if (typeof this.attribs === 'function') {
        this.attribs().forEach(function(att) {
            result[att] = util.serialize(self[att]);
        });
    }
    return result;
};
AstNode.prototype.toString = function() {
    return JSON.stringify(this.serialize());
};

/**
 * Represents a string value
 * @class @extends AstNode
 */
function StringNode(contents) {
    this.value = util.checkarg(contents, 'string');
}
util.inherit(StringNode, AstNode);
StringNode.prototype.nodeType = function() { return 'string'; };
StringNode.prototype.attribs = function() { return [ 'value' ]; };

/**
 * Represents a named path of an object
 * @class @extends AstNode
 */
function PathNode(path) {
    this.path = util.checkargs(path, 'string');
    if (this.path.length == 0 || this.path.indexOf('') != -1) {
        throw new Error('invalid arg detected, wanted: ' + this.path);
    }
}
util.inherit(PathNode, AstNode);
PathNode.prototype.nodeType = function() { return 'path'; };
PathNode.prototype.attribs = function() { return [ 'path' ]; };
