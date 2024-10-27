import React, { useState } from 'react';
import { PlusCircle, Moon, Sun, Pizza, Coffee, Utensils, X } from 'lucide-react';
import './FoodPage.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import Footer from '../Footer/Footer';
import LoadingPage from '../LoadingPage/LoadingPage';
import ErrorPage from '../ErrorPage/ErrorPage';

const FoodPage = ({ toggleDarkMode, isDarkMode }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [newMeal, setNewMeal] = useState({
    type: 'Breakfast',
    calories: '',
    items: ['']
  });
  
  const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;
  const userEmail = sessionStorage.getItem('userEmail');
  const [userInfo, setUserInfo] = useState(null);

  const [meals, setMeals] = useState([
    { id: 1, type: 'Breakfast', calories: 350, items: ['Oatmeal', 'Banana', 'Coffee'] },
    { id: 2, type: 'Lunch', calories: 650, items: ['Chicken Salad', 'Apple', 'Water'] },
  ]);

  const toggleSignInModal = () => {
    setIsSignInModalOpen(!isSignInModalOpen);
  };

  const toggleSignUpModal = () => {
    setIsSignUpModalOpen(!isSignUpModalOpen);
  };

  const toggleAddMealModal = () => {
    setIsAddMealModalOpen(!isAddMealModalOpen);
    if (!isAddMealModalOpen) {
      setNewMeal({
        type: 'Breakfast',
        calories: '',
        items: ['']
      });
    }
  };

  const handleAddItem = () => {
    setNewMeal(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };

  const handleRemoveItem = (index) => {
    setNewMeal(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, value) => {
    setNewMeal(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }));
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = Math.max(...meals.map(meal => meal.id)) + 1;
    const mealToAdd = {
      ...newMeal,
      id: newId,
      calories: parseInt(newMeal.calories) || 0,
      items: newMeal.items.filter(item => item.trim() !== '')
    };
    
    setMeals(prev => [...prev, mealToAdd]);
    toggleAddMealModal();
  };

  const mealIcons = {
    Breakfast: <Coffee size={24} />,
    Lunch: <Pizza size={24} />,
    Dinner: <Utensils size={24} />
  };

  if (loading) {
    return <LoadingPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
  }

  if (error) {
    return <ErrorPage message={error} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />;
  }

  // Calculate total calories
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const dailyGoal = 2000;
  const percentageOfGoal = (totalCalories / dailyGoal) * 100;

  return (
    <section id="FoodPage" className={isDarkMode ? 'dark-mode' : ''}>
      {isUserSignedIn ? (
        <NavBarSignedIn
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          toggleSignInModal={toggleSignInModal}
          toggleSignUpModal={toggleSignUpModal}
        />
      ) : (
        <NavBarNotSignedIn
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          toggleSignInModal={toggleSignInModal}
          toggleSignUpModal={toggleSignUpModal}
        />
      )}

      <div className="FoodPage_hero">
        <h1 className="hero_title">Food Tracker</h1>
        <p className="hero_subtitle">Track your meals and maintain a healthy lifestyle</p>
        <button className="add-meal-button" onClick={toggleAddMealModal}>
          <PlusCircle size={20} />
          Add Meal
        </button>
      </div>

      <div className="FoodPage_content">
        <div className="meals-grid">
          {/* Daily Summary Card */}
          <div className="meal-card">
            <h2 className="meal-card-title">Today&apos;s Summary</h2>
            <p className="calories-text">{totalCalories} / {dailyGoal} cal</p>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${Math.min(percentageOfGoal, 100)}%` }}></div>
            </div>
            <p className="meal-items">{percentageOfGoal.toFixed(1)}% of daily goal</p>
          </div>

          {/* Meal Cards */}
          {meals.map(meal => (
            <div key={meal.id} className="meal-card meal-card-with-delete">
              <button 
                className="delete-meal-button"
                onClick={() => handleDeleteMeal(meal.id)}
                aria-label="Delete meal"
              >
                <X size={16} />
              </button>
              <div className="meal-card-title">
                {mealIcons[meal.type]}
                {meal.type}
              </div>
              <p className="calories-text">{meal.calories} calories</p>
              <ul className="meal-items">
                {meal.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Add Meal Card */}
          <div className="meal-card add-meal-card" onClick={toggleAddMealModal}>
            <div style={{ textAlign: 'center' }}>
              <PlusCircle size={48} color={isDarkMode ? '#666' : '#ccc'} />
              <p style={{ marginTop: '8px', color: isDarkMode ? '#666' : '#ccc' }}>
                Add New Meal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {isAddMealModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={toggleAddMealModal}>
              <X size={24} />
            </button>
            <h2>Add New Meal</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Meal Type:</label>
                <select 
                  value={newMeal.type}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Total Calories:</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="Enter calories"
                  required
                />
              </div>

              <div className="form-group">
                <label>Food Items:</label>
                {newMeal.items.map((item, index) => (
                  <div key={index} className="food-item-input">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      placeholder="Enter food item"
                      required
                    />
                    {newMeal.items.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-item"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-item-button" onClick={handleAddItem}>
                  Add Another Item
                </button>
              </div>

              <button type="submit" className="submit-button">Add Meal</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </section>
  );
};

export default FoodPage;