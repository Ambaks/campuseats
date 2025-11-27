const API_BASE_URL = "http://localhost:8000"; // Replace with actual backend URL

export const fetchMeals = async (userLat, userLon) => {
    const response = await fetch(`${API_BASE_URL}/meals/?user_lat=${userLat}&user_lon=${userLon}`);
    if (!response.ok) throw new Error("Failed to fetch meals");
    return await response.json();
};

export const createMeal = async (mealData, token) => {
    const response = await fetch(`${API_BASE_URL}/meals/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(mealData),
    });
    if (!response.ok) throw new Error("Failed to create meal");
    return await response.json();
};

export const deleteMeal = async (mealId, token) => {
    const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to delete meal");
    return await response.json();
};

export const checkUsername = async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-username?username=${username}`);
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error("Error checking username:", error);
      return null; // Return null in case of an error
    }
  };

  // New function to fetch ChefOrders
export const fetchChefOrders = async (user_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${user_id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch chef orders");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching chef orders:", error);
        throw error;
    }
};

export const fetchChefMenu = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/meals/chef/${userId}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch chef menu");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching chef orders:", error);
        throw error;
    }
};

export async function getChefReviewSummary(chefId) {
    const res = await fetch(`${API_BASE_URL}/chef/${chefId}/summary`);
    if (!res.ok) throw new Error("Failed to fetch rating summary");
    return res.json(); // { average_rating, review_count }
  }