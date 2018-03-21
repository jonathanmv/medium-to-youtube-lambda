const makeVideoFromPost = require('./makeVideoFromPost').handler
const subscribeUserToTags = require('./subscribeUserToTags').handler

module.exports = {
  makeVideoFromPost,
  subscribeUserToTags
}
