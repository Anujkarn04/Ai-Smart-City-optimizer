import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePredictionContext } from "../context/PredictionContext";

// 🔧 FIX marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});
export default function CityMap() {
  const { history } = usePredictionContext();

  const latest = history?.[history.length - 1];
  const latestPrediction = latest?.predicted_energy_mwh;
  const zones = [
    {
      name: "Zone A",
      position: [28.7041, 77.1025],
      load: latestPrediction || 70,
    },
    {
      name: "Zone B",
      position: [28.7141, 77.1225],
      load: (latestPrediction || 70) * 0.8,
    },
    {
      name: "Zone C",
      position: [28.6941, 77.0825],
      load: (latestPrediction || 70) * 0.6,
    },
  ];

  const getColor = (load) => {
    if (load > 80) return "red";
    if (load > 60) return "orange";
    return "green";
  };

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-white/10">
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={11}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {zones.map((zone, i) => (
          <Circle
            key={i}
            center={zone.position}
            radius={500}
            pathOptions={{
              color: getColor(zone.load),
              fillColor: getColor(zone.load),
              fillOpacity: 0.5,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
