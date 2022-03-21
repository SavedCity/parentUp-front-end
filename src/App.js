import "./Main.scss";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import MainContent from "./components/main/MainContent";
import PageNotFound from "./components/routing/PageNotFound";
import PrivateRoute from "./components/routing/PrivateRoute";
import PasswordReset from "./components/authentication/PasswordReset";
import Profile from "./components/header/profile/Profile";
import Child from "./components/header/profile/Child";
import Header from "./components/header/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import SearchedUser from "./components/header/SearchedUser";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<MainContent />} />
              <Route path="/user/:userId" element={<SearchedUser />} />
              <Route path="/user/:userId/:childId" element={<Child />} />
              <Route path="profile" element={<Profile />} />
              <Route path="/profile/:childId" element={<Child />} />
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
