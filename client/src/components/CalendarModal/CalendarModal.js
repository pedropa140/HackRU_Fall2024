import React, { useState, useEffect, useCallback } from 'react';
import './CalendarModal.css';
import NotificationModal from '../NotificationModal/NotificationModal';

const CalendarModal = ({ isOpen, onClose, date, addTask, email }) => {
  const [title, setTaskInput] = useState('');
  const [start_time, setStartTime] = useState('');
  const [end_time, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); 

  const fetchTasksForDate = useCallback(async () => {
    const formattedDate = date.toISOString().split('T')[0]; 
    try {
      const response = await fetch(`/api/getTasks?email=${email}&date=${formattedDate}`);
      const data = await response.json();
      if (data.status === 'success') {
        setTasks(data.tasks);
      } else {
        console.error('Failed to fetch tasks:', data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [date, email]);

  useEffect(() => {
    if (isOpen) {
      fetchTasksForDate();
    }
  }, [isOpen, fetchTasksForDate]);

  const handleAddTask = () => {
    if (title.trim() && start_time && end_time) {
      const taskData = {
        title,
        start_time,
        end_time,
        description,
      };
      addTask(date, taskData);
      resetFields();
      fetchTasksForDate();
    }
  };

  const resetFields = () => {
    setTaskInput('');
    setStartTime('');
    setEndTime('');
    setDescription('');
  };

  const handleRemoveTask = async (taskIndex) => {
    const formattedDate = date.toISOString().split('T')[0];
    try {
      const response = await fetch(`/api/removeTask?email=${email}&task_date=${formattedDate}&task_index=${taskIndex}`, {
        method: 'DELETE',
      });
  
      const data = await response.json();
      if (data.status === 'success') {
        setNotificationMessage('Task deleted successfully!');
        setIsSuccess(true);
      } else {
        setNotificationMessage('Failed to delete task: ' + data.message);
        setIsSuccess(false);
      }
      setIsNotificationOpen(true);
      fetchTasksForDate();
    } catch (error) {
      console.error('Error removing task:', error);
      setNotificationMessage('Error removing task: ' + error.message);
      setIsSuccess(false);
      setIsNotificationOpen(true);
    }
  };

  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className='modal-content'>
        <h2>Tasks for {date.toDateString()}</h2>
        <button className='close' onClick={onClose}>&times;</button>

        <div className='task-input'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder='Task Name...'
            className='task-input-field'
          />
        </div>
        <div className='time-input'>
          <label>
            Start Time:
            <input
              type='time'
              value={start_time}
              onChange={(e) => setStartTime(e.target.value)}
              className='time-input-field'
            />
          </label>
          <br />
          <label>
            End Time:
            <input
              type='time'
              value={end_time}
              onChange={(e) => setEndTime(e.target.value)}
              className='time-input-field'
            />
          </label>
        </div>
        <div className='description-input'>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description'
            className='description-input-field'
          />
        </div>
        <button onClick={handleAddTask} className='add-task-button'>Add Task</button>

        <div className='task-list'>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div key={index} className='task-item'>
                <strong>{task.title} <button className='delete-button' onClick={() => handleRemoveTask(index)}>Remove</button></strong>
                <br />
                <em>{task.start_time} - {task.end_time}</em>
                <br />
                <span>{task.description}</span>
              </div>
            ))
          ) : (
            <div className='no-tasks'>No tasks for this date.</div>
          )}
        </div>
      </div>

      <NotificationModal
        isOpen={isNotificationOpen}
        message={notificationMessage}
        isSuccess={isSuccess}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default CalendarModal;
