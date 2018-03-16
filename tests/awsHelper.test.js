const { REQUESTED } = require('../src/states.json')
const awsHelper = require('../src/awsHelper')
const {
  getRequest,
  putRequest,
  runMediumToYoutubeTask
} = awsHelper

const postId = "edbf9d528e68"
const username = "jonathanmv"

describe.skip('getRequest', () => {
  it('should return undefined if no record is found', () => {
    return expect(getRequest(username, postId)).resolves.toBeUndefined()
  })

  it('should return the record if found', () => {
    const expected = { username, postId: 'test' }
    return expect(getRequest(username, 'test')).resolves.toEqual(expected)
  })
})

describe.skip('putRequest', () => {
  it('should return the record if saved', () => {
    const request = { username, postId: new Date().getTime().toString() }
    return expect(putRequest(request)).resolves.toEqual(request)
  })

  it('should throw error if record is not saved', () => {
    const request = { username }
    return expect(putRequest(request)).rejects.toThrow()
  })
})

describe.skip('runMediumToYoutubeTask', () => {
  it('should run a task', () => {
    const request = { username, postId, state: REQUESTED }
    return expect(runMediumToYoutubeTask(request)).resolves.toBeUndefined()
  })
})
