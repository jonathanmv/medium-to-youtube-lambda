const { REQUESTED, ERROR } = require('./states.json')

const mediumHelper = require('./mediumHelper')

const makeMediumToYoutubeRequest = async ({ postInfo, userEmail }) => {
  const { username, postId } = postInfo
  let state = REQUESTED
  let request = { username, postId, userEmail, state }
  try {
    await awsHelper.saveVideoRequest(request)
    await awsHelper.startMediumToYoutubeTask(request)
  } catch (error) {
    state = ERROR
    const stateDescription = error.message
    request = { ...request, state, stateDescription }
    console.log(`Error starting medium to youtube task`)
    console.log(request)
    await awsHelper.saveVideoRequest(request)
  }
  return request
}

const main = async (event, context) => {
  const { postUrl, userEmail } = event
  const postInfo = await mediumHelper.getPostInfo(postUrl)
  if (!postInfo) {
    return context.succeed({
      state: ERROR,
      stateDescription: `Couldn't get the post information from ${postUrl}`
    })
  }

  const { username, postId } = postInfo
  let request = await awsHelper.getRequest(username, postId)
  if (request) {
    return context.succeed(request)
  }

  request = await makeMediumToYoutubeRequest({ postInfo, userEmail })
  return context.succeed(request)
}

exports.handle = main
