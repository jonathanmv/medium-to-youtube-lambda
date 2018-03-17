const mediumHelper = require('../src/mediumHelper')
const { getPostInfo } = mediumHelper

const postUrl = `https://medium.com/@jonathanmv/faceless-influencer-edbf9d528e68`
it.skip('should get info for post', () => {
  const expected = { "postId": "edbf9d528e68", "postTitle": "Faceless Influencer", "postUrl": "https://medium.com/@jonathanmv/faceless-influencer-edbf9d528e68", "username": "jonathanmv" }
  return expect(getPostInfo(postUrl)).resolves.toEqual(expected)
})

it.skip('should get undefined', () => {
  const url = `https://NOT-medium.com/@jonathanmv/faceless-influencer-edbf9d528e68`
  return expect(getPostInfo(url)).resolves.toBeUndefined()
})

it.skip('should get undefined for valid medium url but invalid post url', () => {
  const url = `https://medium.com/@jonathanmv/latest`
  return expect(getPostInfo(url)).resolves.toBeUndefined()
})
