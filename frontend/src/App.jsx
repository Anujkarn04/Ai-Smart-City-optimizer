import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Renewables from "./pages/Renewables";
import Zones from "./pages/Zones";
import Anomalies from "./pages/Anomalies";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/renewables" element={<Renewables />} />
        <Route path="/zones" element={<Zones />} />
        <Route path="/anomalies" element={<Anomalies />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
