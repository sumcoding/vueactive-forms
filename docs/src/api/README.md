---
sidebar: auto
---

# API

## Form Group

### `$invalid`

| Type       | Description  |
|:---------- | :----------- |
| `boolean`  | Indicates the state of validation for given form group object. Becomes `true` when any of it's child validators returns a `falsy` value. In case of validation groups, all grouped validators are considered. |


### `$dirty`

| Type       | Description  |
|:---------- | :----------- |
| `boolean`  | Represents if any child inputs of the form group has been touched. Can be set manually using the `touch()` and `reset()` functions. |

### `$error`

| Type       | Description  |
|:---------- | :----------- |
| `boolean`  | Indicates if the form is both `$invalid` and `$dirty`. Use as a convenient combination for messaging. |

### `$clean`

| Type        | Description  |
|:----------- | :----------- |
| `function`  | Use to remove all vueactive form attributes. This will give you a clean object that can be used to `submit` the form to a database or the like. |


### `$reset`

| Type        | Description  |
|:----------- | :----------- |
| `function`  | Use to reset the form input values back to the `$originalValue` the form started with and reset all `$dirty`'s back to false. |

### `$touch`

| Type        | Description  |
|:----------- | :----------- |
| `function`  | Use to set `$dirty` on the top level form and all its children. |

## Form Input

### `$invalid`

| Type       | Description  |
|:---------- | :----------- |
| `boolean`  | Indicates the state of validation for given input. Becomes `true` when any of it's validators returns a `falsy` value. In case of validation groups, all grouped validators are considered. |


### `$dirty`

| Type       | Description  |
|:---------- | :----------- |
| `boolean`  | Represents if the input has been touched. |

### `$error`

| Type       | Description  |
|:---------- | :----------- |
| `boolean`  | Indicates if the input is both `$invalid` and `$dirty`. Use as a convenient combination for messaging. |


### `$originalValue`

| Type       | Description  |
|:---------- | :----------- |
|  `string` `number` `boolean`  | Keeps a copy of the original value the input was initialized with. Used with the `reset` function on a form group. |

### `value`

| Type       | Description  |
|:---------- | :----------- |
| `string` `number` `boolean`  | Reactive value to be used with `v-model`. |


