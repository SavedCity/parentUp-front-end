import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import MainContent from "./components/main/MainContent";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./components/routing/PageNotFound";
import PrivateRoute from "./components/routing/PrivateRoute";
import PasswordReset from "./components/authentication/PasswordReset";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route exact path="/" element={<MainContent />} />
            </Route>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="password-reset" element={<PasswordReset />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
