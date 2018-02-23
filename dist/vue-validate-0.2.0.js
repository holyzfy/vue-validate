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
        _jQuery2.default.each(field.dataset, function (key, value) {
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUNIO0FBQ0QsbUJBQU8sS0FBUDtBQUNILFNBUkQ7QUFTSDs7QUFFRCxhQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDckIsWUFBSSxRQUFRLEVBQVo7QUFDQSx5QkFBRSxJQUFGLENBQU8sTUFBTSxPQUFiLEVBQXNCLFVBQVUsR0FBVixFQUFlLEtBQWYsRUFBc0I7QUFDeEMsZ0JBQUcsSUFBSSxLQUFKLENBQVUsQ0FBVixFQUFhLENBQWIsTUFBb0IsTUFBdkIsRUFBK0I7QUFDM0Isb0JBQUksT0FBTyxJQUFJLEtBQUosQ0FBVSxDQUFWLEVBQWEsV0FBYixFQUFYO0FBQ0Esc0JBQU0sSUFBTixJQUFjLEtBQWQ7QUFDSDtBQUNKLFNBTEQ7QUFNQSxlQUFPLEtBQVA7QUFDSDs7QUFFRCxhQUFTLE1BQVQsQ0FBZ0IsUUFBaEIsRUFBMEIsSUFBMUIsRUFBZ0M7QUFDM0IsZUFBTyxJQUFQLEtBQWdCLFFBQWpCLElBQThCLEtBQUssS0FBTCxDQUFXLEdBQVgsRUFBZ0IsT0FBaEIsQ0FBd0IsVUFBVSxJQUFWLEVBQWdCLENBQWhCLEVBQW1CO0FBQ3JFLGdCQUFJLFVBQVUsSUFBSSxNQUFKLENBQVcsUUFBUSxDQUFSLEdBQVksS0FBdkIsRUFBOEIsR0FBOUIsQ0FBZDtBQUNBLHVCQUFXLFNBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQixJQUExQixDQUFYO0FBQ0gsU0FINkIsQ0FBOUI7QUFJQSxlQUFPLFFBQVA7QUFDSDs7c0JBRWMsVyIsImZpbGUiOiJ2dWUtdmFsaWRhdGUtMC4yLjAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJCBmcm9tICdqUXVlcnknO1xuaW1wb3J0IFZ1ZSBmcm9tICdWdWUnO1xuXG52YXIgbWV0aG9kcyA9IHtcbiAgICByZXF1aXJlZDogZnVuY3Rpb24gKHZhbHVlLCBlbGVtLCBwYXJhbSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID4gMDtcbiAgICB9LFxuICAgIG1vYmlsZTogZnVuY3Rpb24gKHZhbHVlLCBlbGVtLCBwYXJhbSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uYWwoZWxlbSkgfHwgL14xXFxkezEwfSQvLnRlc3QodmFsdWUpO1xuICAgIH0sXG4gICAgZXF1YWx0bzogZnVuY3Rpb24gKHZhbHVlLCBlbGVtLCBwYXJhbSwgcm9vdCkge1xuICAgICAgICByZXR1cm4gb3B0aW9uYWwoZWxlbSkgfHwgdmFsdWUgPT09ICQoZWxlbSkuY2xvc2VzdChyb290KS5maW5kKHBhcmFtKS52YWwoKTtcbiAgICB9LFxuICAgIG1peDogZnVuY3Rpb24gKHZhbHVlLCBlbGVtLCBwYXJhbSkge1xuICAgICAgICByZXR1cm4gb3B0aW9uYWwoZWxlbSkgfHwgdmFsdWUgPj0gcGFyYW07XG4gICAgfSxcbiAgICBtYXg6IGZ1bmN0aW9uICh2YWx1ZSwgZWxlbSwgcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbmFsKGVsZW0pIHx8IHZhbHVlIDw9IHBhcmFtO1xuICAgIH0sXG4gICAgbWlubGVuZ3RoOiBmdW5jdGlvbiAodmFsdWUsIGVsZW0sIHBhcmFtLCByb290KSB7XG4gICAgICAgIHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiBnZXRMZW5ndGgodmFsdWUsIGVsZW0sIHJvb3QpO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWwoZWxlbSkgfHwgbGVuZ3RoID49IHBhcmFtO1xuICAgIH0sXG4gICAgbWF4bGVuZ3RoOiBmdW5jdGlvbiAodmFsdWUsIGVsZW0sIHBhcmFtLCByb290KSB7XG4gICAgICAgIHZhciBsZW5ndGggPSAkLmlzQXJyYXkoIHZhbHVlICkgPyB2YWx1ZS5sZW5ndGggOiBnZXRMZW5ndGgodmFsdWUsIGVsZW0sIHJvb3QpO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWwoZWxlbSkgfHwgbGVuZ3RoIDw9IHBhcmFtO1xuICAgIH0sXG4gICAgcmFuZ2U6IGZ1bmN0aW9uICh2YWx1ZSwgZWxlbSwgcGFyYW0pIHtcbiAgICAgICAgdmFyIHJhbmdlID0gZ2V0UmFuZ2UocGFyYW0pO1xuICAgICAgICBpZighcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25hbChlbGVtKSB8fCAodmFsdWUgPj0gcmFuZ2VbMF0gJiYgdmFsdWUgPD0gcmFuZ2VbMV0pO1xuICAgIH0sXG4gICAgcmFuZ2VsZW5ndGg6IGZ1bmN0aW9uICh2YWx1ZSwgZWxlbSwgcGFyYW0sIHJvb3QpIHtcbiAgICAgICAgdmFyIHJhbmdlID0gZ2V0UmFuZ2UocGFyYW0pO1xuICAgICAgICBpZighcmFuZ2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgodmFsdWUsIGVsZW0sIHJvb3QpO1xuICAgICAgICByZXR1cm4gb3B0aW9uYWwoZWxlbSkgfHwgKGxlbmd0aCA+PSByYW5nZVswXSAmJiBsZW5ndGggPD0gcmFuZ2VbMV0pO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGdldFZhbGlkYXRlKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAkLmV4dGVuZChtZXRob2RzLCBvcHRpb25zLm1ldGhvZHMpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6ICd2YWxpZGF0ZScsXG4gICAgICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZXJyb3JzOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGlzVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmVycm9ycykpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkLmlzRW1wdHlPYmplY3QoZXJyb3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW91bnRlZDogbW91bnRlZCxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgdmFsaWQ6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHNlbGVjdG9yIHx8ICdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCc7XG4gICAgICAgICAgICAgICAgdmFyICRmaWVsZExpc3QgPSAkKGNvbnRleHQuJGVsKS5maW5kKHNlbGVjdG9yKS50cmlnZ2VyKCdjaGVjaycpO1xuICAgICAgICAgICAgICAgIHZhciBlcnJvcnMgPSB7fTtcbiAgICAgICAgICAgICAgICAkZmllbGRMaXN0LmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgICAgICBpZihjb250ZXh0LmVycm9yc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzW25hbWVdID0gY29udGV4dC5lcnJvcnNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5pc0VtcHR5T2JqZWN0KGVycm9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBnZXRMZW5ndGgodmFsdWUsIGVsZW0sIHJvb3QpIHtcbiAgICBzd2l0Y2ggKGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgICAgICAgcmV0dXJuICQoJ29wdGlvbjpzZWxlY3RlZCcsIGVsZW0pLmxlbmd0aDtcbiAgICAgICAgY2FzZSAnaW5wdXQnOlxuICAgICAgICAgICAgaWYgKGNoZWNrYWJsZShlbGVtKSkge1xuICAgICAgICAgICAgICAgIHZhciAkZmllbGQgPSAkKGVsZW0pLmNsb3Nlc3Qocm9vdCkuZmluZCgnW25hbWU9XCInICsgZWxlbS5uYW1lICsgJ1wiXScpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkZmllbGQuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgIH1cbiAgICByZXR1cm4gdmFsdWUubGVuZ3RoO1xufVxuXG5mdW5jdGlvbiBjaGVja2FibGUoZWxlbSkge1xuICAgIHJldHVybiAoL3JhZGlvfGNoZWNrYm94L2kpLnRlc3QoZWxlbS50eXBlKTtcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZ2UocGFyYW0pIHtcbiAgICB2YXIgcmFuZ2UgPSBwYXJhbS5tYXRjaCgvKFxcZCspXFxzKixcXHMqKFxcZCspLyk7XG4gICAgaWYocmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIFtOdW1iZXIocmFuZ2VbMV0pLCBOdW1iZXIocmFuZ2VbMl0pXTtcbiAgICB9XG4gICAgcmV0dXJuIHJhbmdlO1xufVxuXG5mdW5jdGlvbiBvcHRpb25hbChlbGVtKSB7XG4gICAgcmV0dXJuICEkKGVsZW0pLnZhbCgpO1xufVxuXG5mdW5jdGlvbiBtb3VudGVkKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICB2YXIgc2VsZWN0b3IgPSAnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnO1xuICAgICQoY29udGV4dC4kZWwpLm9uKCdmb2N1c291dCBjaGVjaycsIHNlbGVjdG9yLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFsaWRhdGVGaWVsZChjb250ZXh0LCBldmVudCk7XG4gICAgfSkub24oJ2ZvY3VzaW4ga2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGlzVGFiID0gKGV2ZW50LmtleSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ3RhYicgfHwgZXZlbnQua2V5Q29kZSA9PT0gOTtcbiAgICAgICAgdmFyIGlzRW50ZXIgPSAoZXZlbnQua2V5IHx8ICcnKS50b0xvd2VyQ2FzZSgpID09PSAnZW50ZXInIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzO1xuICAgICAgICBpZihpc1RhYiB8fCBpc0VudGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgVnVlLmRlbGV0ZShjb250ZXh0LmVycm9ycywgZXZlbnQudGFyZ2V0Lm5hbWUpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUZpZWxkKGNvbnRleHQsIGV2ZW50KSB7XG4gICAgdmFyIGZpZWxkID0gZXZlbnQudGFyZ2V0O1xuICAgIHZhciB0YWJLZXkgPSAoZXZlbnQua2V5IHx8ICcnKS50b0xvd2VyQ2FzZSgpID09PSAndGFiJztcbiAgICB2YXIgdGFiS2V5Q29kZSA9IGV2ZW50LmtleUNvZGUgPT09IDk7XG4gICAgdmFyIGlzVGFiID0gdGFiS2V5IHx8IHRhYktleUNvZGU7XG4gICAgdmFyIGVudGVyS2V5ID0gKGV2ZW50LmtleSB8fCAnJykudG9Mb3dlckNhc2UoKSA9PT0gJ2VudGVyJztcbiAgICB2YXIgZW50ZXJLZXlDb2RlID0gZXZlbnQua2V5Q29kZSA9PT0gMTM7XG4gICAgdmFyIGlzRW50ZXIgPSBlbnRlcktleSB8fCBlbnRlcktleUNvZGU7XG4gICAgaWYoaXNUYWIgfHwgaXNFbnRlcikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFZ1ZS5kZWxldGUoY29udGV4dC5lcnJvcnMsIGZpZWxkLm5hbWUpO1xuICAgICQuZWFjaChnZXRSdWxlcyhmaWVsZCksIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIHZhciB2YWxpZCA9IG1ldGhvZHNba2V5XSgkKGZpZWxkKS52YWwoKSwgZmllbGQsIHZhbHVlLCBjb250ZXh0LiRlbCk7XG4gICAgICAgIGlmKCF2YWxpZCkge1xuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gJChmaWVsZCkuZGF0YSgnbWVzc2FnZS0nICsga2V5KTtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gdmFsaWQgPyBudWxsIDogZm9ybWF0KHRlbXBsYXRlLCB2YWx1ZSk7XG4gICAgICAgICAgICBWdWUuc2V0KGNvbnRleHQuZXJyb3JzLCBmaWVsZC5uYW1lLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFJ1bGVzKGZpZWxkKSB7XG4gICAgdmFyIHJ1bGVzID0ge307XG4gICAgJC5lYWNoKGZpZWxkLmRhdGFzZXQsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmKGtleS5zbGljZSgwLCA0KSA9PT0gJ3J1bGUnKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGtleS5zbGljZSg0KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgcnVsZXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBydWxlcztcbn1cblxuZnVuY3Rpb24gZm9ybWF0KHRlbXBsYXRlLCBhcmdzKSB7XG4gICAgKHR5cGVvZiBhcmdzID09PSAnc3RyaW5nJykgJiYgYXJncy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCdcXFxceycgKyBpICsgJ1xcXFx9JywgJ2cnKTtcbiAgICAgICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKHBhdHRlcm4sIGl0ZW0pO1xuICAgIH0pO1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VmFsaWRhdGU7XG4iXX0=