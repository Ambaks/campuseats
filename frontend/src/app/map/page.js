"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { fetchMeals } from "../services/api";
import { CiLocationArrow1 } from "react-icons/ci";
import MealDetailsModal from "../components/MealDetailsModal"; // Adjust path if needed
import theme from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import '../globals.css';


mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1iaXRzIiwiYSI6ImNtOGtncnBkajA2dTYybXEwd3Rtam50NjAifQ.rkvAM2GeDlEVRc7UuHyjIQ";

const MapboxMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Ref to keep track of the user location marker
  const userMarker = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283],
      zoom: 5,
      pitch: 60,
      bearing: 0,
      antialias: true,
    });

    mapInstance.on("load", () => {
      mapInstance.setLayoutProperty("road-label", "visibility", "none"); // Hide road labels initially
      mapInstance.on("zoom", () => {
        const zoomLevel = mapInstance.getZoom();
        if (zoomLevel > 17) {
          mapInstance.setLayoutProperty("road-label", "visibility", "visible");
        } else {
          mapInstance.setLayoutProperty("road-label", "visibility", "none");
        }
      });

      // Remove points of interest and landmarks
      const layersToRemove = [
        "poi-label",
        "transit-label",
        "airport-label",
        "waterway-label",
        "natural-point-label",
        "natural-line-label",
        "water-line-label",
        "water-label",
        "road-number-shield",
        "road-label",
        "motorway-shield",
        "motorway-number",
        "state-label",
      ];
      layersToRemove.forEach((layer) => {
        if (mapInstance.getLayer(layer)) {
          mapInstance.setLayoutProperty(layer, "visibility", "none");
        }
      });
      mapInstance.addSource("osm-buildings", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8",
      });
      mapInstance.addLayer({
        id: "3d-buildings",
        source: "osm-buildings",
        "source-layer": "building",
        type: "fill-extrusion",
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.6,
        },
      });
      setMap(mapInstance);
    });

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (!map) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });
      setTimeout(() => {
        map.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          speed: 1.5,
          curve: 1.2,
          easing: (t) => t,
          essential: true
        });
      }, 3000);

      // Remove old user marker if it exists
      if (userMarker.current) {
        userMarker.current.remove();
      }

      // Create a div with the animated user location marker class (CSS handled externally)
      const el = document.createElement("div");
      el.className = "user-location-marker";
      el.title = "You are here";

      // Add the marker to the map and store reference
      userMarker.current = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map);

      // Fetch meals and add meal pins
      const mealData = await fetchMeals(latitude, longitude);
      setMeals(mealData);
      updateMealPins(mealData);
    });
  }, [map]);

  const getDistanceColor = (distance) => {
    if (distance <= 500) return "#4CAF50"; // green - close
    if (distance <= 1000) return "#FFD700"; // yellow - medium
    return "#FF6A1D"; // orange - far
  };

  const updateMealPins = (mealData) => {
    if (!map) return;

    mealData.forEach((meal) => {
      const { latitude, longitude, image_url, distance } = meal;

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = `url(${image_url})`;
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundSize = "cover";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = `3px solid ${getDistanceColor(distance)}`;
      el.style.boxShadow = `0 0 8px ${getDistanceColor(distance)}`;

      el.addEventListener("click", () => setSelectedMeal(meal));


      new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map);
    });
  };

  const goToUserLocation = () => {
    if (userLocation && map) {
      map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 16,
        speed: 1.5,
        curve: 1.2,
        easing: (t) => t,
        essential: true
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ position: "relative" }}>
        <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />

        <button
          onClick={goToUserLocation}
          style={{
            position: "absolute",
            top: "15px",              // Move to top instead of bottom
            right: "15px",            // Keep it aligned to the right
            backgroundColor: "#000000",
            color: "white",
            border: "black",
            width: "50px",
            height: "50px",
            borderRadius: "20%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          }}
        >
          <CiLocationArrow1 />
        </button>


        {selectedMeal && (
          <MealDetailsModal open={selectedMeal} meal={selectedMeal} handleClose={() => setSelectedMeal(null)} />
        )}
      </div>
    </ThemeProvider>
  );
};

export default MapboxMap;
