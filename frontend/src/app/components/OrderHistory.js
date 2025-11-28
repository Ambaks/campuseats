import { Typography, Box, Card, CardContent, Grid, Chip } from '@mui/material';
import React, { useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { History } from '@mui/icons-material';

const OrderHistory = () => {
  const { orders, fetchOrders } = useOrder();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      {/* Header with gradient */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FFA07A 0%, #ffb599 100%)",
          color: "white",
          p: 3,
          borderRadius: "12px",
          textAlign: "center",
          mb: 4,
          boxShadow: "0 4px 12px rgba(255, 160, 122, 0.3)",
        }}
      >
        <History sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
          Order History
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95 }}>
          Review past transactions and completed orders
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
      {orders.length > 0 ? (
        orders
            .filter(order => order.status !== "Pending")
            .map(order => (
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
                      boxShadow: "0 8px 20px rgba(255, 160, 122, 0.2)",
                      borderColor: "#FFA07A",
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
                          backgroundColor: order.status === "completed" ? "#E8F5E9" : "#FFF5F0",
                          color: order.status === "completed" ? "#4CAF50" : "#FFA07A",
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        backgroundColor: "#FFF8F5",
                        borderRadius: "8px",
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="700" color="#FFA07A" sx={{ mb: 1 }}>
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
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="600" color="#666">
                        Total Revenue
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="#FFA07A">
                        ${order.meals.reduce((total, meal) => total + meal.price * meal.quantity, 0).toFixed(2)}
                      </Typography>
                    </Box>
                </CardContent>
                </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #FFF8F5 0%, #FFE8DC 100%)",
                border: "2px dashed #FFA07A",
                borderRadius: "12px",
                p: 4,
                textAlign: "center",
              }}
            >
              <History sx={{ fontSize: 60, color: "#FFA07A", mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="#FFA07A" fontWeight="600">
                No order history
              </Typography>
              <Typography variant="body2" color="#666" sx={{ mt: 1 }}>
                Completed orders will appear here
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default OrderHistory;
