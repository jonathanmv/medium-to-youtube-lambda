(() => {
  const updateResults = (title, text) => {
    const requestElement = document.getElementById('request')
    const resultsElement = document.getElementById('results')
    const titleElement = document.getElementById('resultsTitle')
    const textElement = document.getElementById('resultsText')
    titleElement.innerHTML = title
    textElement.innerHTML = text
    requestElement.classList.add('d-none')
    resultsElement.classList.remove('d-none')
  }

  const handleResults = ({userEmail, state, stateDescription, videoUrl}) => {
    let title
    let text
    switch (state) {
      case 'COMPLETED':
        title = `Your video is ready!`
        text = `Go ahead and <a href="${videoUrl}" _target="blank">watch it</a>`
        break;
      case 'REQUESTED':
      case 'PROCESSING':
        title = `Give us a few minutes`
        text = `We are reading your post outloud and making a video from it. We usually take less than 10 minutes. You will receive an email soon at ${userEmail}`
        break;
      case 'ERROR':
        title = `Oh no!!`
        text = `Something went wrong while we created your video: ${stateDescription}`
        break;
      default:
        title = `Something weird happened`
        text = `Your video status is ${state} and it's describe as "${stateDescription}". But I don't know what it means`
    }
    updateResults(title, text)
  }

  const onSubmit = event => {
    event.preventDefault()
    updateResults('On my way!', `Sending request to create the video...`)
    const form = event.target
    const body = JSON.stringify({
      userEmail: form.userEmail.value,
      postUrl: form.postUrl.value
    })
    const method = 'POST'
    const headers = new Headers({ 'Content-Type': 'application/json' })
    const url = 'https://qva6m7vzvh.execute-api.us-east-1.amazonaws.com/production/make'
    fetch(url, { body, method, headers })
      .then(response => response.json())
      .then(handleResults)
      .catch(error => console.log(error))
  }
  const form = document.getElementById('requestVideo')
  form.onsubmit = onSubmit
})()
