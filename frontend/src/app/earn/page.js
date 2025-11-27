"use client";
import { useState, useEffect } from "react";
import { Divider, Typography, Container, Grid, Card, CardContent, Drawer, Box } from "@mui/material";
import Menu from "../components/Menu";
import OrdersTab from "../components/OrdersTab";
import OrderHistory from "../components/OrderHistory";
import SellerSettings from "../components/SellerSettings";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchChefOrders, fetchChefMenu } from "../services/api";


const dashboardOptions = [
  { title: "Orders", description: "View and manage incoming orders." },
  { title: "Order History", description: "Review past transactions and completed orders." },
  { title: "Menu", description: "Manage your meal listings and update availability." },
  { title: "Settings", description: "Adjust your preferences and account settings." },
];

export default function SellerDashboard() {
    const {user} = useAuth();
    const {orders} = useOrder();
    const [openDrawer, setOpenDrawer] = useState(null);
    const [chefMeals, setChefMeals] = useState([]);
    const router = useRouter();

    

    useEffect(() => {
        if (!user?.id) {
            router.replace("/profile"); // Uses replace to prevent back navigation
        }
    }, [user, router]);

    // Fetch the chef's meals (or orders) when the user is available.
  useEffect(() => {
    async function loadChefMeals() {
      try {
        console.log("Fetching chef orders/meals for user ID:", user.id);
        // Fetch the chef's meals (or orders) using the user ID
        const data = await fetchChefMenu(user.id);
        setChefMeals(data);
      } catch (error) {
        console.error("Error fetching chef orders/meals:", error);
      }
    }
    if (user?.id) {
      loadChefMeals();
    }
  }, [user]);

  // Dummy statistics (replace with real data from API)
  const pendingEarnings = 300.50;

  // Filter completed orders
  const completedOrders = Array.isArray(orders)
  ? orders.filter(order => order.status === "completed")
  : [];
  // Calculate total sales and total orders dynamically
  const totalSales = completedOrders.reduce((sum, order) => sum + (order.meal.total_price * order.meal.quantity), 0);
  const totalOrders = completedOrders.length;

  return (
    <Container maxWidth="sm" >

      <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", my: 2 }} />
      <Typography variant="h4" align="center" sx={{ mb: 2 }} fontWeight="bold">
          Hi, {user ? user.first_name : "Guest"}
      </Typography>
      <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", my: 2 }} />

      {/* Performance Overview Card */}
      <Card sx={{ backgroundColor: "#008080", color: "white", p: 1, mb: 2, mt: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Analytics</Typography>
          <Box sx={{backgroundColor: "white", borderRadius: 2, padding: 1, width: "20vh", boxShadow: 3, borderColor: "grey"}}>
            <Typography color="black" variant="body1">Total Sales ${totalSales.toFixed(2)}</Typography>
          </Box>
          <Box sx={{backgroundColor: "white", borderRadius: 2, mt: 2, padding: 1, width: "20vh", boxShadow: 3, borderColor: "grey"}}>
            <Typography color="black" variant="body1">Total Orders: {totalOrders}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body1" gutterBottom>
        Manage your meal listings, track orders, and customize your settings.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1, mb: 8 }}>
        {dashboardOptions.map((option) => (
          <Grid item xs={6} sm={4} md={3} key={option.title}>
            <Card
              sx={{ backgroundColor: "#008080", color: "white", height: "100%", cursor: "pointer" }}
              onClick={() => setOpenDrawer(option.title)}
            >
              <CardContent>
                <Typography variant="h6">{option.title}</Typography>
                <Typography variant="body2">{option.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Drawer anchor="bottom" open={openDrawer !== null} onClose={() => setOpenDrawer(null)}>
        <Box sx={{ height: "100vh", backgroundColor: "white", position: "relative" }}>
          <Box sx={{ width: "100%", textAlign: "center", p: 1, cursor: "pointer" }} onClick={() => setOpenDrawer(null)}>
            <Box sx={{ width: 40, height: 5, backgroundColor: "gray", borderRadius: 2, mx: "auto" }}></Box>
          </Box>
          {openDrawer === "Menu" && <Menu meals={chefMeals} setMeals={setChefMeals} user={user} />}
          {openDrawer === "Orders" && <OrdersTab />}
          {openDrawer === "Order History" && <OrderHistory />}
          {openDrawer === "Settings" && <SellerSettings />}
        </Box>
      </Drawer>
    </Container>
  );
}
