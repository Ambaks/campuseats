import React from "react";
import { Box, TextField, Button } from "@mui/material";

const SecuritySettings = () => {
  return (
    <Box>
      <TextField fullWidth label="Change Password" type="password" margin="normal" />
      <TextField fullWidth label="Two-Factor Authentication (Phone Number)" margin="normal" type="tel" />
      <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
        Deactivate Account
      </Button>
    </Box>
  );
};

export default SecuritySettings;
