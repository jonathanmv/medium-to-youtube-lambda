const bluebird = require('bluebird')
const aws = require('aws-sdk')
const config = { region: 'us-east-1' }
const db = bluebird.promisifyAll(new aws.DynamoDB.DocumentClient(config))

const REQUESTS_TABLE_NAME = 'medium-to-youtube-requests'

const getRequest = async (username, postId) => {
  const TableName = REQUESTS_TABLE_NAME
  const Key = { username, postId }
  const params = { TableName, Key }
  return db.getAsync(params)
    .then(({Item}) => Item)
    .catch(error => {
      console.log(`Error getting request from db: ${error.message}`)
      console.log(params)
    })
}

module.exports = {
  getRequest
}
