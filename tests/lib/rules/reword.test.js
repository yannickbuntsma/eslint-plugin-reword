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
