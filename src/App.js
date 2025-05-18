import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL ;



function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    finished: false,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: '', description: '', dueDate: '', finished: false });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate?.slice(0, 10),
      finished: task.finished,
    });
    setEditingId(task._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  return (
    <div className="container">
    <h2>Task Manager</h2>
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Task Name"
        value={form.name}
        onChange={handleChange}
        type="text"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
      />
      <label className="checkbox">
        <input
          type="checkbox"
          name="finished"
          checked={form.finished}
          onChange={handleChange}
        />
        Finished
      </label>
      <button type="submit">{editingId ? 'Update Task' : 'Add Task'}</button>
    </form>

    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-item">
          <h4>{task.name}</h4>
          <p>{task.description}</p>
          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          <p>Finished: {task.finished ? '✅ Yes' : '❌ No'}</p>
          <div className="task-actions">
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default App;