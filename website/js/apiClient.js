const apiClient = (() => {
  const SERVICE_URL = 'https://qva6m7vzvh.execute-api.us-east-1.amazonaws.com/production/'

  const makeCall = (path, params) => {
    const body = JSON.stringify(params)
    const method = 'POST'
    const headers = new Headers({ 'Content-Type': 'application/json' })
    const url = SERVICE_URL + path
    return fetch(url, { body, method, headers })
      .then(response => response.json())
  }

  const makeVideoFromPost = ({ userEmail, postUrl }) => {
    const path = 'make'
    return makeCall(path, { userEmail, postUrl })
  }

  const subscribeUserToTags = ({ userEmail, tags }) => {
    const path = 'subscribeUserToTags'
    return makeCall(path, { userEmail, tags })
  }

  return {
    makeVideoFromPost,
    subscribeUserToTags
  }
})()
