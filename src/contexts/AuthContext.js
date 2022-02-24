import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase/firebase";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signUp = async (email, password, bioVal) => {
    const newUser = await auth.createUserWithEmailAndPassword(email, password);
    return db.collection("users").doc(newUser.user.uid).set({
      bio: bioVal,
    });
  };

  const signIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const signOut = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, signUp, signIn, signOut, resetPassword };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
