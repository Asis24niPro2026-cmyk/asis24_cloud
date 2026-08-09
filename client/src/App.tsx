import { BrowserRouter, Routes, Route } from "react-router-dom";
import PedidoForm from "./components/PedidoForm";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
              <h1>Pedidos</h1>
              <PedidoForm />
            </div>
          }
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;