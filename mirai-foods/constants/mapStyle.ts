/** Shared light cream map theme (Google Maps custom style JSON) */
export const LIGHT_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#F5F0EA" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a8a8a8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F5F0EA" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e8e2da" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#ebe6df" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e8e6e3" }],
  },
];
