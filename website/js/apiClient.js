const apiClient = (() => {
  const SERVICE_URL = 'https://qva6m7vzvh.execute-api.us-east-1.amazonaws.com/production/'

  const makeCall = (params) => {
    const body = JSON.stringify(params)
    const method = 'POST'
    const headers = new Headers({ 'Content-Type': 'application/json' })
    return fetch(SERVICE_URL, { body, method, headers })
      .then(response => response.json())
  }

  const makeVideoFromPost = ({ userEmail, postUrl }) => {
    const path = 'makeVideoFromPost'
    return makeCall({ path, userEmail, postUrl })
  }

  const subscribeUserToTags = ({ userEmail, tags }) => {
    const path = 'subscribeUserToTags'
    return makeCall({ path, userEmail, tags })
  }

  return {
    makeVideoFromPost,
    subscribeUserToTags
  }
})()
