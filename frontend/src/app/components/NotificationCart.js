import { Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartIcon from "./CartIcon";

export default function NotificationCart() {
  return (
    <div className="mr-3 mt-2">
      <Box>
        <CartIcon size="small" sx={{ color: "black" }}>
          <ShoppingCartIcon />
        </CartIcon>
      </Box>
    </div>
  );
}
