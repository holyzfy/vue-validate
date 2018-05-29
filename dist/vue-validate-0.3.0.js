(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('validate', ['module', 'exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports);
        global.validate = mod.exports;
    }
})(this, function (module, exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function getValidate(config) {
        var options = {
            disableNativeValidationUI: true
        };
        Object.assign(options, config);
        return {
            data: function data() {
                return {
                    errors: {}
                };
            },
            mounted: function mounted() {
                var context = this;
                var form = context.$el;
                form.addEventListener('input', function (event) {
                    if (!event.target.dataset.lazy) {
                        check.bind(context)(event);
                    }
                });
                form.addEventListener('change', function (event) {
                    var elem = event.target;
                    var checked = ['checkbox', 'radio'].indexOf(elem.type) >= 0;
                    if (checked || elem.dataset.lazy) {
                        check.bind(context)(event);
                    }
                });
                form.addEventListener("invalid", function (event) {
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
            },

            methods: {
                valid: function valid() {
                    return this.$el.checkValidity();
                }
            }
        };
    }

    function check(event) {
        var context = this;
        var elem = event.target;
        if (elem.validity.valid) {
            context.$delete(context.errors, elem.name);
        } else {
            context.$set(context.errors, elem.name, {
                state: findState(elem.validity),
                message: elem.validationMessage
            });
        }
    }

    function findState(obj) {
        for (var key in obj) {
            if (obj[key]) {
                return key;
            }
        }
    }

    exports.default = getValidate;
    module.exports = exports['default'];
});
