"use strict";

module.exports = {
    inherit: inherit,
    checkarg: checkarg,
    checkargs: checkargs,
    throwAbstract: throwAbstract,
    serialize: serialize
};

function inherit(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype, {
        constructor: {
            value: Child,
            enumerable: false
        }
    });
}

function checkargs(args, type) {
    args = Array.isArray(args) ? args : [ args ];
    args.forEach(function(arg) { checkarg(arg, type); });
    return args;
}

function checkarg(arg, type) {
    if (checkargStr(arg, type) || checkargFn(arg, type)) {
        return arg;
    }
    throw new Error('invalid arg detected, wanted: ' + type + ', got: ' + arg);
}

function checkargStr(arg, typeString) {
    if (typeof arg !== typeString) {
        return false;
    }
    return typeString === 'number' ? isFinite(arg) : true;
}

function checkargFn(arg, ctor) {
    var ctors = Array.isArray(ctor) ? ctor : [ ctor ];
    return ctors.some(function(ctr) {
        return typeof ctr === 'function' && arg instanceof ctr;
    });
}

function throwAbstract(name) {
    throw new Error('cannot instantiate abstract class: ' + name);
}

function serialize(value) {
    if (Array.isArray(value)) {
        return value.map(serialize);
    }
    return typeof value.serialize === 'function' ? value.serialize() : value;
}
