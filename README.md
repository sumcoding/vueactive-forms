# vue-forms
A vuejs v3 validation library that utilizes the composition API to the max.


If passing the form object into a child component with internal inputs, it is important to pass the whole form input object and not just the value. As you should not directly mutate a prop value.


Validators:

Validators are functions that take a value and should either return a boolean or an object with $error as a property. All provided validators return booleans.

Example of a simple validator:
```export const required = (value) => ({ required: value === '' });```

Example of a validator that needs to take a property as well. 
```export const maxLength = (max) => (value) => ({ maxLength: value.length > max });```

Example of a simple validator that returns an object:
```export const required = (value) => ({ required: { $error: value === '', anythingYouWant: '' });```


`formInput` if passed only a value will return a simple object with no validation setup

```
formInput('value') => { $originalValue: 'value', value: 'value', '$dirty': false }
```


All keys in the `FormKey` set are protected, you will break things if you have a key that is included in this in your formGroup object.\