const { helperValidateJWT } = require("../helpers/generate-jwt");
const ChatMessage = require("./ChatMessage");

const chatMessage = new ChatMessage();

const socketController = async (socket, io) => {

  const user = await helperValidateJWT(socket.handshake.headers.authorization);

  if (!user) {
    return socket.disconnect();
  }

  chatMessage.connectUser(user);

  io.emit('user-actives', chatMessage.getUsers);
  io.emit('chat-list', chatMessage.getLastTen);

  socket.join(user.id);

  socket.on('disconnect', () => {
    chatMessage.desconnetUser(user.id);
    io.emit('user-actives', chatMessage.getUsers);
  });

  socket.on('send-message', ({ uid, message }) => {
    if (uid) {
      socket.to(uid).emit('send-message-private', {
        from: user.name,
        message
      });
    } else {
      chatMessage.sendMessage(user._id, user.name, message);
      io.emit('chat-list', chatMessage.getLastTen);
    }
  });


}

module.exports = {
  socketController
}
