import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProtectedUserRoute } from "./private/protectedUserRoute";
import { PublicUserRoute } from "./private/publicUserRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedUserRoute>
              <DashboardPage />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicUserRoute>
              <LoginPage />
            </PublicUserRoute>
          }
        />
        <Route
          path="/"
          element={
            <PublicUserRoute>
              <HomePage />
            </PublicUserRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicUserRoute>
              <RegisterPage />
            </PublicUserRoute>
          }
        />
        <Route
          path="*"
          element={
            <PublicUserRoute>
              <LoginPage />
            </PublicUserRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
