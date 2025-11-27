"use client";

import { useRouter, usePathname } from "next/navigation"; 
import { useEffect, useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const [selectedTab, setSelectedTab] = useState(0);

  // Function to determine the selected tab based on the current route
  useEffect(() => {
    const getTabIndex = (path) => {
      if (path.startsWith("/map")) return 1;
      if (path.startsWith("/profile")) return 2;
      if (path.startsWith("/earn")) return 3;
      return 0; // Default to Home
    };

    setSelectedTab(getTabIndex(pathname));
  }, [pathname]); // Runs when the route changes

  const actionSx = {
    color: "black",
    "&.Mui-selected": {
      color: "white",
    },
  };

  return (
    <BottomNavigation
      className="z-999"
      value={selectedTab}
      onChange={(event, newValue) => {
        const paths = ["/", "/map", "/profile", "/earn"];
        router.push(paths[newValue]);
      }}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FF7F51",
        boxShadow: 4,
      }}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} sx={actionSx} />
      <BottomNavigationAction label="Map" icon={<MapIcon />} sx={actionSx} />
      <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} sx={actionSx} />
      <BottomNavigationAction label="Earn" icon={<AttachMoneyIcon />} sx={actionSx} />
    </BottomNavigation>
  );
}
