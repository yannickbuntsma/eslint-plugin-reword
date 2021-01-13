const Case = require('case')

/**
 * Example
 */
const obj = {
  'my-rule': [
    2,
    {
      regex: 'apples',
      message: "I don't like apples, I'd rather eat bananas.",
    },
  ],
}

module.exports = {
  meta: {
    fixable: true,
    schema: [
      {
        type: 'array',
        items: {
          anyOf: [
            { type: 'string' },
            {
              type: 'object',
              properties: {
                string: { type: 'string' },
                message: { type: 'string' },
              },
              required: ['string'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                regex: { type: 'string' },
                message: { type: 'string' },
              },
              required: ['regex'],
              additionalProperties: false,
            },
            {
              type: 'object',
              properties: {
                regex: { type: 'string' },
                message: { type: 'string' },
                replacement: { type: 'string' },
              },
              required: ['regex'],
              additionalProperties: false,
            },
          ],
        },
      },
    ],
  },
  create: function (context) {
    const options = context.options
    const [rules = []] = options

    return {
      Identifier(node) {
        rules.forEach((rule) => {
          const regex = new RegExp(rule.regex)

          console.log('node.name.match(regex)', node.name.match(regex))

          if (regex.test(node.name)) {
            const baseReportData = {
              node,
              data: { match: node.name },
            }

            if (!rule.message) {
              return context.report({
                ...baseReportData,
                message:
                  'Found match "{{match}}". This word is not allowed. Please reword accordingly.',
              })
            }

            const casing = Case.of(node.name)
            const hasReplacement = rule.replacement

            return context.report({
              ...baseReportData,
              message: rule.message,

              fix(fixer) {
                if (!casing || !hasReplacement) {
                  // Can't auto-fix word of unknown casing or that has no replacement.
                  return
                }

                const replacement = Case[casing](rule.replacement)

                return fixer.replaceTextRange([node.start, node.end], replacement)
              },
            })
          }
        })
      },
    }
  },
}
