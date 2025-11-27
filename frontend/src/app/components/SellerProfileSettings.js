import React from "react";
import { Box, TextField, Button } from "@mui/material";

const ProfileSettings = () => {
  return (
    <Box>
      <TextField fullWidth label="Store Name" margin="normal" />
      <TextField fullWidth label="Contact Email" margin="normal" type="email" />
      <TextField fullWidth label="Store Description" margin="normal" multiline rows={3} />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default ProfileSettings;
