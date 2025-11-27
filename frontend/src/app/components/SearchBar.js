"use client";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Corrected import

export default function SearchBar() {
  return (
    <Box sx={{ p: 2 }}>
      {/* SEARCH BAR */}
      <TextField
        className="text-black"
        fullWidth
        variant="outlined"
        placeholder="Search home-cooked meals"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="disabled" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
