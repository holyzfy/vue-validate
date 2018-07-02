import $ from 'jQuery';
import Vue from 'Vue';

var methods = {
    required: function (value, elem, param, root) {
        if (elem.nodeName.toLowerCase() === "select") {
            var val = $(elem).val();
            return val && val.length > 0;
        }
        if(checkable(elem)) {
            return getLength(value, elem, root) > 0;
        }
        return value.length > 0;
    },
    pattern: function (value, elem, param) {
        return optional(elem) || (new RegExp(param)).test(value);
    },
    mobile: function (value, elem, param) {
        return optional(elem) || /^1\d{10}$/.test(value);
    },
    equalto: function (value, elem, param, root) {
        return optional(elem) || value === $(elem).closest(root).find(param).val();
    },
    min: function (value, elem, param) {
        return optional(elem) || +value >= param;
    },
    max: function (value, elem, param) {
        return optional(elem) || +value <= param;
    },
    minlength: function (value, elem, param, root) {
        var length = $.isArray( value ) ? value.length : getLength(value, elem, root);
        return optional(elem) || length >= param;
    },
    maxlength: function (value, elem, param, root) {
        var length = $.isArray( value ) ? value.length : getLength(value, elem, root);
        return optional(elem) || length <= param;
    },
    range: function (value, elem, param) {
        var range = getRange(param);
        if(!range) {
            return true;
        }
        return optional(elem) || (+value >= range[0] && +value <= range[1]);
    },
    rangelength: function (value, elem, param, root) {
        var range = getRange(param);
        if(!range) {
            return true;
        }
        var length = getLength(value, elem, root);
        return optional(elem) || (length >= range[0] && length <= range[1]);
    }
};

function getValidate(options) {
    options = options || {};
    $.extend(methods, options.methods);
    return {
        data: function () {
            return {
                errors: {}
            };
        },
        mounted: mounted,
        methods: {
            valid: function (selector) {
                var context = this;
                selector = selector || 'input, textarea, select';
                var $fieldList = $(context.$el).find(selector).trigger('check');
                var errors = {};
                $fieldList.each(function () {
                    var name = $(this).attr('name');
                    if(context.errors[name]) {
                        errors[name] = context.errors[name];
                    }
                });
                return $.isEmptyObject(errors);
            }
        }
    };
}

function getLength(value, elem, root) {
    switch (elem.nodeName.toLowerCase()) {
        case 'select':
            return $('option:selected', elem).length;
        case 'input':
            if (checkable(elem)) {
                var $field = $(elem).closest(root).find('[name="' + elem.name + '"]');
                return $field.filter(':checked').length;
            }
            break;
        default:
    }
    return value.length;
}

function checkable(elem) {
    return (/radio|checkbox/i).test(elem.type);
}

function getRange(param) {
    var range = param.match(/(\d+)\s*,\s*(\d+)/);
    if(range) {
        return [Number(range[1]), Number(range[2])];
    }
    return range;
}

function optional(elem) {
    return !$(elem).val();
}

function mounted() {
    var context = this;
    var selector = 'input, textarea, select';
    $(context.$el).on('change check', selector, function (event) {
        validateField(context, event);
    }).on('focusin keyup', function (event) {
        var isTab = (event.key || '').toLowerCase() === 'tab' || event.keyCode === 9;
        var isEnter = (event.key || '').toLowerCase() === 'enter' || event.keyCode === 13;
        if(isTab || isEnter) {
            return;
        }
        Vue.delete(context.errors, event.target.name);
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
    if(isTab || isEnter) {
        return;
    }
    Vue.delete(context.errors, field.name);
    $.each(getRules(field), function (key, value) {
        var valid = methods[key]($(field).val(), field, value, context.$el);
        if(!valid) {
            var template = $(field).data('message-' + key);
            var message = valid ? null : format(template, value);
            Vue.set(context.errors, field.name, message);
        }
        return valid;
    });
}

function getRules(field) {
    var rules = {};
    $.each($(field).data(), function (key, value) {
        if(key.slice(0, 4) === 'rule') {
            var name = key.slice(4).toLowerCase();
            rules[name] = value;
        }
    });
    return rules;
}

function format(template, args) {
    (typeof args === 'string') && args.split(',').forEach(function (item, i) {
        var pattern = new RegExp('\\{' + i + '\\}', 'g');
        template = template.replace(pattern, item);
    });
    return template;
}

export default getValidate;
