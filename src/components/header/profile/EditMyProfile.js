import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { db, storage } from "../../../firebase/firebase";

export default function EditMyProfile() {
  const { userInfo, currentUser, userCollection } = useAuth();
  const newUsernameRef = useRef(userInfo.username);
  const [newUsername, setNewUsername] = useState(userInfo.username);
  const [usernameErr, setUsernameErr] = useState(false);
  const [childPhoto, setChildPhoto] = useState("");
  const [previewChildPhoto, setPreviewChildPhoto] = useState("");

  const photoRef = useRef("");

  useEffect(() => {
    previewImage();
  }, [childPhoto]); // eslint-disable-line

  const updateProfile = async (e) => {
    e.preventDefault();
    const userDoc = doc(db, "users", currentUser.uid);
    const storageRef = storage.ref();
    try {
      const fileRef = storageRef.child(childPhoto.name);
      await fileRef.put(childPhoto);
      await updateDoc(userDoc, {
        username: newUsernameRef.current,
        photo_name: childPhoto.name,
        photo_url: await fileRef.getDownloadURL(),
      });
    } catch (err) {
      console.log(err);
    }
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
      where("usernameLC", "==", fieldValue)
    );
    const snapshot = await getDocs(data);
    let existingUsername;
    snapshot.forEach((doc) => {
      existingUsername = doc.data().usernameLC;
      console.log(existingUsername);
    });
    if (fieldValue !== userInfo.usernameLC && fieldValue === existingUsername) {
      setUsernameErr(true);
      return;
    } else if (newUsernameRef.current === userInfo.username) {
      submit.disabled = true;
      return;
    }
    setUsernameErr(false);
    submit.disabled = false;
  };

  const handlePhotoChange = (e) => {
    setChildPhoto(e.target.files[0]);
  };

  const previewImage = () => {
    const fileReader = new FileReader();
    if (childPhoto !== "" && childPhoto) {
      fileReader.onload = () => {
        setPreviewChildPhoto(fileReader.result);
      };
      fileReader.readAsDataURL(childPhoto);
    }
  };
  return (
    <div>
      <form>
        <label htmlFor="user-photo-picker">
          <div className="current-child-image-container">
            <img src={previewChildPhoto} alt="child" style={{ width: "5%" }} />
          </div>
          <span className="photo-icon"></span>
        </label>
        <input
          id="user-photo-picker"
          type="file"
          onChange={handlePhotoChange}
          ref={photoRef}
        />
        <label htmlFor="edit-username">Edit username</label>
        <input
          id="edit-username"
          type="text"
          ref={newUsernameRef}
          value={newUsername}
          onChange={handleNewUsernameChange}
        />
        {newUsername === userInfo.username ? "" : !usernameErr ? "✅" : "❌"}
        <button
          disabled={newUsername === userInfo.username}
          id="edit-profile-btn"
          type="submit"
          onClick={updateProfile}
        >
          Save
        </button>
      </form>

      <br />
      <br />
      <br />
    </div>
  );
}
