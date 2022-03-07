import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRef } from "react";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../firebase/firebase";

export default function EditMyProfile() {
  const { userInfo, currentUser, userCollection } = useAuth();
  const newUsernameRef = useRef(userInfo.username);
  const [newUsername, setNewUsername] = useState(userInfo.username);
  const [usernameErr, setUsernameErr] = useState(false);

  const updateProfile = async (e) => {
    e.preventDefault();
    const userDoc = doc(db, "users", currentUser.uid);
    await updateDoc(userDoc, {
      username: newUsernameRef.current,
    });
    userCollection();
  };

  const handleNewUsernameChange = async (e) => {
    let submit = document.getElementById("edit-profile-btn");
    submit.disabled = true;
    setNewUsername(e.target.value);
    newUsernameRef.current = e.target.value;
    const fieldValue = newUsernameRef.current.toLowerCase();

    const data = query(
      collection(db, "users"),
      where("username", "==", fieldValue)
    );
    const snapshot = await getDocs(data);
    let existingUsername;
    snapshot.forEach((doc) => {
      existingUsername = doc.data().username.toLowerCase();
    });
    if (fieldValue === existingUsername) {
      setUsernameErr(true);
      return;
    } else if (fieldValue === userInfo.username) {
      return;
    }

    setUsernameErr(false);
    submit.disabled = false;
  };
  return (
    <div>
      {usernameErr && "Username already exists!"}
      <form>
        <label htmlFor="edit-username">Edit username</label>
        <input
          id="edit-username"
          type="text"
          ref={newUsernameRef}
          value={newUsername}
          onChange={handleNewUsernameChange}
        />
        <button
          //   disabled={newUsernameRef.current === userInfo.username}
          disabled
          id="edit-profile-btn"
          type="submit"
          onClick={updateProfile}
        >
          Save
        </button>
      </form>
    </div>
  );
}
