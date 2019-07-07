// https://github.com/holyzfy/vue-validate v0.5.5 Copyright 2019 holyzfy <zhaofuyun202@gmail.com>
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.validate = factory());
}(this, (function () { 'use strict';

var methods = {
    min: function (value, elem, param) {
        return parseFloat(value) >= param;  
    },
    max: function (value, elem, param) {
        return parseFloat(value) <= param;  
    },
    minlength: function (value, elem, param) {
        return value.length >= param;  
    },
    maxlength: function (value, elem, param) {
        return value.length <= param;  
    },
    minlength2: function (value, elem, param) {
        var length = Math.floor(getLength(value));
        return length >= param;  
    },
    maxlength2: function (value, elem, param) {
        var length = Math.ceil(getLength(value));
        return length <= param;  
    },
};

function getLength(value) {
    return value.replace(/[^\x01-\xFF]/g, '--').length / 2;
}

function getValidate(options) {
    var bindingValue;
    for(var key in options) {
        methods[key] = options[key];
    }
    return {
        data: function () {
            return {
                errors: {}
            };
        },
        methods: {
            valid: function (selector) {
                var context = this;
                var fields = [];
                selector = selector || 'input, textarea, select';
                var fields = (typeof selector === 'string') ? context.$el.querySelectorAll(selector) : selector;
                var list = [].concat(fields);
                var hasError = true;
                list.forEach(function (el) {
                    check.call(context, el, bindingValue);
                    if(context.errors[el.name]) {
                        hasError = false;
                    }
                });
                return hasError;
            }
        },
        directives: {
            validate: {
                inserted: function (el, binding, vNode) {
                    var context = vNode.context;
                    bindingValue = binding.value;
                    // IE 10 and IE 11 have a bug where the input event fires on placeholder attribute changes.
                    el.addEventListener('keyup', function (event) {
                        var list = ['esc', 'tab', 'capslock', 'numlock', 'enter', 'left', 'right', 'up', 'down', 'alt', 'control', 'shift'];
                        if(event.key && list.indexOf(event.key.toLowerCase()) >= 0) {
                            return;
                        }
                        var lazy = dataset(event.target, 'lazy')
                        if(!lazy) {
                            check.bind(context)(event.target, bindingValue);
                        }
                    });
                    el.addEventListener('change', function (event) {
                        check.bind(context)(event.target, bindingValue);
                    });
                    el.addEventListener("invalid", function (event) {
                        // The invalid event does not bubble, 
                        // so if you want to prevent the native validation bubbles on multiple elements
                        // you must attach a capture-phase listener.
                        event.preventDefault();
                        var elem = event.target;
                        context.$set(context.errors, elem.name, {
                            state: findState(elem.validity),
                            message: elem.validationMessage
                        });
                    }, true);
                }
            }
        }
    };
}

function check(elem, bindingValue) {
    var context = this;
    elem.checkValidity();
    if(elem.validity.valid) {
        context.$delete(context.errors, elem.name);
        checkCustomRoles(context, elem, bindingValue);
    } else {
        context.$set(context.errors, elem.name, {
            state: findState(elem.validity),
            message: elem.validationMessage
        });
    }
}

function checkCustomRoles(context, elem, bindingValue) {
    if(!elem.value && !elem.required) {
        return;
    }
    var rules = getRules(elem);
    for(var key in rules) {
        var param = rules[key]; 
        var valid = methods[key](elem.value, elem, param, bindingValue);
        if(!valid) {
            var messageKey = 'message' + key[0].toUpperCase() + key.slice(1);
            var template = dataset(elem, messageKey) || '';
            if(!template) {
                // eslint-disable-next-line no-console
                console.warn('请指定自定义消息的属性 data-message-' + key, elem); 
            }
            var message = format(template, param);
            context.$set(context.errors, elem.name, {
                state: 'customError',
                message: message
            });
        }
    }
}

function getRules(field) {
    var rules = {};
    var pairs = dataset(field);
    for(var key in pairs) {
        if(key.slice(0, 4) === 'rule') {
            var name = key.slice(4).toLowerCase();
            rules[name] = pairs[key];
        } 
    }
    return rules;
}

function format(template, args) {
    (typeof args === 'string') && args.split(',').forEach(function (item, i) {
        var pattern = new RegExp('\\{' + i + '\\}', 'g');
        template = template.replace(pattern, item);
    });
    return template;
}

function findState(obj) {
    for(var key in obj) {
        if(obj[key]) {
            return key;
        }
    }
}

function dataset(element, name) {
    var obj = {};

    if(element.dataset) {
        obj = element.dataset;
    } else {
        for(var i = 0; i < element.attributes.length; i++) {
            var key = element.attributes[i].nodeName;
            if(/^data-.+$/.test(key)) {
                var value = element.attributes[i].nodeValue;
                var keyName = toCamel(key.match(/^data-(.+)/)[1]);
                obj[keyName] = value;
            }
        }
    }

    return name ? obj[name] : obj;
}

function toCamel(str) {
    return str.replace(/[_-](\w|$)/g, function (match, value) {
        return value.toUpperCase();
    });
}

return getValidate;

})));
