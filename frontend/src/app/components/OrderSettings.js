import React from "react";
import { Box, FormControlLabel, Switch, Button } from "@mui/material";

const OrderSettings = () => {
  return (
    <Box>
      <FormControlLabel control={<Switch />} label="Enable Auto-Accept Orders" />
      <FormControlLabel control={<Switch />} label="Allow Scheduled Orders" />
      <FormControlLabel control={<Switch />} label="Send Order Confirmation Emails" />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Save Preferences
      </Button>
    </Box>
  );
};

export default OrderSettings;
