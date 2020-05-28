/* eslint-env mocha */
const assert = require('assert')
const properties = [
  { camelCase: 'minimumOrganizationNameLength', raw: 'MINIMUM_ORGANIZATION_NAME_LENGTH', description: 'Shortest organization name length', value: '1', default: '1', valueDescription: 'Integer' },
  { camelCase: 'maximumOrganizationNameLength', raw: 'MAXIMUM_ORGANIZATION_NAME_LENGTH', description: 'Longest organization name length', value: '1000', default: '50', valueDescription: 'Integer' },
  { camelCase: 'minimumInvitationCodeLength', raw: 'MINIMUM_INVITATION_CODE_LENGTH', description: 'Shortest invitation code length', value: '1', default: '6', valueDescription: 'Integer' },
  { camelCase: 'maximumInvitationCodeLength', raw: 'MAXIMUM_INVITATION_CODE_LENGTH', description: 'Longest invitation code length', value: '1000', default: '50', valueDescription: 'Integer' },
  { camelCase: 'membershipProfileFields', raw: 'MEMBERSHIP_PROFILE_FIELDS', description: 'Personal information to share with members', value: 'full-name,contact-email,display-name,display-email,dob,location,phone,company-name,website,occupation', default: 'display-name,display-email', valueDescription: 'Profile property list' }
]

describe('index', () => {
  afterEach(() => {
    require('./index.js').setup(global.applicationPath)
  })
  for (const property of properties) {
    describe(property.raw, () => {
      describe(property.description, () => {
        if (!property.noDefaultValue) {
          it('default ' + (property.default || property.defaultDescription || 'unset'), async () => {
            delete (process.env[property.raw])
            delete require.cache[require.resolve('./index.js')]
            require('./index.js')
            delete require.cache[require.resolve('./index.js')]
            assert.strictEqual((global[property.camelCase] || '').toString().trim(), property.default.toString())
          })
        }
        it(property.valueDescription, async () => {
          process.env[property.raw] = property.value
          delete require.cache[require.resolve('./index.js')]
          require('./index.js')
          delete require.cache[require.resolve('./index.js')]
          assert.strictEqual(global[property.camelCase].toString(), property.value)
        })
      })
    })
  }
})
