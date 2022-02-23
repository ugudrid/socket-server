const { urlencoded, json } = require('express');
const express = require('express');

const db = require('./database');



const app = express();
const http = require('http');


const { Server } = require("socket.io");

const EventListener = require('./socket-server');
/**
 * NOTE 
 * In order to run the websocket server an http server is required to which we can bind the socket server.
 * After binding it enables web-sockets protocol on the provided httpServer
 * Initially an http server is also requred to send the client files where all the logic to connect to socket server must be present for that we're using index.html as our default file.
 */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  });


const PORT = 8000;

let conn;
(async () => {

  conn = await db.INIT();

  app.use(express.static(__dirname + '/views/assets'));
  app.use(urlencoded({ extended: false }))
  app.use(json({ extended: false }))

  app.get('/', (req, res) => {

    /**
     * Sends the HTML to the client where all the client side stuff for generating the event and connecting to server has been handled
     */
    res.sendFile(__dirname + '/views/assets/html/index.html'); 
  });


  /**
   * @NOTE To INSERT ITEM VIA API USE FOLLOWING Endpoint
   */
  app.post('/item/add', async (req, res) => {

    /**
     * NOTE
     * Inserting data with Rest API
     */
    console.log(req.body);
    if (!req.body.hasOwnProperty('item')) return res.status(402).send({ status: 'Bad Request', msg: 'item Missing in payload' });
    let collection = conn.collection('students');

    let payload = {};
    if (req.body.hasOwnProperty('userid')) payload['userid'] = req.body['userid'];
    if (req.body.hasOwnProperty('userID')) payload['userID'] = req.body['userid'];
    if (req.body.hasOwnProperty('group')) payload['group'] = req.body['group'];

    payload.timestamp = Date.now()
    payload.item = req.body.item;

    let result = await collection.insertOne(payload);

    res.status(200).send({ 'status': 'ok', result: result });
  })


  /**
   * @NOTE OUR WEBHOOK WHICH MONGODB ATlas trigger will post data upon the change
   */
  app.post('/item/added/atlas', async (req, res) => {
    // console.log(req.body);

    /**
    * @NOTE Please look the socket emit sheet for the ways we can send the emits
    * https://socket.io/docs/v4/emit-cheatsheet/
    */

    /**
     * @Cases 
     * 1. If item has group name the the item will be sent to group
     * 2. If item has group and userid both then it will only be emitted to userID but not group
     * 3. IF item has userid then it will only be emitted to userid
     * 4. If it has none group name or the userid then it will be broadcasted to all
     */
    EventListener.SendMessage(req.body.userid || req.body.userId, (req.body.group) ? req.body.group.toLowerCase() : undefined, req.body)
    res.status(200).send({ 'status': 'ok' });
  })

  console.log('conencted to Database');
  server.listen(PORT, () => {
    console.log(`listening on localhost:${PORT}`);
    EventListener.BindSocketEvents(io);
  });
})()



module.exports.socket = io

