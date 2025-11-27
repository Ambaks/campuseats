import { Box, Typography, IconButton } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function AddressSelector({ address, onOpenDrawer }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant="body1" color="black" sx={{ fontWeight: "bold" }}>
        {address}
      </Typography>
      <IconButton onClick={onOpenDrawer} size="small">
        <ArrowDropDownIcon />
      </IconButton>
    </Box>
  );
}