"use client";
import { useState, useEffect } from "react";
import { Typography, Container, Grid, Card, CardContent, Drawer, Box, Paper, Chip } from "@mui/material";
import { TrendingUp, Assessment, Receipt, History, Restaurant, Settings as SettingsIcon } from "@mui/icons-material";
import Menu from "../components/Menu";
import OrdersTab from "../components/OrdersTab";
import OrderHistory from "../components/OrderHistory";
import SellerSettings from "../components/SellerSettings";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchChefOrders, fetchChefMenu } from "../services/api";


const dashboardOptions = [
  {
    title: "Orders",
    description: "View and manage incoming orders.",
    icon: Receipt,
    color: "#FF7F51"
  },
  {
    title: "Order History",
    description: "Review past transactions and completed orders.",
    icon: History,
    color: "#FFA07A"
  },
  {
    title: "Menu",
    description: "Manage your meal listings and update availability.",
    icon: Restaurant,
    color: "#FF8C69"
  },
  {
    title: "Settings",
    description: "Adjust your preferences and account settings.",
    icon: SettingsIcon,
    color: "#FF9A73"
  },
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E5F9F7 0%, #ffffff 50%, #fff5f0 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Header with gradient */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            mb: 3,
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #FF7F51 0%, #ff9a73 100%)",
              color: "white",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
              Welcome back, {user ? user.first_name : "Guest"}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, fontSize: "1.1rem" }}>
              Manage your culinary business from one dashboard
            </Typography>
          </Box>

          {/* Analytics Card */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Assessment sx={{ fontSize: 28, color: "#FF7F51", mr: 1 }} />
              <Typography variant="h5" fontWeight="600" color="#333">
                Performance Analytics
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #FF7F51 0%, #ff9a73 100%)",
                    borderRadius: "12px",
                    p: 3,
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255, 127, 81, 0.3)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(255, 127, 81, 0.4)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <TrendingUp sx={{ fontSize: 32, mr: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Sales
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="700">
                    ${totalSales.toFixed(2)}
                  </Typography>
                  <Chip
                    label="All Time"
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #FFA07A 0%, #ffb599 100%)",
                    borderRadius: "12px",
                    p: 3,
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255, 160, 122, 0.3)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(255, 160, 122, 0.4)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Receipt sx={{ fontSize: 32, mr: 1 }} />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Orders
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="700">
                    {totalOrders}
                  </Typography>
                  <Chip
                    label="Completed"
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Dashboard Options Grid */}
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ mb: 3, color: "#333", textAlign: "center" }}
        >
          Quick Actions
        </Typography>

        <Grid container spacing={3} sx={{ mb: 10 }}>
          {dashboardOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Grid item xs={6} sm={6} md={3} key={option.title}>
                <Card
                  sx={{
                    background: "white",
                    borderRadius: "12px",
                    height: "100%",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    border: "2px solid transparent",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(255, 127, 81, 0.2)",
                      borderColor: option.color,
                    },
                  }}
                  onClick={() => setOpenDrawer(option.title)}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box
                      sx={{
                        backgroundColor: `${option.color}15`,
                        borderRadius: "50%",
                        width: 64,
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 32, color: option.color }} />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{ mb: 1, color: "#333" }}
                    >
                      {option.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", fontSize: "0.85rem" }}>
                      {option.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
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
    </Box>
  );
}