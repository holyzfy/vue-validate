(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', 'jQuery', 'Vue'], factory);
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
                    var self = this;
                    selector = selector || 'input, textarea, select';
                    var $fieldList = (0, _jQuery2.default)(self.$el).find(selector).trigger('check');
                    var errors = {};
                    $fieldList.each(function () {
                        var name = (0, _jQuery2.default)(this).attr('name');
                        if (self.errors[name]) {
                            errors[name] = self.errors[name];
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3ZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsUUFBSSxVQUFVO0FBQ1Ysa0JBQVUsa0JBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QjtBQUNwQyxtQkFBTyxNQUFNLE1BQU4sR0FBZSxDQUF0QjtBQUNILFNBSFM7QUFJVixnQkFBUSxnQkFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLEtBQXZCLEVBQThCO0FBQ2xDLG1CQUFPLFNBQVMsSUFBVCxLQUFrQixZQUFZLElBQVosQ0FBaUIsS0FBakIsQ0FBekI7QUFDSCxTQU5TO0FBT1YsaUJBQVMsaUJBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QixJQUE5QixFQUFvQztBQUN6QyxtQkFBTyxTQUFTLElBQVQsS0FBa0IsVUFBVSxzQkFBRSxJQUFGLEVBQVEsT0FBUixDQUFnQixJQUFoQixFQUFzQixJQUF0QixDQUEyQixLQUEzQixFQUFrQyxHQUFsQyxFQUFuQztBQUNILFNBVFM7QUFVVixhQUFLLGFBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QjtBQUMvQixtQkFBTyxTQUFTLElBQVQsS0FBa0IsU0FBUyxLQUFsQztBQUNILFNBWlM7QUFhVixhQUFLLGFBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QjtBQUMvQixtQkFBTyxTQUFTLElBQVQsS0FBa0IsU0FBUyxLQUFsQztBQUNILFNBZlM7QUFnQlYsbUJBQVcsbUJBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QixJQUE5QixFQUFvQztBQUMzQyxnQkFBSSxTQUFTLGlCQUFFLE9BQUYsQ0FBVyxLQUFYLElBQXFCLE1BQU0sTUFBM0IsR0FBb0MsVUFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLElBQXZCLENBQWpEO0FBQ0EsbUJBQU8sU0FBUyxJQUFULEtBQWtCLFVBQVUsS0FBbkM7QUFDSCxTQW5CUztBQW9CVixtQkFBVyxtQkFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLEtBQXZCLEVBQThCLElBQTlCLEVBQW9DO0FBQzNDLGdCQUFJLFNBQVMsaUJBQUUsT0FBRixDQUFXLEtBQVgsSUFBcUIsTUFBTSxNQUEzQixHQUFvQyxVQUFVLEtBQVYsRUFBaUIsSUFBakIsRUFBdUIsSUFBdkIsQ0FBakQ7QUFDQSxtQkFBTyxTQUFTLElBQVQsS0FBa0IsVUFBVSxLQUFuQztBQUNILFNBdkJTO0FBd0JWLGVBQU8sZUFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCLEtBQXZCLEVBQThCO0FBQ2pDLGdCQUFJLFFBQVEsU0FBUyxLQUFULENBQVo7QUFDQSxnQkFBRyxDQUFDLEtBQUosRUFBVztBQUNQLHVCQUFPLElBQVA7QUFDSDtBQUNELG1CQUFPLFNBQVMsSUFBVCxLQUFtQixTQUFTLE1BQU0sQ0FBTixDQUFULElBQXFCLFNBQVMsTUFBTSxDQUFOLENBQXhEO0FBQ0gsU0E5QlM7QUErQlYscUJBQWEscUJBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixLQUF2QixFQUE4QixJQUE5QixFQUFvQztBQUM3QyxnQkFBSSxRQUFRLFNBQVMsS0FBVCxDQUFaO0FBQ0EsZ0JBQUcsQ0FBQyxLQUFKLEVBQVc7QUFDUCx1QkFBTyxJQUFQO0FBQ0g7QUFDRCxnQkFBSSxTQUFTLFVBQVUsS0FBVixFQUFpQixJQUFqQixFQUF1QixJQUF2QixDQUFiO0FBQ0EsbUJBQU8sU0FBUyxJQUFULEtBQW1CLFVBQVUsTUFBTSxDQUFOLENBQVYsSUFBc0IsVUFBVSxNQUFNLENBQU4sQ0FBMUQ7QUFDSDtBQXRDUyxLQUFkOztBQXlDQSxhQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEI7QUFDMUIsa0JBQVUsV0FBVyxFQUFyQjtBQUNBLHlCQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLFFBQVEsT0FBMUI7QUFDQSxlQUFPO0FBQ0gsa0JBQU0sVUFESDtBQUVILGtCQUFNLGdCQUFZO0FBQ2QsdUJBQU87QUFDSCw0QkFBUTtBQURMLGlCQUFQO0FBR0gsYUFORTtBQU9ILHNCQUFVO0FBQ04seUJBQVMsbUJBQVk7QUFDakIsd0JBQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyxLQUFLLFNBQUwsQ0FBZSxLQUFLLE1BQXBCLENBQVgsQ0FBYjtBQUNBLDJCQUFPLGlCQUFFLGFBQUYsQ0FBZ0IsTUFBaEIsQ0FBUDtBQUNIO0FBSkssYUFQUDtBQWFILHFCQUFTLE9BYk47QUFjSCxxQkFBUztBQUNMLHVCQUFPLGVBQVUsUUFBVixFQUFvQjtBQUN2Qix3QkFBSSxPQUFPLElBQVg7QUFDQSwrQkFBVyxZQUFZLHlCQUF2QjtBQUNBLHdCQUFJLGFBQWEsc0JBQUUsS0FBSyxHQUFQLEVBQVksSUFBWixDQUFpQixRQUFqQixFQUEyQixPQUEzQixDQUFtQyxPQUFuQyxDQUFqQjtBQUNBLHdCQUFJLFNBQVMsRUFBYjtBQUNBLCtCQUFXLElBQVgsQ0FBZ0IsWUFBWTtBQUN4Qiw0QkFBSSxPQUFPLHNCQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsTUFBYixDQUFYO0FBQ0EsNEJBQUcsS0FBSyxNQUFMLENBQVksSUFBWixDQUFILEVBQXNCO0FBQ2xCLG1DQUFPLElBQVAsSUFBZSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWY7QUFDSDtBQUNKLHFCQUxEO0FBTUEsMkJBQU8saUJBQUUsYUFBRixDQUFnQixNQUFoQixDQUFQO0FBQ0g7QUFiSTtBQWROLFNBQVA7QUE4Qkg7O0FBRUQsYUFBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLElBQTFCLEVBQWdDLElBQWhDLEVBQXNDO0FBQ2xDLGdCQUFRLEtBQUssUUFBTCxDQUFjLFdBQWQsRUFBUjtBQUNJLGlCQUFLLFFBQUw7QUFDSSx1QkFBTyxzQkFBRSxpQkFBRixFQUFxQixJQUFyQixFQUEyQixNQUFsQztBQUNKLGlCQUFLLE9BQUw7QUFDSSxvQkFBSSxVQUFVLElBQVYsQ0FBSixFQUFxQjtBQUNqQix3QkFBSSxTQUFTLHNCQUFFLElBQUYsRUFBUSxPQUFSLENBQWdCLElBQWhCLEVBQXNCLElBQXRCLENBQTJCLFlBQVksS0FBSyxJQUFqQixHQUF3QixJQUFuRCxDQUFiO0FBQ0EsMkJBQU8sT0FBTyxNQUFQLENBQWMsVUFBZCxFQUEwQixNQUFqQztBQUNIO0FBQ0Q7QUFDSjtBQVRKO0FBV0EsZUFBTyxNQUFNLE1BQWI7QUFDSDs7QUFFRCxhQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUI7QUFDckIsZUFBUSxrQkFBRCxDQUFvQixJQUFwQixDQUF5QixLQUFLLElBQTlCO0FBQVA7QUFDSDs7QUFFRCxhQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDckIsWUFBSSxRQUFRLE1BQU0sS0FBTixDQUFZLG1CQUFaLENBQVo7QUFDQSxZQUFHLEtBQUgsRUFBVTtBQUNOLG1CQUFPLENBQUMsT0FBTyxNQUFNLENBQU4sQ0FBUCxDQUFELEVBQW1CLE9BQU8sTUFBTSxDQUFOLENBQVAsQ0FBbkIsQ0FBUDtBQUNIO0FBQ0QsZUFBTyxLQUFQO0FBQ0g7O0FBRUQsYUFBUyxRQUFULENBQWtCLElBQWxCLEVBQXdCO0FBQ3BCLGVBQU8sQ0FBQyxzQkFBRSxJQUFGLEVBQVEsR0FBUixFQUFSO0FBQ0g7O0FBRUQsYUFBUyxPQUFULEdBQW1CO0FBQ2YsWUFBSSxVQUFVLElBQWQ7QUFDQSxZQUFJLFdBQVcseUJBQWY7QUFDQSw4QkFBRSxRQUFRLEdBQVYsRUFBZSxFQUFmLENBQWtCLGdCQUFsQixFQUFvQyxRQUFwQyxFQUE4QyxVQUFVLEtBQVYsRUFBaUI7QUFDM0QsMEJBQWMsT0FBZCxFQUF1QixLQUF2QjtBQUNILFNBRkQsRUFFRyxFQUZILENBRU0sZUFGTixFQUV1QixVQUFVLEtBQVYsRUFBaUI7QUFDcEMsZ0JBQUksUUFBUSxDQUFDLE1BQU0sR0FBTixJQUFhLEVBQWQsRUFBa0IsV0FBbEIsT0FBb0MsS0FBcEMsSUFBNkMsTUFBTSxPQUFOLEtBQWtCLENBQTNFO0FBQ0EsZ0JBQUksVUFBVSxDQUFDLE1BQU0sR0FBTixJQUFhLEVBQWQsRUFBa0IsV0FBbEIsT0FBb0MsT0FBcEMsSUFBK0MsTUFBTSxPQUFOLEtBQWtCLEVBQS9FO0FBQ0EsZ0JBQUcsU0FBUyxPQUFaLEVBQXFCO0FBQ2pCO0FBQ0g7QUFDRCwwQkFBSSxNQUFKLENBQVcsUUFBUSxNQUFuQixFQUEyQixNQUFNLE1BQU4sQ0FBYSxJQUF4QztBQUNILFNBVEQ7QUFVSDs7QUFFRCxhQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0MsS0FBaEMsRUFBdUM7QUFDbkMsWUFBSSxRQUFRLE1BQU0sTUFBbEI7QUFDQSxZQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQU4sSUFBYSxFQUFkLEVBQWtCLFdBQWxCLE9BQW9DLEtBQWpEO0FBQ0EsWUFBSSxhQUFhLE1BQU0sT0FBTixLQUFrQixDQUFuQztBQUNBLFlBQUksUUFBUSxVQUFVLFVBQXRCO0FBQ0EsWUFBSSxXQUFXLENBQUMsTUFBTSxHQUFOLElBQWEsRUFBZCxFQUFrQixXQUFsQixPQUFvQyxPQUFuRDtBQUNBLFlBQUksZUFBZSxNQUFNLE9BQU4sS0FBa0IsRUFBckM7QUFDQSxZQUFJLFVBQVUsWUFBWSxZQUExQjtBQUNBLFlBQUcsU0FBUyxPQUFaLEVBQXFCO0FBQ2pCO0FBQ0g7QUFDRCxzQkFBSSxNQUFKLENBQVcsUUFBUSxNQUFuQixFQUEyQixNQUFNLElBQWpDO0FBQ0EseUJBQUUsSUFBRixDQUFPLFNBQVMsS0FBVCxDQUFQLEVBQXdCLFVBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0I7QUFDMUMsZ0JBQUksUUFBUSxRQUFRLEdBQVIsRUFBYSxzQkFBRSxLQUFGLEVBQVMsR0FBVCxFQUFiLEVBQTZCLEtBQTdCLEVBQW9DLEtBQXBDLEVBQTJDLFFBQVEsR0FBbkQsQ0FBWjtBQUNBLGdCQUFHLENBQUMsS0FBSixFQUFXO0FBQ1Asb0JBQUksV0FBVyxzQkFBRSxLQUFGLEVBQVMsSUFBVCxDQUFjLGFBQWEsR0FBM0IsQ0FBZjtBQUNBLG9CQUFJLFVBQVUsUUFBUSxJQUFSLEdBQWUsT0FBTyxRQUFQLEVBQWlCLEtBQWpCLENBQTdCO0FBQ0EsOEJBQUksR0FBSixDQUFRLFFBQVEsTUFBaEIsRUFBd0IsTUFBTSxJQUE5QixFQUFvQyxPQUFwQztBQUNIO0FBQ0QsbUJBQU8sS0FBUDtBQUNILFNBUkQ7QUFTSDs7QUFFRCxhQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDckIsWUFBSSxRQUFRLEVBQVo7QUFDQSx5QkFBRSxJQUFGLENBQU8sc0JBQUUsS0FBRixFQUFTLElBQVQsRUFBUCxFQUF3QixVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQzFDLGdCQUFHLElBQUksS0FBSixDQUFVLENBQVYsRUFBYSxDQUFiLE1BQW9CLE1BQXZCLEVBQStCO0FBQzNCLG9CQUFJLE9BQU8sSUFBSSxLQUFKLENBQVUsQ0FBVixFQUFhLFdBQWIsRUFBWDtBQUNBLHNCQUFNLElBQU4sSUFBYyxLQUFkO0FBQ0g7QUFDSixTQUxEO0FBTUEsZUFBTyxLQUFQO0FBQ0g7O0FBRUQsYUFBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCLElBQTFCLEVBQWdDO0FBQzNCLGVBQU8sSUFBUCxLQUFnQixRQUFqQixJQUE4QixLQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLE9BQWhCLENBQXdCLFVBQVUsSUFBVixFQUFnQixDQUFoQixFQUFtQjtBQUNyRSxnQkFBSSxVQUFVLElBQUksTUFBSixDQUFXLFFBQVEsQ0FBUixHQUFZLEtBQXZCLEVBQThCLEdBQTlCLENBQWQ7QUFDQSx1QkFBVyxTQUFTLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEIsSUFBMUIsQ0FBWDtBQUNILFNBSDZCLENBQTlCO0FBSUEsZUFBTyxRQUFQO0FBQ0g7O3NCQUVjLFciLCJmaWxlIjoidnVlLXZhbGlkYXRlLTAuMS4wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICQgZnJvbSAnalF1ZXJ5JztcbmltcG9ydCBWdWUgZnJvbSAnVnVlJztcblxudmFyIG1ldGhvZHMgPSB7XG4gICAgcmVxdWlyZWQ6IGZ1bmN0aW9uICh2YWx1ZSwgZWxlbSwgcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+IDA7XG4gICAgfSxcbiAgICBtb2JpbGU6IGZ1bmN0aW9uICh2YWx1ZSwgZWxlbSwgcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsKGVsZW0pIHx8IC9eMVxcZHsxMH0kLy50ZXN0KHZhbHVlKTtcbiAgICB9LFxuICAgIGVxdWFsdG86IGZ1bmN0aW9uICh2YWx1ZSwgZWxlbSwgcGFyYW0sIHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsKGVsZW0pIHx8IHZhbHVlID09PSAkKGVsZW0pLmNsb3Nlc3Qocm9vdCkuZmluZChwYXJhbSkudmFsKCk7XG4gICAgfSxcbiAgICBtaXg6IGZ1bmN0aW9uICh2YWx1ZSwgZWxlbSwgcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsKGVsZW0pIHx8IHZhbHVlID49IHBhcmFtO1xuICAgIH0sXG4gICAgbWF4OiBmdW5jdGlvbiAodmFsdWUsIGVsZW0sIHBhcmFtKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25hbChlbGVtKSB8fCB2YWx1ZSA8PSBwYXJhbTtcbiAgICB9LFxuICAgIG1pbmxlbmd0aDogZnVuY3Rpb24gKHZhbHVlLCBlbGVtLCBwYXJhbSwgcm9vdCkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogZ2V0TGVuZ3RoKHZhbHVlLCBlbGVtLCByb290KTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsKGVsZW0pIHx8IGxlbmd0aCA+PSBwYXJhbTtcbiAgICB9LFxuICAgIG1heGxlbmd0aDogZnVuY3Rpb24gKHZhbHVlLCBlbGVtLCBwYXJhbSwgcm9vdCkge1xuICAgICAgICB2YXIgbGVuZ3RoID0gJC5pc0FycmF5KCB2YWx1ZSApID8gdmFsdWUubGVuZ3RoIDogZ2V0TGVuZ3RoKHZhbHVlLCBlbGVtLCByb290KTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsKGVsZW0pIHx8IGxlbmd0aCA8PSBwYXJhbTtcbiAgICB9LFxuICAgIHJhbmdlOiBmdW5jdGlvbiAodmFsdWUsIGVsZW0sIHBhcmFtKSB7XG4gICAgICAgIHZhciByYW5nZSA9IGdldFJhbmdlKHBhcmFtKTtcbiAgICAgICAgaWYoIXJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9uYWwoZWxlbSkgfHwgKHZhbHVlID49IHJhbmdlWzBdICYmIHZhbHVlIDw9IHJhbmdlWzFdKTtcbiAgICB9LFxuICAgIHJhbmdlbGVuZ3RoOiBmdW5jdGlvbiAodmFsdWUsIGVsZW0sIHBhcmFtLCByb290KSB7XG4gICAgICAgIHZhciByYW5nZSA9IGdldFJhbmdlKHBhcmFtKTtcbiAgICAgICAgaWYoIXJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKHZhbHVlLCBlbGVtLCByb290KTtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsKGVsZW0pIHx8IChsZW5ndGggPj0gcmFuZ2VbMF0gJiYgbGVuZ3RoIDw9IHJhbmdlWzFdKTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBnZXRWYWxpZGF0ZShvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgJC5leHRlbmQobWV0aG9kcywgb3B0aW9ucy5tZXRob2RzKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiAndmFsaWRhdGUnLFxuICAgICAgICBkYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVycm9yczoge31cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXB1dGVkOiB7XG4gICAgICAgICAgICBpc1ZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVycm9ycyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5lcnJvcnMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5pc0VtcHR5T2JqZWN0KGVycm9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IG1vdW50ZWQsXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIHZhbGlkOiBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciB8fCAnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnO1xuICAgICAgICAgICAgICAgIHZhciAkZmllbGRMaXN0ID0gJChzZWxmLiRlbCkuZmluZChzZWxlY3RvcikudHJpZ2dlcignY2hlY2snKTtcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JzID0ge307XG4gICAgICAgICAgICAgICAgJGZpZWxkTGlzdC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZi5lcnJvcnNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yc1tuYW1lXSA9IHNlbGYuZXJyb3JzW25hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQuaXNFbXB0eU9iamVjdChlcnJvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0TGVuZ3RoKHZhbHVlLCBlbGVtLCByb290KSB7XG4gICAgc3dpdGNoIChlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSAnc2VsZWN0JzpcbiAgICAgICAgICAgIHJldHVybiAkKCdvcHRpb246c2VsZWN0ZWQnLCBlbGVtKS5sZW5ndGg7XG4gICAgICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgICAgICAgIGlmIChjaGVja2FibGUoZWxlbSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGZpZWxkID0gJChlbGVtKS5jbG9zZXN0KHJvb3QpLmZpbmQoJ1tuYW1lPVwiJyArIGVsZW0ubmFtZSArICdcIl0nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGZpZWxkLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gY2hlY2thYmxlKGVsZW0pIHtcbiAgICByZXR1cm4gKC9yYWRpb3xjaGVja2JveC9pKS50ZXN0KGVsZW0udHlwZSk7XG59XG5cbmZ1bmN0aW9uIGdldFJhbmdlKHBhcmFtKSB7XG4gICAgdmFyIHJhbmdlID0gcGFyYW0ubWF0Y2goLyhcXGQrKVxccyosXFxzKihcXGQrKS8pO1xuICAgIGlmKHJhbmdlKSB7XG4gICAgICAgIHJldHVybiBbTnVtYmVyKHJhbmdlWzFdKSwgTnVtYmVyKHJhbmdlWzJdKV07XG4gICAgfVxuICAgIHJldHVybiByYW5nZTtcbn1cblxuZnVuY3Rpb24gb3B0aW9uYWwoZWxlbSkge1xuICAgIHJldHVybiAhJChlbGVtKS52YWwoKTtcbn1cblxuZnVuY3Rpb24gbW91bnRlZCgpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgdmFyIHNlbGVjdG9yID0gJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0JztcbiAgICAkKGNvbnRleHQuJGVsKS5vbignZm9jdXNvdXQgY2hlY2snLCBzZWxlY3RvciwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhbGlkYXRlRmllbGQoY29udGV4dCwgZXZlbnQpO1xuICAgIH0pLm9uKCdmb2N1c2luIGtleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBpc1RhYiA9IChldmVudC5rZXkgfHwgJycpLnRvTG93ZXJDYXNlKCkgPT09ICd0YWInIHx8IGV2ZW50LmtleUNvZGUgPT09IDk7XG4gICAgICAgIHZhciBpc0VudGVyID0gKGV2ZW50LmtleSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ2VudGVyJyB8fCBldmVudC5rZXlDb2RlID09PSAxMztcbiAgICAgICAgaWYoaXNUYWIgfHwgaXNFbnRlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFZ1ZS5kZWxldGUoY29udGV4dC5lcnJvcnMsIGV2ZW50LnRhcmdldC5uYW1lKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVGaWVsZChjb250ZXh0LCBldmVudCkge1xuICAgIHZhciBmaWVsZCA9IGV2ZW50LnRhcmdldDtcbiAgICB2YXIgdGFiS2V5ID0gKGV2ZW50LmtleSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ3RhYic7XG4gICAgdmFyIHRhYktleUNvZGUgPSBldmVudC5rZXlDb2RlID09PSA5O1xuICAgIHZhciBpc1RhYiA9IHRhYktleSB8fCB0YWJLZXlDb2RlO1xuICAgIHZhciBlbnRlcktleSA9IChldmVudC5rZXkgfHwgJycpLnRvTG93ZXJDYXNlKCkgPT09ICdlbnRlcic7XG4gICAgdmFyIGVudGVyS2V5Q29kZSA9IGV2ZW50LmtleUNvZGUgPT09IDEzO1xuICAgIHZhciBpc0VudGVyID0gZW50ZXJLZXkgfHwgZW50ZXJLZXlDb2RlO1xuICAgIGlmKGlzVGFiIHx8IGlzRW50ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBWdWUuZGVsZXRlKGNvbnRleHQuZXJyb3JzLCBmaWVsZC5uYW1lKTtcbiAgICAkLmVhY2goZ2V0UnVsZXMoZmllbGQpLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB2YXIgdmFsaWQgPSBtZXRob2RzW2tleV0oJChmaWVsZCkudmFsKCksIGZpZWxkLCB2YWx1ZSwgY29udGV4dC4kZWwpO1xuICAgICAgICBpZighdmFsaWQpIHtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQoZmllbGQpLmRhdGEoJ21lc3NhZ2UtJyArIGtleSk7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHZhbGlkID8gbnVsbCA6IGZvcm1hdCh0ZW1wbGF0ZSwgdmFsdWUpO1xuICAgICAgICAgICAgVnVlLnNldChjb250ZXh0LmVycm9ycywgZmllbGQubmFtZSwgbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRSdWxlcyhmaWVsZCkge1xuICAgIHZhciBydWxlcyA9IHt9O1xuICAgICQuZWFjaCgkKGZpZWxkKS5kYXRhKCksIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmKGtleS5zbGljZSgwLCA0KSA9PT0gJ3J1bGUnKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGtleS5zbGljZSg0KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcnVsZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBydWxlcztcbn1cblxuZnVuY3Rpb24gZm9ybWF0KHRlbXBsYXRlLCBhcmdzKSB7XG4gICAgKHR5cGVvZiBhcmdzID09PSAnc3RyaW5nJykgJiYgYXJncy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdcXFxceycgKyBpICsgJ1xcXFx9JywgJ2cnKTtcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKHBhdHRlcm4sIGl0ZW0pO1xuICAgIH0pO1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VmFsaWRhdGU7XG4iXX0=