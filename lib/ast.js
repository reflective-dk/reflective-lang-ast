"use strict";

var util = require('./util');

// Used for hydration from serialized definitions
var typeMap = {};

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

/**
 * Extends AstNode with a new NodeType, adding it to the type map used for
 * hydration. The ParentNodeType, if specified, determines where in the type
 * hierarchy the ChildNodeType is placed (AstNode by default)
 */
AstNode.extend = function(ChildNodeType, nodeTypeKey, ParentNodeType) {
    ParentNodeType = ParentNodeType || AstNode;
    util.inherit(ChildNodeType, ParentNodeType);
    if (nodeTypeKey) {
        ChildNodeType.prototype.nodeType = function() { return nodeTypeKey; };
        typeMap[nodeTypeKey] = ChildNodeType;
    }
};

/**
 * Hydrates a tree of AST nodes from the serialized form produced by
 * AstNode.prototype.serialize()
 */
AstNode.hydrate = function(serialization) {
    return util.hydrate(serialization, typeMap);
};

/**
 * Serializes a tree of AST Nodes to a form that can be hydrated with
 * AstNode.hydrate()
 */
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
AstNode.extend(StringNode, 'string');
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
AstNode.extend(PathNode, 'path');
PathNode.prototype.attribs = function() { return [ 'path' ]; };
