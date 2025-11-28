import { Typography, Box, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import React, { useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { Receipt, CheckCircle, Cancel } from '@mui/icons-material';

const OrdersTab = () => {
  const { orders, fetchOrders } = useOrder();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with gradient */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF7F51 0%, #ff9a73 100%)",
          color: "white",
          p: 3,
          borderRadius: "12px",
          textAlign: "center",
          mb: 4,
          boxShadow: "0 4px 12px rgba(255, 127, 81, 0.3)",
        }}
      >
        <Receipt sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
          Incoming Orders
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95 }}>
          Review and manage pending orders
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Grid item key={order.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(255, 127, 81, 0.2)",
                    borderColor: "#FF7F51",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="700" color="#333">
                      {order.buyer_name}
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        backgroundColor: "#FFF5F0",
                        color: "#FF7F51",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#FFF5F0",
                      borderRadius: "8px",
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="700" color="#FF7F51" sx={{ mb: 1 }}>
                      Order Details
                    </Typography>
                    {order.meals.map((meal, index) => (
                      <Typography key={index} variant="body2" color="#666" sx={{ mb: 0.5 }}>
                        • {meal.name} - Qty: {meal.quantity}
                      </Typography>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="600" color="#666">
                      Total Revenue
                    </Typography>
                    <Typography variant="h6" fontWeight="700" color="#FF7F51">
                      ${order.meals.reduce((total, meal) => total + meal.price * meal.quantity, 0).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CheckCircle />}
                      sx={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#45a049",
                        },
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Cancel />}
                      sx={{
                        borderColor: "#ff4d4d",
                        color: "#ff4d4d",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#fff5f5",
                          borderColor: "#cc0000",
                        },
                      }}
                    >
                      Decline
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #FFF5F0 0%, #FFE5DC 100%)",
                border: "2px dashed #FF7F51",
                borderRadius: "12px",
                p: 4,
                textAlign: "center",
              }}
            >
              <Receipt sx={{ fontSize: 60, color: "#FF7F51", mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="#FF7F51" fontWeight="600">
                No pending orders
              </Typography>
              <Typography variant="body2" color="#666" sx={{ mt: 1 }}>
                New orders will appear here
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default OrdersTab;
