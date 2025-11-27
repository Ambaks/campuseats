const dummyMeals = [
    {
      name: "Spaghetti Carbonara",
      description: "Classic Italian pasta with creamy egg sauce, pancetta, and Parmesan cheese.",
      price: "12.99",
      category: "Dinner",
      image_url: "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/0346a29a89ef229b1a0ff9697184f944/Derivates/cb5051204f4a4525c8b013c16418ae2904e737b7.jpg",
      ingredients: "Pasta, Eggs, Pancetta, Parmesan, Black Pepper",
      quantity: "5",
      unlimited: false,
      pickup_times: ["5:30 PM", "6:30 PM", "7:00 PM"]
    },
    {
      name: "Avocado Toast",
      description: "Whole grain toast topped with fresh avocado, cherry tomatoes, and a sprinkle of feta cheese.",
      price: "8.50",
      category: "Breakfast",
      image_url: "https://source.unsplash.com/200x200/?avocado-toast",
      ingredients: "Avocado, Bread, Cherry Tomatoes, Feta Cheese",
      quantity: "Unlimited",
      unlimited: true,
      pickup_times: ["8:00 AM", "9:30 AM", "10:00 AM", "11:00 AM"]
    },
    {
      name: "Grilled Chicken Salad",
      description: "Fresh greens, grilled chicken, and a tangy vinaigrette dressing.",
      price: "10.75",
      category: "Lunch",
      image_url: "https://source.unsplash.com/200x200/?salad",
      ingredients: "Chicken, Lettuce, Tomatoes, Cucumbers, Dressing",
      quantity: "7",
      unlimited: false,
      pickup_times: ["12:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"]
    },
    {
      name: "Chocolate Lava Cake",
      description: "Rich chocolate cake with a molten lava center, served with vanilla ice cream.",
      price: "6.99",
      category: "Dessert",
      image_url: "https://source.unsplash.com/200x200/?chocolate-cake",
      ingredients: "Chocolate, Eggs, Butter, Sugar, Flour",
      quantity: "10",
      unlimited: false,
      pickup_times: [
        "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", 
        "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
      ] // A lot of times!
    }
];

export default dummyMeals;
