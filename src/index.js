const { REQUESTED, ERROR } = require('./states.json')

const mediumHelper = require('./mediumHelper')
const awsHelper = require('./awsHelper')

const makeMediumToYoutubeRequest = async ({ postInfo, userEmail }) => {
  const { username, postId, postUrl, postTitle } = postInfo
  let state = REQUESTED
  let request = { username, postId, postUrl, postTitle, userEmail, state }
  try {
    await awsHelper.putRequest(request)
    await awsHelper.runMediumToYoutubeTask(request)
  } catch (error) {
    state = ERROR
    const stateDescription = error.message
    request = Object.assign(request, { state, stateDescription })
    console.log(`Error starting medium to youtube task`)
    console.log(request)
    await awsHelper.putRequest(request)
  }
  return request
}

const main = async (event, context) => {
  try {
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
  } catch (error) {
    console.log(`Couldn't handle request: ${error.message}`)
    console.log(JSON.stringify(event, null, 2))
    return context.succeed({
      state: ERROR,
      stateDescription: `Couldn't handle request: ${error.message}`
    })
  }
}

exports.handler = main
