const { RuleTester } = require('eslint')
const rule = require('../../../lib/rules/reword')

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } })

const createTitle = (title) => `reword | ${title}`
const createDefaultErrorMessage = (match) =>
  `Found match "${match}". This word is not allowed. Please reword accordingly.`

;(() => {
  const title = createTitle('basic partial word match')
  const options = [['lemon']]
  const errors = [{ message: createDefaultErrorMessage('lemonTree') }]

  ruleTester.run(title, rule, {
    valid: [
      {
        code: "const appleTree = '___'",
        options,
      },
      {
        code: 'function appleTree() {}',
        options,
      },
      {
        code: 'function doThing(appleTree) {}',
        options,
      },
    ],
    invalid: [
      {
        code: "const lemonTree = '___'",
        options,
        errors,
      },
      {
        code: 'function lemonTree() {}',
        options,
        errors,
      },
      {
        code: 'function doThing(lemonTree) {}',
        options,
        errors,
      },
    ],
  })
})()
;(() => {
  const title = createTitle('replacing match in different sections of word')
  const options = [[{ regex: 'teaSpoon', replacement: 'coffeeCup' }]]

  ruleTester.run(title, rule, {
    valid: [
      {
        code: "const coffeeSpoon = '___'",
        options,
      },
      {
        code: "const teaCup = '___'",
        options,
      },
      {
        code: 'function doThing(tea) {}',
        options,
      },
    ],
    invalid: [
      {
        code: "const teaSpoon = '___'",
        output: "const coffeeCup = '___'",
        options,
        errors: [{ message: createDefaultErrorMessage('teaSpoon') }],
      },
      {
        code: "const teaSpoonMaterial = '___'",
        output: "const coffeeCupMaterial = '___'",
        options,
        errors: [{ message: createDefaultErrorMessage('teaSpoonMaterial') }],
      },
      {
        code: 'function hasTeaSpoon() {}',
        output: 'function hasCoffeeCup() {}',
        options,
        errors: [{ message: createDefaultErrorMessage('hasTeaSpoon') }],
      },
      {
        code: 'function doThing(teaSpoon) {}',
        output: 'function doThing(coffeeCup) {}',
        options,
        errors: [{ message: createDefaultErrorMessage('teaSpoon') }],
      },
    ],
  })
})()
