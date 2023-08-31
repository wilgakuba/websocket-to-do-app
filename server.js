const express = require('express');
const socket = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors())

let tasks = []


app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('we got new socket!' + socket.id);

  io.to(socket.id).emit('updateData', tasks);
  console.log(tasks)

  socket.on('newTask', (task) => {
    const newTask = { id: socket.id, name: task.name}
    tasks.push(newTask)
    console.log('New task added:', newTask);
    io.emit('updateData', tasks);
  })

  socket.on('removeTask', (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    console.log('Task removed:', taskId);
    io.emit('updateData', tasks);
  });
  
})