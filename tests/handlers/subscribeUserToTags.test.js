const {
  saveSubscription
} = require('../../src/handlers/subscribeUserToTags')

const {
  ACTIVE
} = require('../../src/states.json')

const userEmail = 'jonathanmv@outlook.com'
const tags = ['art', 'science']

it.skip('should subscribeUserToTags', () => {
  const params = { userEmail, tags }
  return expect(saveSubscription(params)).resolves.toHaveProperty('status', ACTIVE)
})
