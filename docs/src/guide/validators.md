# Validators

## required
``` js
(value) => ({ required: value === '' });
```

## minLength
``` js
(min) => (value) => ({ mixLength: value.length < min });
```

## maxLength
``` js
(max) => (value) => ({ maxLength: value.length > max });
```

## minValue 
``` js
(min) => (value) => ({ minValue: typeof value === 'number' && value < min });
```

## maxValue 
``` js
(max) => (value) => ({ maxValue: typeof value === 'number' && value > max });
```

## email 
``` js
(value) => ({ email: !emailRegex.test(value) });
```

## numeric 
``` js
(value) => ({ numeric: !(typeof value === 'number') });
```

## Custom Validtors

A validator needs to take in a value and return an object with the desired name of the validation for the key and the condition as its key value. `{ custom: value === 'test' }`. This is used for checking the value later and updating the form input and form group. If the key value is `true` the input will be `$invalid`, so keep this in mind when designing validations.

``` js
const customValidator = (value) => ({ custom: value === 'test' });
```

A validator can also take variable information needed for the validation (see [minLength](#minLength) or the like).

``` js
const customValidator = (info) => (value) => ({ custom: value === info });
```

When setting up an asynchronous validator make sure that the key value is the promise not the object. `{ custom: Promise }`

``` js
const asyncValidator = async (value) => {
  if (value === '') return { custom: false }
  return { custom: await fetch('something') }
}
```