const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const history = [];
const client = [];

server.listen(3000, () => {
  console.log("server listining on 3000");
});
// WARNING: app.listen(80) will NOT work here!

app.get("/", (req, res) => {
 // res.sendFile(__dirname + "/index.html");
  res.send('hello world')
});

io.on("connection", (socket) => {
 // console.log("socket connection");

  client.push({ id: socket.client.id });
 // console.log(client);

  var getClientID = client.find((e) => e.id === socket.client.id);
  //console.log("the Client", getClientID);

  socket.on("userOldData", () => {
    if (getClientID) {
      if (history.length >= 500) {
        for (let i = 0; i < 20; i++) {
          history.shift();
        }
      }
      socket.emit("oldMessage", history);
 //     console.log("history", history);
    }
  });

  socket.on("addRoom", (from, room, reqData) => {
  //  console.log("room", room);
    socket.join(room);

    history.push(reqData);
   // console.log(history);

    io.sockets.in(room).emit("message", reqData);
  });




  socket.on('disconnect', (reason) => {
             console.log("server disconnected",reason); 
      });
	
});

