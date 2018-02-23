# vue-validate

vue-validate is a lightweight, extensible form validation mixin for Vue components.

## Usage

You have to set `name` for field, you could use like this [demo](https://holyzfy.github.io/vue-validate/demo/index.html).

```js
var vm = new Vue({
    el: '#form',
    mixins: [validate(options)],
    methods: {
        submit: function () {
            if (!this.valid()) {
                return;
            }
            alert('Form is valid!');
        }
    }
});
```

Vue instances `vm` expose a property `errors` and a method `valid(selector)`.

### `vm.errors`

One or more key/value pairs of input names and messages, e.g.:

```js
{
    username: 'Username is already existed',
    phone: 'Phone number is required'
}
```

### `vm.valid(selector)`

Checks whether the selected form is valid or whether all selected elements are valid, returning true if an element is valid. 

- `selector`: Elements to be validated. Defaults to `input, textarea, select`.

## Add a custom validation method

Merge one or more methods to `options.methods`, returning true if an element is valid. 

```js
options.methods = {
    rulename: function (value, elem, param, root) {
        return boolean;
    }
};
```

- `rulename`: The name of the method used to identify it and referencing it; this must be a valid JavaScript identifier, e.g. `rangelength`.
- `value`: the current value of the validated element.
- `elem`: the element to be validated.
- `param`: the value of `data-rule-rulename` on the `elem`，parameters specified for the method.
- `root`: The root DOM element that the Vue instance is managing.

## List of built-in Validation methods

- `required`: Makes the element required.
- `mobile`: Makes the element require a valid mobile (start with `1` and the length is 11).
- `equalto`: Requires the element to be the same as another one.
- `min`: Makes the element require a given minimum.
- `max`: Makes the element require a given maximum.
- `minlength`: Makes the element require a given minimum length.
- `maxlength`: Makes the element require a given maximum length.
- `range`: Makes the element require a given value range.
- `rangelength`: Makes the element require a given value range.

## Credits

This project was inspired by [jquery-validation](https://github.com/jquery-validation/jquery-validation)
