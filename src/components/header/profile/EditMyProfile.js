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
import { AiFillEdit } from "react-icons/ai";

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
    let loader = document.getElementById("edit-save-loader");
    e.preventDefault();
    loader.style.display = "block";
    const userDoc = doc(db, "users", currentUser.uid);
    const storageRef = storage.ref();
    const fieldValue = newUsernameRef.current.value
      ? newUsernameRef.current.value.toLowerCase()
      : newUsernameRef.current.toLowerCase();
    const data = query(
      collection(db, "users"),
      where("usernameLC", "==", fieldValue)
    );
    const snapshot = await getDocs(data);
    let existingUsername;
    snapshot.forEach((doc) => {
      existingUsername = doc.data().usernameLC;
    });
    try {
      let fileRef;
      if (childPhoto !== userInfo.photo_url) {
        fileRef = storageRef.child(childPhoto.name);
        await fileRef.put(childPhoto);
      }
      if (
        fieldValue === existingUsername &&
        newFullName === userInfo.full_name &&
        previewChildPhoto === userInfo.photo_url
      ) {
        console.log("Username exists");
        return;
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
    await userCollection();
    loader.style.display = "none";
    toggleEdit();
  };

  const handleNewFullNameChange = (e) => {
    setNewFullName(e.target.value);
  };

  const handleNewUsernameChange = async (e) => {
    let submitBtn = document.getElementById("edit-save-btn");
    submitBtn.disabled = true;
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
      submitBtn.disabled = true;
      return;
    }
    if (
      newUsernameRef.current === userInfo.username &&
      newFullName === userInfo.full_name
    ) {
      return;
    }
    setUsernameErr(false);
    submitBtn.disabled = false;
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
      <form>
        <div>
          <label htmlFor="user-photo-picker">
            <span className="user-edit-icon">
              <AiFillEdit />
            </span>
            {previewChildPhoto ? (
              <img src={previewChildPhoto} alt="child" />
            ) : (
              <span className="default-user-img-placeholder">
                {userInfo.full_name.charAt(0)}
              </span>
            )}
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
              placeholder="Full Name"
              onChange={handleNewFullNameChange}
            />
            <div>
              <input
                id="edit-username"
                type="text"
                ref={newUsernameRef}
                value={newUsername}
                placeholder="Username"
                onChange={handleNewUsernameChange}
              />
              {newUsername === userInfo.username
                ? ""
                : usernameErr
                ? "❌"
                : "✅"}
            </div>
          </section>
        </div>
        <div className="edit-save-box">
          <button
            disabled={
              newUsername === userInfo.username &&
              newFullName === userInfo.full_name &&
              previewChildPhoto === userInfo.photo_url
            }
            id="edit-save-btn"
            type="submit"
            onClick={updateProfile}
          >
            Save
            <div id="edit-save-loader"></div>
          </button>
          <button className="cancel-edit" onClick={toggleEdit}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
