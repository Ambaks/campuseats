import React from "react";
import { Box, TextField, Button } from "@mui/material";

const PaymentSettings = () => {
  return (
    <Box>
      <TextField fullWidth label="Payout Method" margin="normal" />
      <TextField fullWidth label="Bank Account / PayPal Email" margin="normal" />
      <TextField fullWidth label="Tax Information (Optional)" margin="normal" multiline rows={2} />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Update Payment Details
      </Button>
    </Box>
  );
};

export default PaymentSettings;
