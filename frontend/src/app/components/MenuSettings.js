import React from "react";
import { Box, FormControlLabel, Switch, TextField, Button } from "@mui/material";

const MenuSettings = () => {
  return (
    <Box>
      <FormControlLabel control={<Switch />} label="Enable Pre-Orders" />
      <TextField fullWidth label="Default Preparation Time (Minutes)" margin="normal" type="number" />
      <FormControlLabel control={<Switch />} label="Automatically Mark Items as Sold Out" />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Save Menu Settings
      </Button>
    </Box>
  );
};

export default MenuSettings;
