# vue-validate

vue-validate is a lightweight validation mixin, by using built-in HTML5 form validation features.

## Usage

You have to set `name` attribute for form elements, you could use like this [demo](https://holyzfy.github.io/vue-validate/demo.html).


```html
<form v-validate="optionalValue">
    ...
</form>
```

```js
var vm = new Vue({
    el: '#form',
    mixins: [validate(options)],
    methods: {
        submit: function () {
            alert('TODO submit');
        }
    }
});
```

By default, Validate elements after each `input` event, You can add the `data-lazy="true"` attribute to instead sync after `change` events:

```html
<input type="email" name="email" data-lazy="true">
```

Vue instances `vm` expose a property `errors` and a method `valid()`.

## List of built-in validation Rules

- `min`
- `max`
- `minlength`
- `maxlength`
- `minlength2` 至少几个字（两个字母算一个字，一个中文算一个字）
- `maxlength2`

## Add a custom validation method

Merge one or more methods to `options.methods`, returning true if an element is valid.

```js
options = {
    // @param bindingValue - The value passed to the directive
    rulename: function (value, elem, param, bindingValue) {
        return boolean;
    }
};
```

- `rulename`: The name of the method used to identify it and referencing it; this must be a valid JavaScript identifier of lower case, e.g. `rangelength`.
- `value`: the current value of the validated element.
- `elem`: the element to be validated.
- `param`: the value of `data-rule-rulename` on the `elem`，parameters specified for the method.

### `vm.errors`

One or more key/value pairs, the value consists of input name, validity state and message:

```js
{
    age: {
        state: 'valueMissing',
        message: 'Please fill out this field.'
    },
    email: {
        state: 'typeMismatch',
        message: "Please include an '@' in the email address. 'a' is missing an '@'."
    }
}
```

A validity state has the following values:

- **valueMissing**:When a control has no value but has a required attribute (`input required, textarea required`); or, more complicated rules for select elements and controls in radio button groups, as specified in their sections.
- **typeMismatch**: When a control that allows arbitrary user input has a value that is not in the correct syntax (E-mail, URL).
- **patternMismatch**: When a control has a value that doesn't satisfy the `pattern` attribute.
- **tooLong**: When a control has a value that is too long for the form control `maxlength` attribute (`input maxlength, textarea maxlength`).
- **tooShort**: When a control has a value that is too short for the form control `minlength` attribute (`input minlength, textarea minlength`).
- **rangeUnderflow**: When a control has a value that is not the empty string and is too low for the `min` attribute.
- **rangeOverflow**: When a control has a value that is not the empty string and is too high for the `max` attribute.
- **stepMismatch**: When a control has a value that doesn't fit the rules given by the `step` attribute.
- **badInput**: When a control has incomplete input and the user agent does not think the user ought to be able to submit the form in its current state.
- **customError**: When a control's custom validity error message (as set by the element's [setCustomValidity()](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-setcustomvalidity) method) is not the empty string.

### `vm.valid()`

Returns `true` if the form has no validity problems, `false` otherwise.

## Browser compatibility

https://caniuse.com/#feat=form-validation