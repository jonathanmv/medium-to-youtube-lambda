const handlers = require('./handlers')

const handler = async (event, context) => {
  try {
    const handler = handlers[event.path]
    await handler(event, context)
  } catch (error) {
    console.log(`Couldn't handle request`);
    console.log(event);
    context.succeed({
      state: "ERROR",
      stateDescription: error.message
    })
  }
}

exports.handler = handler
