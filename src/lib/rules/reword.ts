const obj = {
  'my-rule': [
    2,
    {
      regex: 'apples',
      message: "I don't like apples, I'd rather eat bananas.",
    },
  ],
}

const meta = {
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
        ],
      },
    },
  ],
}

function create(context: any) {
  const options = context.options
  const [rules = []] = options

  return {
    Identifier(node: any) {
      rules.forEach((rule: any) => {
        const regex = new RegExp(rule.regex)

        if (regex.test(node.name)) {
          return context.report({
            node,
            message: rule.message.replace('{{result}}', node.name),

            // fix(fixer) {
            //   if (node) {
            //     // Can't auto-fix template literal with expressions
            //     return
            //   }

            //   return [
            //     fixer.replaceTextRange([node.start, node.start + 1], '"'),
            //     fixer.replaceTextRange([node.end - 1, node.end], '"'),
            //   ]
            // },
          })
        }
      })
    },
  }
}

export { meta, create }
