import React, { useState, useEffect } from 'react';
import { PlusCircle, Moon, Sun, Pizza, Coffee, Utensils, X, Sparkles } from 'lucide-react';
import './FoodPage.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import Footer from '../Footer/Footer';
import LoadingPage from '../LoadingPage/LoadingPage';
import ErrorPage from '../ErrorPage/ErrorPage';

// Storage utility functions
const getStorageKey = (userEmail) => `foodTracker_${userEmail || 'anonymous'}`;

const setCookie = (name, value, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
};

const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
  if (cookie) {
    try {
      return JSON.parse(cookie.split('=')[1]);
    } catch {
      return null;
    }
  }
  return null;
};

const FoodPage = ({ toggleDarkMode, isDarkMode }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  const [newMeal, setNewMeal] = useState({
    type: 'Breakfast',
    calories: '',
    items: ['']
  });
  
  const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;
  const userEmail = sessionStorage.getItem('userEmail');
  const [userInfo, setUserInfo] = useState(null);

  // Initialize meals from storage
  const [meals, setMeals] = useState(() => {
    const storageKey = getStorageKey(userEmail);
    const storedMeals = localStorage.getItem(storageKey);
    const cookieMeals = getCookie(storageKey);
    
    return storedMeals ? JSON.parse(storedMeals) : 
           cookieMeals ? cookieMeals :
           [
             { id: 1, type: 'Breakfast', calories: 350, items: ['Oatmeal', 'Banana', 'Coffee'] },
             { id: 2, type: 'Lunch', calories: 650, items: ['Chicken Salad', 'Apple', 'Water'] },
           ];
  });

  const dailyGoal = 2000;
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const percentageOfGoal = (totalCalories / dailyGoal) * 100;

  // Sync meals with storage whenever they change
  useEffect(() => {
    const storageKey = getStorageKey(userEmail);
    localStorage.setItem(storageKey, JSON.stringify(meals));
    setCookie(storageKey, meals);
  }, [meals, userEmail]);

  // Load user's meals when they sign in
  useEffect(() => {
    if (userEmail) {
      const storageKey = getStorageKey(userEmail);
      const storedMeals = localStorage.getItem(storageKey);
      const cookieMeals = getCookie(storageKey);
      
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      } else if (cookieMeals) {
        setMeals(cookieMeals);
      }
    }
  }, [userEmail]);

  // Get recommendations whenever meals change
  useEffect(() => {
    if (meals.length > 0) {
      getRecommendations();
    }
  }, [meals]);

  const getRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const mealItems = meals.flatMap(meal => meal.items);
      const response = await fetch('/api/getrecommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          meals: mealItems,
          totalCalories,
          dailyGoal,
          userEmail 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const clearUserData = () => {
    const storageKey = getStorageKey(userEmail);
    localStorage.removeItem(storageKey);
    document.cookie = `${storageKey}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    setMeals([]);
  };

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
    setMeals(prevMeals => {
      const updatedMeals = prevMeals.filter(meal => meal.id !== mealId);
      const storageKey = getStorageKey(userEmail);
      localStorage.setItem(storageKey, JSON.stringify(updatedMeals));
      setCookie(storageKey, updatedMeals);
      return updatedMeals;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = Math.max(...meals.map(meal => meal.id), 0) + 1;
    const mealToAdd = {
      ...newMeal,
      id: newId,
      calories: parseInt(newMeal.calories) || 0,
      items: newMeal.items.filter(item => item.trim() !== '')
    };
    
    setMeals(prev => {
      const updatedMeals = [...prev, mealToAdd];
      const storageKey = getStorageKey(userEmail);
      localStorage.setItem(storageKey, JSON.stringify(updatedMeals));
      setCookie(storageKey, updatedMeals);
      return updatedMeals;
    });
    
    toggleAddMealModal();
  };

  const handleAddRecommendation = (recommendation) => {
    const newId = Math.max(...meals.map(meal => meal.id), 0) + 1;
    const newMeal = {
      id: newId,
      type: recommendation.suggestedMealType,
      calories: recommendation.calories,
      items: [recommendation.name]
    };
    
    setMeals(prev => {
      const updatedMeals = [...prev, newMeal];
      const storageKey = getStorageKey(userEmail);
      localStorage.setItem(storageKey, JSON.stringify(updatedMeals));
      setCookie(storageKey, updatedMeals);
      return updatedMeals;
    });
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

  // ... Rest of your component render logic remains the same ...
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
        <div className="page-layout">
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

          {/* Recommendations Section */}
          <div className="recommendations-section">
            <div className="recommendations-header">
              <h2>
                <Sparkles className="inline-icon" size={20} />
                Recommended for You
              </h2>
              {isLoadingRecommendations && (
                <div className="spinner"></div>
              )}
            </div>
            
            <div className="recommendations-content">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-card">
                  <h3>{recommendation.name}</h3>
                  <p className="calories-info">{recommendation.calories} calories</p>
                  <p className="nutrition-info">{recommendation.nutritionInfo}</p>
                  <button 
                    className="add-recommended-button"
                    onClick={() => handleAddRecommendation(recommendation)}
                  >
                    <PlusCircle size={16} />
                    Add to Meals
                  </button>
                </div>
              ))}
              {!isLoadingRecommendations && recommendations.length === 0 && (
                <p className="no-recommendations">
                  Add some meals to get personalized recommendations!
                </p>
              )}
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

// Add event listener for storage changes across tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;
    const userEmail = sessionStorage.getItem('userEmail');
    const storageKey = getStorageKey(userEmail);
    
    if (e.key === storageKey) {
      try {
        const newMeals = JSON.parse(e.newValue);
        if (newMeals && Array.isArray(newMeals)) {
          setMeals(newMeals);
        }
      } catch (error) {
        console.error('Error syncing meals across tabs:', error);
      }
    }
  });
}

export default FoodPage;