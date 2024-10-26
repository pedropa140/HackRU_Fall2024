import React, { useEffect, useState } from 'react';
import '../../App.css';
import './CalendarPage.css';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import Footer from '../Footer/Footer';
import CalendarModal from '../CalendarModal/CalendarModal';
import NotificationModal from '../NotificationModal/NotificationModal';

const CalendarPage = ({ toggleDarkMode, isDarkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    document.title = 'Calendar';
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const showNotification = (message, success) => {
    setNotificationMessage(message);
    setIsSuccess(success);
    setIsNotificationOpen(true);
  };

  const addTask = (date, task) => {
    const formattedDate = date.toISOString().split('T')[0];
    const email = sessionStorage.getItem('userEmail');

    const taskData = {
      email: email,
      task: {
        title: task.title,
        date: formattedDate,
        start_time: task.start_time,
        end_time: task.end_time,
        description: task.description
      }
    };

    console.log(taskData)

    fetch('/api/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to add task');
        }
      })
      .then((data) => {
        console.log('Task added:', data);

        setTasks((prevTasks) => ({
          ...prevTasks,
          [formattedDate]: [...(prevTasks[formattedDate] || []), task],
        }));
        showNotification('Task added successfully!', true);
      })
      .catch((error) => {
        showNotification('Error adding task: ' + error.message, false);
      })
      .finally(() => {
        closeModal();
      });
  };


  const removeTask = (date, taskIndex) => {
    const formattedDate = date.toDateString();

    setTasks((prevTasks) => {
      const tasksForDate = prevTasks[formattedDate] || [];

      if (tasksForDate.length === 0) return prevTasks;

      const updatedTasksForDate = tasksForDate.filter((_, index) => index !== taskIndex);

      return {
        ...prevTasks,
        [formattedDate]: updatedTasksForDate,
      };
    });

    showNotification('Task removed successfully!', true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <section id='CalendarPage' className={isDarkMode ? 'dark-mode' : ''}>
      <NavBarSignedIn toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className='CalendarPage_hero'>
        <h1 className='hero_title'>Your Calendar</h1>
        <p className='hero_subtitle'>Keep track of your events and schedules effortlessly.</p>
      </div>
      <div className='CalendarPage_content'>
        <CustomCalendar onSelectDate={(date) => { setCurrentDate(date); toggleModal(); }} />
      </div>
      <CalendarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        date={currentDate}
        addTask={addTask}
        removeTask={removeTask}
        tasks={tasks[currentDate.toDateString()] || []}
        email={sessionStorage.getItem('userEmail')} 
      />
      <NotificationModal
        isOpen={isNotificationOpen}
        message={notificationMessage}
        isSuccess={isSuccess}
        onClose={closeNotification}
        isDarkMode={isDarkMode}
      />
      <Footer />
    </section>
  );
};

const CustomCalendar = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthDetails = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    return { firstDayOfMonth, numberOfDays };
  };

  const { firstDayOfMonth, numberOfDays } = getMonthDetails(currentDate);
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isCurrentDay = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className='calendar-dayempty'></div>);
  }
  for (let day = 1; day <= numberOfDays; day++) {
    const isToday = isCurrentDay(day);
    calendarDays.push(
      <div
        key={day}
        className={`calendar-day ${isToday ? 'current-day' : ''}`}
        onClick={() => onSelectDate(new Date(currentYear, currentDate.getMonth(), day))}
      >
        {day < 10 ? `0${day}` : day}
      </div>
    );
  }

  return (
    <div className='calendar-container'>
      <div className='calendar-header'>
        <button onClick={goToPreviousMonth}>&lt;</button>
        <span style={{ fontWeight: 'bolder', fontSize: '50px' }}>{`${currentMonthName} ${currentYear}`}</span>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>
      <div className='calendar-grid'>
        {daysOfWeek.map((day, index) => (
          <div key={index} className='calendar-day-header'>{day}</div>
        ))}
        {calendarDays}
      </div>
    </div>
  );
};

export default CalendarPage;
