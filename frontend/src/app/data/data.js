import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AttachMoney from "@mui/icons-material/AttachMoney";

/* DUMMY DATA */

export const categories = [
  { label: "Burgers", icon: <FastfoodIcon fontSize="large" color="primary" /> },
  { label: "Pizza", icon: <LocalPizzaIcon fontSize="large" color="primary" /> },
  { label: "Mexican", icon: <RestaurantIcon fontSize="large" color="primary" /> },
  { label: "Chicken", icon: <RamenDiningIcon fontSize="large" color="primary" /> },
  { label: "Grocery", icon: <LocalGroceryStoreIcon fontSize="large" color="primary" /> },
];

// Promo cards now use MUI icons instead of custom images
export const promoCards = [
  {
    id: 1,
    title: "Get your first two months of DashPass",
    icon: <CardGiftcardIcon fontSize="large" color="secondary" />,
  },
  {
    id: 2,
    title: "Under $2 delivery fee",
    icon: <AttachMoney fontSize="large" color="secondary" />,
  },
  {
    id: 3,
    title: "Save 50% on your membership",
    icon: <LocalOfferIcon fontSize="large" color="secondary" />,
  },
];