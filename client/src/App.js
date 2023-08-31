import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import shortid from 'shortid'

const App = () => {
  const [socket, setSocket] = useState('')
  const [tasks, setTasks] = useState([])
  const [taskName, setTaskName] = useState('')
  
  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() =>{
    if(socket) {
      socket.on('connect', () => {
        console.log('Wejście TEST')
      })

      socket.on('newTask', (task) => {
        addTask(task);
      });

      socket.on('removeTask', (taskId) => {
        removeTask(taskId);
      });

      socket.on('updateData', (tasksList) => {
        updateTasks(tasksList);
      });
    }
  }, [socket])

  const updateTasks = tasks => {
    setTasks(tasks)
  }

  const removeTask = (taskId, inStorage) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    if (inStorage) {
      socket.emit('removeTask', taskId);
    }
  }

  const submitForm = (event) => {
    event.preventDefault();
    const taskData = {id: shortid(), name: taskName}
    addTask(taskData)
    socket.emit('newTask', taskData)
    resetForm();
  }

  const resetForm = () => {
    setTaskName('')
  }

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  }

  console.log(tasks)

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li className="task" key={task.id}> {task.name} <button className="btn btn--red" onClick={() => removeTask(task.id, true)}>Remove</button></li>
          ))}
        </ul>
  
        <form id="add-task-form" onSubmit={submitForm}>
          <input onChange={e => setTaskName(e.target.value)} value={taskName} className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
};

export default App;