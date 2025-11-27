import { Typography, Divider, Box, Card, CardContent, Button, Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { useOrder } from '../context/OrderContext';

const OrderHistory = () => {
  const { orders, fetchOrders } = useOrder();

  useEffect(() => {
    fetchOrders(); // Fetch orders when the component mounts
  }, []);

  return (
    <Box sx={{ p: 4, borderRadius: 2 }}>
      <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", my: 3 }} />

      <Typography variant="h3" align="center" gutterBottom>
        ORDER HISTORY
      </Typography>

      <Divider sx={{ width: "90%", height: 2, bgcolor: "black", mx: "auto", my: 3 }} />

      <Grid container spacing={3} justifyContent="center">
      {orders.length > 0 ? (
        orders
            .filter(order => order.status !== "Pending") // Filter out pending orders
            .map(order => (
            <Grid item key={order.id} xs={12} sm={6} md={4}>
                <Card sx={{ backgroundColor: 'rgba(255, 140, 0, 0.7)', color: 'black', p: 2 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold">{order.buyer_name}</Typography>

                    <Typography variant="subtitle1" fontWeight="bold">Details:</Typography>
                    {order.meals.map((meal, index) => (
                    <Typography key={index} variant="body2">
                        {meal.name} - {meal.quantity}
                    </Typography>
                    ))}

                    <Typography variant="subtitle1" fontWeight="bold">Revenue:</Typography>
                    <Typography variant="body2">
                    ${order.meals.reduce((total, meal) => total + meal.price * meal.quantity, 0).toFixed(2)}
                    </Typography>

                    <Typography variant="subtitle1" fontWeight="bold">Status:</Typography>
                    <Typography variant="body2" color="primary">
                    {order.status}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="contained" color="success" size="small">
                        Accept
                    </Button>
                    <Button variant="contained" color="error" size="small">
                        Decline
                    </Button>
                    </Box>
                </CardContent>
                </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 10, backgroundColor: 'rgba(255, 165, 0, 0.1)', color: 'black', p: 2, textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h6">No orders yet...</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default OrderHistory;
