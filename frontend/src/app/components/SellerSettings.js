import React, { useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Drawer } from "@mui/material";
import ProfileSettings from "./SellerProfileSettings";
import OrderSettings from "./OrderSettings";
import PaymentSettings from "./PaymentSettings";
import MenuSettings from "./MenuSettings";
import SecuritySettings from "./SecuritySettings";

const settingsSections = [
  {
    title: "Profile & Account",
    description: "Manage your store's details, contact information, and description.",
    component: <ProfileSettings />,
  },
  {
    title: "Order Preferences",
    description: "Control how orders are accepted, scheduled, and managed.",
    component: <OrderSettings />,
  },
  {
    title: "Payments & Earnings",
    description: "Set up your payout method and manage tax information.",
    component: <PaymentSettings />,
  },
  {
    title: "Menu & Inventory",
    description: "Configure menu settings, inventory tracking, and pre-orders.",
    component: <MenuSettings />,
  },
  {
    title: "Security & Privacy",
    description: "Change your password, enable two-factor authentication, and manage account security.",
    component: <SecuritySettings />,
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Seller Settings
      </Typography>
      <Grid container spacing={2}>
        {settingsSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ cursor: "pointer", p: 2 }} onClick={() => handleOpen(section.component)}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {section.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {section.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
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
