# Getting Started

## Installation

```
npm install vueactive-forms --save
```

or

```
yarn add vueactive-forms -D
```

## Basic Usage

You can import the different form builders and validators from the library directly into the Component. 

``` js
import { formGroup, formInput } from 'vueactive-forms';
import { required, maxLength } from 'vueactive-forms/validators';

export default {
  setup() {
    // for a single input
    const name = formInput('value', required);
    // or a full form object
    const form = formGroup({
      name: '',
      password: formInput('', [required, maxLength(20)]),
    });

    return {
      name,
      form
    }
  }
}
```
In the template to access the reactive value a `.value` notation is required
``` html
<template>
  <input v-model="name.value" />
  <span v-if="name.$invalid && name.$dirty"></span>
  <input v-model="form.password.value" />
  <span v-if="form.$invalid">The form is invalid</span>
</template>
```