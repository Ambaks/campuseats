import { Box, Drawer, Typography, TextField, Button } from "@mui/material";

export default function AddressDrawer({ open, onClose, currentAddress }) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 2, height: "100vh", overflow: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Update Your Address
        </Typography>
        <TextField label="Street Address" fullWidth sx={{ mb: 2 }} defaultValue={currentAddress} />
        <Button variant="contained" color="primary" onClick={onClose}>
          Save
        </Button>
      </Box>
    </Drawer>
  );
}
