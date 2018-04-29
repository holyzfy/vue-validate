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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGFBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QjtBQUN6QixZQUFJLFVBQVU7QUFDVix1Q0FBMkI7QUFEakIsU0FBZDtBQUdBLGVBQU8sTUFBUCxDQUFjLE9BQWQsRUFBdUIsTUFBdkI7QUFDQSxlQUFPO0FBQ0gsZ0JBREcsa0JBQ0k7QUFDSCx1QkFBTztBQUNILDRCQUFRO0FBREwsaUJBQVA7QUFHSCxhQUxFO0FBTUgsbUJBTkcscUJBTU87QUFDTixvQkFBSSxVQUFVLElBQWQ7QUFDQSxvQkFBSSxPQUFPLFFBQVEsR0FBbkI7QUFDQSxxQkFBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixpQkFBUztBQUNwQyx3QkFBRyxDQUFDLE1BQU0sTUFBTixDQUFhLE9BQWIsQ0FBcUIsSUFBekIsRUFBK0I7QUFDM0IsOEJBQU0sSUFBTixDQUFXLE9BQVgsRUFBb0IsS0FBcEI7QUFDSDtBQUNKLGlCQUpEO0FBS0EscUJBQUssZ0JBQUwsQ0FBc0IsUUFBdEIsRUFBZ0MsaUJBQVM7QUFDckMsd0JBQUksT0FBTyxNQUFNLE1BQWpCO0FBQ0Esd0JBQUksVUFBVSxDQUFDLFVBQUQsRUFBYSxPQUFiLEVBQXNCLE9BQXRCLENBQThCLEtBQUssSUFBbkMsS0FBNEMsQ0FBMUQ7QUFDQSx3QkFBRyxXQUFXLEtBQUssT0FBTCxDQUFhLElBQTNCLEVBQWlDO0FBQzdCLDhCQUFNLElBQU4sQ0FBVyxPQUFYLEVBQW9CLEtBQXBCO0FBQ0g7QUFDSixpQkFORDtBQU9BLHFCQUFLLGdCQUFMLENBQXVCLFNBQXZCLEVBQWtDLGlCQUFTO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLDRCQUFRLHlCQUFSLElBQXFDLE1BQU0sY0FBTixFQUFyQztBQUNBLHdCQUFJLE9BQU8sTUFBTSxNQUFqQjtBQUNBLDRCQUFRLElBQVIsQ0FBYSxRQUFRLE1BQXJCLEVBQTZCLEtBQUssSUFBbEMsRUFBd0M7QUFDcEMsK0JBQU8sVUFBVSxLQUFLLFFBQWYsQ0FENkI7QUFFcEMsaUNBQVMsS0FBSztBQUZzQixxQkFBeEM7QUFJSCxpQkFWRCxFQVVHLElBVkg7QUFXSCxhQWhDRTs7QUFpQ0gscUJBQVM7QUFDTCxxQkFESyxtQkFDRztBQUNKLDJCQUFPLEtBQUssR0FBTCxDQUFTLGFBQVQsRUFBUDtBQUNIO0FBSEk7QUFqQ04sU0FBUDtBQXVDSDs7QUFFRCxhQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCO0FBQ2xCLFlBQUksVUFBVSxJQUFkO0FBQ0EsWUFBSSxPQUFPLE1BQU0sTUFBakI7QUFDQSxZQUFHLEtBQUssUUFBTCxDQUFjLEtBQWpCLEVBQXdCO0FBQ3BCLG9CQUFRLE9BQVIsQ0FBZ0IsUUFBUSxNQUF4QixFQUFnQyxLQUFLLElBQXJDO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsb0JBQVEsSUFBUixDQUFhLFFBQVEsTUFBckIsRUFBNkIsS0FBSyxJQUFsQyxFQUF3QztBQUNwQyx1QkFBTyxVQUFVLEtBQUssUUFBZixDQUQ2QjtBQUVwQyx5QkFBUyxLQUFLO0FBRnNCLGFBQXhDO0FBSUg7QUFDSjs7QUFFRCxhQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0I7QUFDcEIsYUFBSSxJQUFJLEdBQVIsSUFBZSxHQUFmLEVBQW9CO0FBQ2hCLGdCQUFHLElBQUksR0FBSixDQUFILEVBQWE7QUFDVCx1QkFBTyxHQUFQO0FBQ0g7QUFDSjtBQUNKOztzQkFFYyxXIiwiZmlsZSI6InZ1ZS12YWxpZGF0ZS0wLjMuMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGdldFZhbGlkYXRlKGNvbmZpZykge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICBkaXNhYmxlTmF0aXZlVmFsaWRhdGlvblVJOiB0cnVlXG4gICAgfTtcbiAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIGNvbmZpZyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGF0YSgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZXJyb3JzOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgbW91bnRlZCgpIHtcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBmb3JtID0gY29udGV4dC4kZWw7XG4gICAgICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmKCFldmVudC50YXJnZXQuZGF0YXNldC5sYXp5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrLmJpbmQoY29udGV4dCkoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIGVsZW0gPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSBbJ2NoZWNrYm94JywgJ3JhZGlvJ10uaW5kZXhPZihlbGVtLnR5cGUpID49IDA7XG4gICAgICAgICAgICAgICAgaWYoY2hlY2tlZCB8fCBlbGVtLmRhdGFzZXQubGF6eSkge1xuICAgICAgICAgICAgICAgICAgICBjaGVjay5iaW5kKGNvbnRleHQpKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lciggXCJpbnZhbGlkXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgaW52YWxpZCBldmVudCBkb2VzIG5vdCBidWJibGUsIFxuICAgICAgICAgICAgICAgIC8vIHNvIGlmIHlvdSB3YW50IHRvIHByZXZlbnQgdGhlIG5hdGl2ZSB2YWxpZGF0aW9uIGJ1YmJsZXMgb24gbXVsdGlwbGUgZWxlbWVudHNcbiAgICAgICAgICAgICAgICAvLyB5b3UgbXVzdCBhdHRhY2ggYSBjYXB0dXJlLXBoYXNlIGxpc3RlbmVyLlxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZGlzYWJsZU5hdGl2ZVZhbGlkYXRpb25VSSAmJiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciBlbGVtID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgICAgIGNvbnRleHQuJHNldChjb250ZXh0LmVycm9ycywgZWxlbS5uYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBmaW5kU3RhdGUoZWxlbS52YWxpZGl0eSksXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVsZW0udmFsaWRhdGlvbk1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRydWUpO1xuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICB2YWxpZCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwuY2hlY2tWYWxpZGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY2hlY2soZXZlbnQpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgdmFyIGVsZW0gPSBldmVudC50YXJnZXQ7XG4gICAgaWYoZWxlbS52YWxpZGl0eS52YWxpZCkge1xuICAgICAgICBjb250ZXh0LiRkZWxldGUoY29udGV4dC5lcnJvcnMsIGVsZW0ubmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dC4kc2V0KGNvbnRleHQuZXJyb3JzLCBlbGVtLm5hbWUsIHtcbiAgICAgICAgICAgIHN0YXRlOiBmaW5kU3RhdGUoZWxlbS52YWxpZGl0eSksXG4gICAgICAgICAgICBtZXNzYWdlOiBlbGVtLnZhbGlkYXRpb25NZXNzYWdlXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZmluZFN0YXRlKG9iaikge1xuICAgIGZvcih2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZihvYmpba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0VmFsaWRhdGU7XG4iXX0=