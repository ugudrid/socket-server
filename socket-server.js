


let io;
/**
 * @NOTE
 * Notice that I initialize a new instance of socket.io by passing the server (the HTTP server) object. 
 * Then I listen on the connection event for incoming sockets and log it to the console.
 */

function BindSocketEvents(socketServer) {
  io = socketServer;

  io.on('connection', (socket) => {
    // console.log('a user connected', socket.handshake.query);
    /**
     * @NOTE 
     * Joining Socket in a Grouped Room and Single Room for Following Reasons.
     * 1. Send the Message in group via broadcasting.
     * 2. Send the Message to a single userID and we will just braodcast the message to the room named with their userID and they will get the message respectively 
     */


    socket.join(socket.handshake.query.group.toLowerCase());

    socket.join(socket.handshake.query.userid);

    socket.on('disconnect', (reason) => {
      // console.log(reason);

      /**
       * @NOTE
       * Upon Disconnection leaving the room because at point if there is no member in room socket.io deletes the room itself. 
       */
      socket.leave(socket.handshake.query.group.toLowerCase());
      socket.leave(socket.handshake.query.userid);
    });


    // io.emit('item_added', { item: 'tea' });

  });
}

function SendMessage(userid, group, data) {
  /**
   * @Cases 
   * 1. If item has group name the the item will be sent to group
   * 2. If item has group and userid both then it will only be emitted to userID but not group
   * 3. IF item has userid then it will only be emitted to userid
   * 4. If it has none group name or the userid then it will be broadcasted to all
   */

  console.log('Group : ', group);
  console.log('Data', data);

  if (!userid && !group) return io.emit('item_added', data);
  if (userid && group) return io.to(userid).emit('item_added', data);
  else return io.to(userid || group).emit('item_added', data);
}

module.exports = {
  BindSocketEvents: BindSocketEvents,
  SendMessage: SendMessage
}
