# Examples

## With `Props`


``` js
import { formGroup, formInput } from 'vueactive-forms';
import { required } from 'vueactive-forms/validators';

export default {
  props: ['data'],
  setup(props) {
    const form = formGroup({
      /** The form group will iterate over the object creating a simple form input
          from each string | number | boolean value */
      ...props.data, 
      /** overwrite props that need validators */
      name: formInput(props.data.name, required), 
    });

    return {
      form
    }
  }
}
```

## Multiple Validators

To include multiple validators place them in an array in the `formInput`

``` js
import { formGroup, formInput } from 'vueactive-forms';
import { required, minLength, email } from 'vueactive-forms/validators';

export default {
  setup(props) {
    const form = formGroup({
      name: formInput('', required),
      email: formInput('', email),
      password: formInput('', [required, minLength(8)]),
    });

    return {
      form    
    }
  }
}
```

## Form Submission

Utilize the form functions `$touch` and `$clean` to setup a form submission.

``` js
import { formGroup, formInput } from 'vueactive-forms';
import { required } from 'vueactive-forms/validators';

export default {
  props: ['data'],
  setup(props) {
    const form = formGroup({
      ...props.data,
      name: formInput(props.data.name, required),
    });

    const submit = () => {
      form.$touch();
      if(form.$error) {
        console.log('Update form to resolve errors')
      } else {
        const payload = form.$clean();
        console.log('Form Submitted!' payload);
      }
    }

    return {
      form,
      submit
    }
  }
}
```

## Asynchronous Validations
Async support is provided. Use a custom validator that returns a promise value. The promise's success value is used for validation directly, failed promise just fails the validation and throws the error.

::: tip
See [Custom Validators](/guide/validators.html#custom) for more information on how to structure validators.
:::

``` js
import { formGroup, formInput } from 'vueactive-forms';
import { required } from 'vueactive-forms/validators';

const asyncValidator = (value) => {
  if (value === '') return { custom: false }
  // simulate async call
  return { custom: new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(typeof value === 'string' && value.length % 2 !== 0 )
    }, 350 + Math.random() * 300)
  })}
}

export default {
  props: ['data'],
  setup(props) {
    const form = formGroup({
      ...props.data,
      name: formInput(props.data.name, [required, asyncValidator]),
    });

    return {
      form
    }
  }
}
```