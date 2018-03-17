const axios = require('axios')
const _ = require('lodash')

const asJson = url => `${url}?format=json`

const cleanResponse = string => {
  const jsonBeginsAt = string.indexOf('{')
  return string.slice(jsonBeginsAt)
}

const getJsonData = async url => {
  try {
    const { data } = await axios.get(url)
    const cleaned = cleanResponse(data)
    return JSON.parse(cleaned)
  } catch (error) {
    console.log(`Couldn't get data from ${url}`)
    console.log(error.message)
  }
}

const getPostReference = data => _.get(data, 'payload.value')

const getPostId = data => _.get(getPostReference(data), 'id')
const getPostUrl = data => _.get(getPostReference(data), 'mediumUrl')
const getPostTitle = data => _.get(getPostReference(data), 'title')

const getUserReference = data => {
  const user = _.get(data, 'payload.references.User', {})
  const userId = Object.keys(user)[0]
  return user[userId]
}

const getUsername = data => _.get(getUserReference(data), 'username')

const buildPostInfo = data => ({
  username: getUsername(data),
  postId: getPostId(data),
  postUrl: getPostUrl(data),
  postTitle: getPostTitle(data)
})

const getPostInfo = async postUrl => {
  const url = asJson(postUrl)
  const data = await getJsonData(url)
  if (!data) {
    return undefined
  }

  const postInfo = buildPostInfo(data)
  if (!postInfo.postId) {
    return undefined
  }

  return postInfo
}

module.exports = {
  getPostInfo
}
