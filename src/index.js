import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const io = require('socket.io-client');
const $ = require('jquery');

$(() => {
  const socket = io.connect('http://localhost:3735');

  const message = $('#message');
  const username = $('#username');
  const sendMessage = $('#send_message');
  const sendUsername = $('#send_username');
  const chatroom = $('#chatroom');
  const feedback = $('#feedback');

  let alertClass;
  const minUser = 1;
  const maxUser = 6;
  const random = Math.floor(Math.random() * (maxUser - minUser)) + minUser;
  switch (random) {
    case 1:
      alertClass = 'secondary';
      break;
    case 2:
      alertClass = 'danger';
      break;
    case 3:
      alertClass = 'success';
      break;
    case 4:
      alertClass = 'warning';
      break;
    case 5:
      alertClass = 'info';
      break;
    case 6:
      alertClass = 'light';
      break;
    default:
      break;
  }

  sendMessage.on('click', () => {
    socket.emit('new_message', {
      message: message.val(),
      className: alertClass
    });
  });

  socket.on('add_mess', (data) => {
    feedback.html('');
    message.val('');
    chatroom.append(
      `<div class='alert alert-${data.className}'<b>${data.username}</b>: ${data.message}</div>`
    );
  });

  sendUsername.on('click', () => {
    socket.emit('change_username', { username: username.val() });
  });

  message.on('keypress', () => {
    socket.emit('typing');
  });

  socket.on('typing', (data) => {
    feedback.html(
      `<p><i>${data.username} печатает сообщение...</i></p>`
    );
  });
});
