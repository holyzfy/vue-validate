(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define('validate', ['module', 'exports', 'jQuery', 'Vue'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('jQuery'), require('Vue'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.jQuery, global.Vue);
        global.validate = mod.exports;
    }
})(this, function (module, exports, _jQuery, _Vue) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jQuery2 = _interopRequireDefault(_jQuery);

    var _Vue2 = _interopRequireDefault(_Vue);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var methods = {
        required: function required(value, elem, param) {
            return value.length > 0;
        },
        mobile: function mobile(value, elem, param) {
            return optional(elem) || /^1\d{10}$/.test(value);
        },
        equalto: function equalto(value, elem, param, root) {
            return optional(elem) || value === (0, _jQuery2.default)(elem).closest(root).find(param).val();
        },
        mix: function mix(value, elem, param) {
            return optional(elem) || value >= param;
        },
        max: function max(value, elem, param) {
            return optional(elem) || value <= param;
        },
        minlength: function minlength(value, elem, param, root) {
            var length = _jQuery2.default.isArray(value) ? value.length : getLength(value, elem, root);
            return optional(elem) || length >= param;
        },
        maxlength: function maxlength(value, elem, param, root) {
            var length = _jQuery2.default.isArray(value) ? value.length : getLength(value, elem, root);
            return optional(elem) || length <= param;
        },
        range: function range(value, elem, param) {
            var range = getRange(param);
            if (!range) {
                return true;
            }
            return optional(elem) || value >= range[0] && value <= range[1];
        },
        rangelength: function rangelength(value, elem, param, root) {
            var range = getRange(param);
            if (!range) {
                return true;
            }
            var length = getLength(value, elem, root);
            return optional(elem) || length >= range[0] && length <= range[1];
        }
    };

    function getValidate(options) {
        options = options || {};
        _jQuery2.default.extend(methods, options.methods);
        return {
            name: 'validate',
            data: function data() {
                return {
                    errors: {}
                };
            },
            computed: {
                isValid: function isValid() {
                    var errors = JSON.parse(JSON.stringify(this.errors));
                    return _jQuery2.default.isEmptyObject(errors);
                }
            },
            mounted: mounted,
            methods: {
                valid: function valid(selector) {
                    var context = this;
                    selector = selector || 'input, textarea, select';
                    var $fieldList = (0, _jQuery2.default)(context.$el).find(selector).trigger('check');
                    var errors = {};
                    $fieldList.each(function () {
                        var name = (0, _jQuery2.default)(this).attr('name');
                        if (context.errors[name]) {
                            errors[name] = context.errors[name];
                        }
                    });
                    return _jQuery2.default.isEmptyObject(errors);
                }
            }
        };
    }

    function getLength(value, elem, root) {
        switch (elem.nodeName.toLowerCase()) {
            case 'select':
                return (0, _jQuery2.default)('option:selected', elem).length;
            case 'input':
                if (checkable(elem)) {
                    var $field = (0, _jQuery2.default)(elem).closest(root).find('[name="' + elem.name + '"]');
                    return $field.filter(':checked').length;
                }
                break;
            default:
        }
        return value.length;
    }

    function checkable(elem) {
        return (/radio|checkbox/i.test(elem.type)
        );
    }

    function getRange(param) {
        var range = param.match(/(\d+)\s*,\s*(\d+)/);
        if (range) {
            return [Number(range[1]), Number(range[2])];
        }
        return range;
    }

    function optional(elem) {
        return !(0, _jQuery2.default)(elem).val();
    }

    function mounted() {
        var context = this;
        var selector = 'input, textarea, select';
        (0, _jQuery2.default)(context.$el).on('focusout check', selector, function (event) {
            validateField(context, event);
        }).on('focusin keyup', function (event) {
            var isTab = (event.key || '').toLowerCase() === 'tab' || event.keyCode === 9;
            var isEnter = (event.key || '').toLowerCase() === 'enter' || event.keyCode === 13;
            if (isTab || isEnter) {
                return;
            }
            _Vue2.default.delete(context.errors, event.target.name);
        });
    }

    function validateField(context, event) {
        var field = event.target;
        var tabKey = (event.key || '').toLowerCase() === 'tab';
        var tabKeyCode = event.keyCode === 9;
        var isTab = tabKey || tabKeyCode;
        var enterKey = (event.key || '').toLowerCase() === 'enter';
        var enterKeyCode = event.keyCode === 13;
        var isEnter = enterKey || enterKeyCode;
        if (isTab || isEnter) {
            return;
        }
        _Vue2.default.delete(context.errors, field.name);
        _jQuery2.default.each(getRules(field), function (key, value) {
            var valid = methods[key]((0, _jQuery2.default)(field).val(), field, value, context.$el);
            if (!valid) {
                var template = (0, _jQuery2.default)(field).data('message-' + key);
                var message = valid ? null : format(template, value);
                _Vue2.default.set(context.errors, field.name, message);
            }
            return valid;
        });
    }

    function getRules(field) {
        var rules = {};
        _jQuery2.default.each((0, _jQuery2.default)(field).data(), function (key, value) {
            if (key.slice(0, 4) === 'rule') {
                var name = key.slice(4).toLowerCase();
                rules[name] = value;
            }
        });
        return rules;
    }

    function format(template, args) {
        typeof args === 'string' && args.split(',').forEach(function (item, i) {
            var pattern = new RegExp('\\{' + i + '\\}', 'g');
            template = template.replace(pattern, item);
        });
        return template;
    }

    exports.default = getValidate;
    module.exports = exports['default'];
});
