import React, { useState, useContext, useEffect } from "react";
import { auth, db } from "../firebase/firebase";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const signUp = async (email, password, username) => {
    const newUser = await auth.createUserWithEmailAndPassword(email, password);
    return db.collection("users").doc(newUser.user.uid).set({
      username: username,
      date_created: new Date(),
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

  const userCollection = async () => {
    const data = await db
      .collection("users")
      .doc(currentUser.uid)
      .get()
      .then((doc) => doc.data());
    setUserInfo(data);
    setDataLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserInfo([]);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    signIn,
    signOut,
    resetPassword,
    userCollection,
    userInfo,
    db,
    dataLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
