const bluebird = require('bluebird')
const aws = require('aws-sdk')
const config = { region: 'us-east-1' }
const db = bluebird.promisifyAll(new aws.DynamoDB.DocumentClient(config))

const REQUESTS_TABLE_NAME = 'medium-to-youtube-requests'
const TableName = REQUESTS_TABLE_NAME

const getRequest = (username, postId) => {
  const Key = { username, postId }
  const params = { TableName, Key }
  return db.getAsync(params)
    .then(({Item}) => Item)
    .catch(error => {
      console.log(`Error getting request from db: ${error.message}`)
      console.log(params)
    })
}

const putRequest = Item => {
  const params = { TableName, Item }
  return db.putAsync(params)
    .then(_ => Item)
    .catch(error => {
      console.log(`Error putting request from db: ${error.message}`)
      console.log(params)
      throw error
    })
}

module.exports = {
  getRequest,
  putRequest
}
