import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Callback from "./Callback";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./components/auth/AuthProvider";
import "./App.css";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <LoginPage />}
      />
      <Route path="/callback" element={<Callback />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
