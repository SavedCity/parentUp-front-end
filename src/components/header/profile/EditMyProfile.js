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

export default function EditMyProfile({ toggleEdit }) {
  const { userInfo, currentUser, userCollection } = useAuth();
  const newFullNameRef = useRef(userInfo.full_name);
  const [newFullName, setNewFullName] = useState(userInfo.full_name);
  const newUsernameRef = useRef(userInfo.username);
  const [newUsername, setNewUsername] = useState(userInfo.username);
  const [usernameErr, setUsernameErr] = useState(false);
  const [childPhoto, setChildPhoto] = useState(userInfo.photo_url);
  const [previewChildPhoto, setPreviewChildPhoto] = useState(
    userInfo.photo_url
  );

  const photoRef = useRef("");

  useEffect(() => {
    previewImage();
  }, [childPhoto]); // eslint-disable-line

  const updateProfile = async (e) => {
    let submitBtn = document.getElementById("edit-submit-btn");
    e.preventDefault();
    const userDoc = doc(db, "users", currentUser.uid);
    const storageRef = storage.ref();
    try {
      let fileRef;
      if (childPhoto !== userInfo.photo_url) {
        fileRef = storageRef.child(childPhoto.name);
        await fileRef.put(childPhoto);
      }
      await updateDoc(userDoc, {
        full_name: newFullName,
        username: newUsername,
        usernameLC: newUsername.toLowerCase(),
        photo_name:
          childPhoto !== userInfo.photo_url
            ? childPhoto.name
            : userInfo.photo_name,
        photo_url:
          childPhoto !== userInfo.photo_url
            ? await fileRef.getDownloadURL()
            : userInfo.photo_url,
      });
    } catch (err) {
      console.log(err);
    }
    if (
      newUsername === userInfo.username &&
      newFullName === userInfo.full_name &&
      previewChildPhoto === userInfo.photo_url
    ) {
      submitBtn.disabled = true;
    }
    await userCollection();
    toggleEdit();
  };

  const handleNewFullNameChange = (e) => {
    setNewFullName(e.target.value);
  };

  const handleNewUsernameChange = async (e) => {
    let submit = document.getElementById("edit-submit-btn");
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
    if (childPhoto !== "" && childPhoto !== userInfo.photo_url && childPhoto) {
      fileReader.onload = () => {
        setPreviewChildPhoto(fileReader.result);
      };
      fileReader.readAsDataURL(childPhoto);
    }
  };
  return (
    <div className="edit-user-personal-info">
      <div>
        <label htmlFor="user-photo-picker">
          <img src={previewChildPhoto} alt="child" />
          <input
            id="user-photo-picker"
            type="file"
            onChange={handlePhotoChange}
            ref={photoRef}
            accept="image/*"
            hidden
          />
        </label>

        <section className="names-section">
          <input
            id="edit-full-name"
            type="text"
            ref={newFullNameRef}
            value={newFullName}
            onChange={handleNewFullNameChange}
          />
          <div>
            <input
              id="edit-username"
              type="text"
              ref={newUsernameRef}
              value={newUsername}
              onChange={handleNewUsernameChange}
            />
            {newUsername === userInfo.username
              ? ""
              : !usernameErr
              ? "✅"
              : "❌"}
          </div>
        </section>
      </div>
      <button
        disabled={
          newUsername === userInfo.username &&
          newFullName === userInfo.full_name &&
          previewChildPhoto === userInfo.photo_url
        }
        id="edit-submit-btn"
        type="submit"
        onClick={updateProfile}
      >
        Save
      </button>
    </div>
  );
}
