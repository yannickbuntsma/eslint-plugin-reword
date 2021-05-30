# eslint-plugin-reword

Automatically reword variables to adhere to project based naming conventions.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-reword`:

```
$ npm install eslint-plugin-reword --save-dev
```


## Usage

Add `reword` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "reword"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "reword/rule-name": 2
    }
}
```

## Supported Rules

* TBA





