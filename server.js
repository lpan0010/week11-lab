let express = require("express");
let path = require("path");
const { updateImportEqualsDeclaration } = require("typescript");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let poll = require("./poll.js")

let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/vote")));

io.on("connection", socket => {
  console.log("new connection made from client with ID="+socket.id);
  io.emit("polls", poll);

  socket.on("newVote", data => {
    updatePoll(data)
    io.emit("polls", poll);
  });
});

server.listen(port, () => {
  console.log("Listening on port " + port);
});

function updatePoll(newVote){
    let options = poll.options
    
    for (let i=0;i<options.length;i++){
        if (options[i].text === newVote){
            options[i].count += 1
        }
    }

    poll.options = options

}

