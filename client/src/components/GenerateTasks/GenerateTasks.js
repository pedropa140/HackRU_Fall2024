import React, { useState } from 'react';

const GenerateTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/generate-tasks'); // Change to your Flask URL if needed
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Fetched data:', data); // For debugging

      if (data.success && data.result && data.result.response) {
        const parsedTasks = JSON.parse(data.result.response); // Parse the JSON string
        setTasks(parsedTasks); // Update tasks state with the parsed array
      } else {
        throw new Error('Unexpected data format');
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err); // Log error for more information
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generate Activities</h1>
      <button onClick={fetchTasks}>Generate Tasks</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {tasks.length > 0 && (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task.name} - {task.datetime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GenerateTasks;
