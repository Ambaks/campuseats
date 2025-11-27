import { useEffect, useState } from "react";
import { fetchMeals } from "../services/api";
import { MealCard } from "./MealCard";

const MealList = ({ userLat, userLon }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Declare state for flipped cards
  const [flippedCards, setFlippedCards] = useState({});

  // Define the flip handler
  const handleFlip = (mealId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const data = await fetchMeals(userLat, userLon);
        setMeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMeals();
  }, [userLat, userLon]);

  if (loading) return <p>Loading meals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {meals.map((meal) => (
        <MealCard 
          key={meal.id} 
          meal={meal} 
          isFlipped={!!flippedCards[meal.id]} 
          onFlip={handleFlip} 
        />
      ))}
    </div>
  );
};

export default MealList;
