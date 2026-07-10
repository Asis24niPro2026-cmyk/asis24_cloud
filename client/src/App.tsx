import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BusinessProfile from "./pages/BusinessProfile";
import RegisterBusiness from "./pages/RegisterBusiness";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/negocio/:id" element={<BusinessProfile />} />
        <Route path="/registrar" element={<RegisterBusiness />} />
        <Route path="/admin/:id" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
