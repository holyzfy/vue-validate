// https://github.com/holyzfy/vue-validate v0.4.6 Copyright 2019 holyzfy <zhaofuyun202@gmail.com>
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.validate = factory());
}(this, (function () { 'use strict';

var methods = {};

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
            valid: function () {
                var context = this;
                var list = [].slice.call(context.$el.querySelectorAll('input, textarea, select'));
                list.forEach(function (el) {
                    check.call(context, el, bindingValue);
                });
                return Object.keys(context.errors).length === 0;
            }
        },
        directives: {
            validate: {
                inserted: function (el, binding, vNode) {
                    var context = vNode.context;
                    bindingValue = binding.value;
                    el.addEventListener('input', function (event) {
                        if(!event.target.dataset.lazy) {
                            check.bind(context)(event.target, bindingValue);
                        }
                    });
                    el.addEventListener('change', function (event) {
                        var elem = event.target;
                        var checked = ['checkbox', 'radio'].indexOf(elem.type) >= 0;
                        if(checked || elem.dataset.lazy) {
                            check.bind(context)(event.target, bindingValue);
                        }
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
    var rules = getRules(elem);
    for(var key in rules) {
        var param = rules[key]; 
        var valid = methods[key](elem.value, elem, param, bindingValue);
        if(!valid) {
            var messageKey = 'message' + key[0].toUpperCase() + key.slice(1);
            var template = elem.dataset[messageKey] || '';
            if(!template) {
                // eslint-disable-next-line no-console
                console.warn('请指定自定义消息的属性 data-message-' + key, elem); 
            }
            var message = format(template, param);
            context.$set(context.errors, elem.name, {
                state: 'customError',
                message
            });
        }
    }
}

function getRules(field) {
    var rules = {};
    var dataset = field.dataset;
    for(var key in dataset) {
        if(key.slice(0, 4) === 'rule') {
            var name = key.slice(4).toLowerCase();
            rules[name] = dataset[key];
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

return getValidate;

})));
