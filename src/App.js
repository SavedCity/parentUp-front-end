import "./Main.scss";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import MainContent from "./components/main/MainContent";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./components/routing/PageNotFound";
import PrivateRoute from "./components/routing/PrivateRoute";
import PasswordReset from "./components/authentication/PasswordReset";
import Profile from "./components/header/profile/Profile";
import Child from "./components/header/profile/Child";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<MainContent />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/profile/:child" element={<Child />} />
            </Route>
            <Route path="signin" element={<SignIn />} />
            <Route path="signin/password-reset" element={<PasswordReset />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
