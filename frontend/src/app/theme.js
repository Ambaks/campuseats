import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins"; // Ensure the font is still imported

const theme = createTheme({
  palette: {
    primary: { main: "#00A19D" },
    secondary: { main: "#FF7F51" },
    background: { default: "#E5F9F7" },
    text: { primary: "#333333" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h5: { fontWeight: 700 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
});

export default theme;
