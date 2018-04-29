function getValidate(config) {
    var options = {
        disableNativeValidationUI: true
    };
    Object.assign(options, config);
    return {
        data() {
            return {
                errors: {}
            };
        },
        mounted() {
            var context = this;
            var form = context.$el;
            form.addEventListener('input', event => {
                if(!event.target.dataset.lazy) {
                    check.bind(context)(event);
                }
            });
            form.addEventListener('change', event => {
                var elem = event.target;
                var checked = ['checkbox', 'radio'].indexOf(elem.type) >= 0;
                if(checked || elem.dataset.lazy) {
                    check.bind(context)(event);
                }
            });
            form.addEventListener( "invalid", event => {
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
            valid() {
                return this.$el.checkValidity();
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

export default getValidate;
