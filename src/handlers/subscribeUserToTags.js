const { ACTIVE, ERROR } = require('../states.json')

const mediumHelper = require('../mediumHelper')
const awsHelper = require('../awsHelper')

const saveSubscription = ({ userEmail, tags }) => {
  const state = ACTIVE
  const subscribedAt = new Date().getTime()
  const subscription = { userEmail, tags, state, subscribedAt }
  return awsHelper.putSubscription(subscription)
}

const handler = async (event, context) => {
  const subscription = await saveSubscription(event)
  return context.succeed(subscription)
}

module.exports = {
  saveSubscription,
  handler
}
