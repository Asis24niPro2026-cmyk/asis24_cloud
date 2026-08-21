import { BrowserRouter, Routes, Route } from "react-router-dom";
import PedidoForm from "./components/PedidoForm";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PedidoForm />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;