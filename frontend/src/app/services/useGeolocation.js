import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation({ lat: 0, lon: 0 }); // Default to 0,0 to avoid undefined errors
        }
      );
    }
  }, []);

  return location;
};

export default useGeolocation;
