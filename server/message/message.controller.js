const Message = require('./message.model');

exports.saveMessageToDB = (msg) => {
  const message = new Message({
    message: msg.msg,
    to: msg.to,
    from: msg.from,
  })
  message.save((err, message) => {
    if(err) {
      console.log('message save err: ', err)
    }
    console.log('success massage saved: ', message)
  })
}

exports.clearMsgCollection = () => {
  console.log('clearMsgCollection')
  try{
    Message.deleteMany({})
  } catch(err) {
    console.log('clear collection error: ', err)
  }
}