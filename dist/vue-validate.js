// https://github.com/holyzfy/vue-validate v0.4.0 Copyright 2018 holyzfy <zhaofuyun202@gmail.com>
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.validate = factory());
}(this, (function () { 'use strict';

    function getValidate(config) {
        var options = {
            disableNativeValidationUI: true
        };
        for(var key in config) {
            options[key] = config[key];
        }

        return {
            data() {
                return {
                    errors: {}
                };
            },
            methods: {
                valid() {
                    var list = [].slice.call(this.$el.querySelectorAll('input, textarea, select'));
                    list.forEach(item => item.checkValidity());
                    return list.map(item => item.validity.valid).filter(valid => !valid).length === 0;
                }
            },
            directives: {
                validate: {
                    inserted(el, bindings, vNode) {
                        var context = vNode.context;
                        el.addEventListener('input', event => {
                            if(!event.target.dataset.lazy) {
                                check.bind(context)(event);
                            }
                        });
                        el.addEventListener('change', event => {
                            var elem = event.target;
                            var checked = ['checkbox', 'radio'].indexOf(elem.type) >= 0;
                            if(checked || elem.dataset.lazy) {
                                check.bind(context)(event);
                            }
                        });
                        el.addEventListener("invalid", event => {
                            // The invalid event does not bubble, 
                            // so if you want to prevent the native validation bubbles on multiple elements
                            // you must attach a capture-phase listener.
                            options.disableNativeValidationUI && event.preventDefault();
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

    function check(event) {
        var context = this;
        var elem = event.target;
        if(elem.validity.valid) {
            context.$delete(context.errors, elem.name);
        } else {
            context.$set(context.errors, elem.name, {
                state: findState(elem.validity),
                message: elem.validationMessage
            });
        }
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
