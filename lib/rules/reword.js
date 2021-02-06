const Case = require('case')

module.exports = {
  name: 'reword',
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
          const { name } = node
          const input = name

          const searchString = typeof r === 'string' ? r : r.regex

          const regex = new RegExp(searchString, 'gi')
          const match = input.match(regex)

          if (!match) {
            return input
          }

          const message =
            r.message ||
            'Found match "{{match}}". This word is not allowed. Please reword accordingly.'

          const baseReportData = {
            node,
            data: { match: node.name },
            message,
          }

          const [first] = match
          const kebabMatch = Case.kebab(first)

          const kebabInput = Case.kebab(input)

          const kebabReplacement = Case.kebab(r.replacement)

          const res = kebabInput.replace(kebabMatch, kebabReplacement).replace('--', '-')

          const casing = Case.of(name)
          const formatter = Case[casing]

          if (typeof formatter !== 'function') {
            return input
          }

          const hasReplacement = r.replacement
          const casedReplacement = formatter(res)

          return context.report({
            ...baseReportData,

            fix(fixer) {
              if (!casing || !hasReplacement) {
                // Can't auto-fix word of unknown casing or that has no replacement.
                return
              }

              return fixer.replaceText(node, casedReplacement)
            },
          })
        })
      },
    }
  },
}
