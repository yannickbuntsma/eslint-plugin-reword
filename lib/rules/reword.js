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
    fixable: 'code',
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
                string: { type: 'string' },
                message: { type: 'string' },
                replacement: { type: 'string' },
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
        rules.forEach((r) => {
          const lowerCaseNode = node.name.toLowerCase()
          const lowerCaseSearchString = r.string.toLowerCase()
          const nodeContainsString = lowerCaseNode.indexOf(lowerCaseSearchString) > -1

          if (!nodeContainsString) return

          console.log({
            lowerCaseNode,
            lowerCaseSearchString,
            nodeContainsString,
          })

          const { name, range, start, end } = node

          const message =
            r.message ||
            'Found match "{{match}}". This word is not allowed. Please reword accordingly.'

          const baseReportData = {
            node,
            data: { match: node.name },
            message,
          }

          const casing = Case.of(name)
          const hasReplacement = r.replacement

          const casedReplacement = Case[casing](r.replacement)
          console.log({
            name,
            range,
            casing,
            casedReplacement,
          })

          return context.report({
            ...baseReportData,

            fix(fixer) {
              if (!casing || !hasReplacement) {
                // Can't auto-fix word of unknown casing or that has no replacement.
                return
              }

              const r = node.name.replace()

              return fixer.replaceText(node, casedReplacement)
            },
          })
        })
      },
    }
  },
}
