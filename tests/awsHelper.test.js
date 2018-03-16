const awsHelper = require('../src/awsHelper')
const {
  getRequest
} = awsHelper

const postId = "edbf9d528e68"
const username = "jonathanmv"

it.skip('should return undefined if no record is found', () => {
  return expect(getRequest(username, postId)).resolves.toBeUndefined()
})

it.skip('should return the record if found', () => {
  const expected = { username, postId: 'test' }
  return expect(getRequest(username, 'test')).resolves.toEqual(expected)
})
