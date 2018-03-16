const { REQUESTED } = require('./states.json')
const bluebird = require('bluebird')
const aws = require('aws-sdk')
const config = { region: 'us-east-1' }
const db = bluebird.promisifyAll(new aws.DynamoDB.DocumentClient(config))
const ecs = bluebird.promisifyAll(new aws.ECS(config))

const REQUESTS_TABLE_NAME = 'medium-to-youtube-requests'

const getRequest = (username, postId) => {
  const Key = { username, postId }
  const TableName = REQUESTS_TABLE_NAME
  const params = { TableName, Key }
  return db.getAsync(params)
    .then(({Item}) => Item)
    .catch(error => {
      console.log(`Error getting request from db: ${error.message}`)
      console.log(params)
    })
}

const putRequest = Item => {
  const TableName = REQUESTS_TABLE_NAME
  const params = { TableName, Item }
  return db.putAsync(params)
    .then(_ => Item)
    .catch(error => {
      console.log(`Error putting request from db: ${error.message}`)
      console.log(params)
      throw error
    })
}

const runMediumToYoutubeTask = (request = {}) => {
  const { username, postId, state } = request
  if (state != REQUESTED) {
    console.log(`The request state should be "${REQUESTED}" but found "${state}". No task will be started`)
    return Promise.resolve({})
  }

  const cluster = 'medium-to-youtube-cluster'
  const taskDefinition = 'medium-to-youtube-task'
  const launchType = 'FARGATE'
  const networkConfiguration = {
    awsvpcConfiguration: {
      subnets: [
        'subnet-b3be40f9'
      ],
      assignPublicIp: 'DISABLED'
    }
  }
  const overrides = {
    containerOverrides: [
      {
        name: "medium-to-youtube-container",
        environment: [
          { name: 'username', value: username },
          { name: 'postId', value: postId }
        ]
      }
    ]
  }
  const params = {
    cluster,
    taskDefinition,
    launchType,
    networkConfiguration,
    overrides
  }
  return ecs.runTaskAsync(params)
    .then(({ failures }) => {
      if (failures.length) {
        const failureString = JSON.stringify(failures, null, 2)
        console.log(`There were failures`)
        console.log(failureString)
        throw new Error(`Failed to start the task:\n${failureString}`)
      }
    })
    .catch(error => {
      console.log(`Error running task: ${error.message}`)
      console.log(JSON.stringify(params, null, 2))
      throw error
    })
}

module.exports = {
  getRequest,
  putRequest,
  runMediumToYoutubeTask
}
