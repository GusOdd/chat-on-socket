const express = require('express');

const app = express();
const port = 3735;

app.set('view engine', 'ejs');
app.use(express.static('dist'));
app.get('/', (req, res) => {
  res.render('dist/index');
});
const server = app.listen(port, () => console.log('Server is running...'));

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New user connected');
  socket.username = 'Anonymous';
  socket.on('change_username', (data) => {
    socket.username = data.username;
  });

  socket.on('new_message', (data) => {
    io.sockets.emit('add_mess', { message: data.message, username: socket.username, className: data.className });
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username });
  });
});
