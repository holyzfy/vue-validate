var methods = {};

function getValidate(options) {
    Object.assign(methods, options);
    return {
        data() {
            return {
                errors: {}
            };
        },
        methods: {
            valid() {
                var context = this;
                var list = [].slice.call(context.$el.querySelectorAll('input, textarea, select'));
                list.forEach(item => item.checkValidity());
                return Object.keys(context.errors).length === 0;
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

function check(event) {
    var context = this;
    var elem = event.target;
    if(elem.validity.valid) {
        context.$delete(context.errors, elem.name);
        checkCustomRoles(context, elem);
    } else {
        context.$set(context.errors, elem.name, {
            state: findState(elem.validity),
            message: elem.validationMessage
        });
    }
}

function checkCustomRoles(context, elem) {
    var rules = getRules(elem);
    for(var key in rules) {
        var param = rules[key]; 
        var valid = methods[key](elem.value, elem, param);
        if(!valid) {
            var messageKey = 'message' + key[0].toUpperCase() + key.slice(1);
            var template = elem.dataset[messageKey];
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

export default getValidate;
