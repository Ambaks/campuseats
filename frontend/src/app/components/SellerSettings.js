import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Drawer } from "@mui/material";
import ProfileSettings from "./SellerProfileSettings";
import OrderSettings from "./OrderSettings";
import PaymentSettings from "./PaymentSettings";
import MenuSettings from "./MenuSettings";
import SecuritySettings from "./SecuritySettings";
import { AccountCircle, ShoppingCart, Payment, Restaurant, Security } from "@mui/icons-material";

const settingsSections = [
  {
    title: "Profile & Account",
    description: "Manage your store's details, contact information, and description.",
    component: <ProfileSettings />,
    icon: AccountCircle,
    color: "#FF7F51",
  },
  {
    title: "Order Preferences",
    description: "Control how orders are accepted, scheduled, and managed.",
    component: <OrderSettings />,
    icon: ShoppingCart,
    color: "#FFA07A",
  },
  {
    title: "Payments & Earnings",
    description: "Set up your payout method and manage tax information.",
    component: <PaymentSettings />,
    icon: Payment,
    color: "#FF8C69",
  },
  {
    title: "Menu & Inventory",
    description: "Configure menu settings, inventory tracking, and pre-orders.",
    component: <MenuSettings />,
    icon: Restaurant,
    color: "#FF9A73",
  },
  {
    title: "Security & Privacy",
    description: "Change your password, enable two-factor authentication, and manage account security.",
    component: <SecuritySettings />,
    icon: Security,
    color: "#FFB088",
  },
];

const SettingsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleOpen = (component) => {
    setSelectedComponent(component);
    setOpen(true);
  };

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
        <Security sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5 }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.95 }}>
          Configure your seller preferences
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {settingsSections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  background: "white",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(255, 127, 81, 0.2)",
                    borderColor: section.color,
                  },
                }}
                onClick={() => handleOpen(section.component)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      backgroundColor: `${section.color}15`,
                      borderRadius: "50%",
                      width: 56,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 28, color: section.color }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: "#333" }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="#666" sx={{ fontSize: "0.9rem" }}>
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Bottom Drawer */}
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 3, maxHeight: "75vh", overflowY: "auto" }}>
          {selectedComponent}
        </Box>
      </Drawer>
    </Box>
  );
};

export default SettingsPage;
