import React, { useEffect, useRef, useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../../../contexts/AuthContext";
import { storage } from "../../../firebase/firebase";
import ".././styles/AddChildModal.scss";

import { AiFillEdit } from "react-icons/ai";
import { BsImage } from "react-icons/bs";

export default function AddChildModal() {
  const { userCollection, currentUser, db } = useAuth();
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [fullNameRequiredErr, setFullNameRequiredErr] = useState(false);
  const [dobErr, setDobErr] = useState(false);
  const [childPhoto, setChildPhoto] = useState("");
  const [imageErr, setImageErr] = useState(false);
  const [previewChildPhoto, setPreviewChildPhoto] = useState("");
  const [gender, setGender] = useState("Boy");

  const photoRef = useRef("");
  const dobRef = useRef("");
  const pobRef = useRef("");

  useEffect(() => {
    previewImage();
  }, [childPhoto]); // eslint-disable-line

  const resetAddChildFields = () => {
    let boyInput = document.getElementById("boy");
    boyInput.checked = true;
    setName("");
    dobRef.current.value = "";
    pobRef.current.value = "";
    setNameErr(false);
    setFullNameRequiredErr(false);
    setDobErr(false);
    setChildPhoto("");
    photoRef.current.value = "";
    setPreviewChildPhoto("");
    setImageErr(false);
  };

  const closeAddChildModal = () => {
    let modal = document.getElementById("add-child-modal");
    modal.classList.remove("child-modal-display");
    resetAddChildFields();
  };

  const addChild = async (e) => {
    let fieldsPassedValidation = false;
    e.preventDefault();
    if (childPhoto === "") {
      setImageErr(true);
      fieldsPassedValidation = true;
    }
    if (dobRef.current.value === "") {
      setDobErr(true);
      fieldsPassedValidation = true;
    }
    if (name.trim() === "") {
      setNameErr(true);
      fieldsPassedValidation = true;
    }
    if (name.trim().indexOf(" ") === -1 && name.trim() !== "") {
      setFullNameRequiredErr(true);
      fieldsPassedValidation = true;
    }
    if (fieldsPassedValidation) {
      return;
    }
    e.target.disabled = true;
    let loader = document.getElementById("submit-loader");
    let toast = document.querySelector(".adding-child-toast");
    loader.style.display = "block";
    const userDoc = doc(db, "users", currentUser.uid);
    const storageRef = storage.ref();
    try {
      const fileRef = storageRef.child(childPhoto.name);
      const currentDate = new Date();
      await fileRef.put(childPhoto);
      const inputs = {
        date_added: currentDate,
        name: name,
        dob: dobRef.current.value,
        gender: gender,
        pob: pobRef.current.value,
        photo_name: childPhoto.name,
        photo_url: await fileRef.getDownloadURL(),
      };
      await updateDoc(userDoc, {
        children: arrayUnion(inputs),
      });
      userCollection();
      closeAddChildModal();
      setTimeout(() => {
        toast.classList.add("show-adding-child-toast");
      }, 250);
      setTimeout(() => {
        toast.classList.remove("show-adding-child-toast");
      }, 3500);
    } catch (err) {
      console.log(err);
    }
    loader.style.display = "none";
    e.target.disabled = false;
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameErr(false);
    setFullNameRequiredErr(false);
  };

  const handleDobChange = (e) => {
    setDobErr(false);
  };

  const handlePhotoChange = (e) => {
    setChildPhoto(e.target.files[0]);
    setImageErr(false);
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
    <div id="add-child-modal">
      <div>
        <h2>Child's Details</h2>
        <form>
          <label
            style={
              !previewChildPhoto && imageErr
                ? { border: "1px solid #910000" }
                : !previewChildPhoto
                ? { border: "1px solid #919191" }
                : { border: "1px solid transparent" }
            }
            htmlFor="child-photo-picker"
          >
            {previewChildPhoto && (
              <div className="current-child-image-container">
                <img src={previewChildPhoto} alt="child" />
                <div>
                  <AiFillEdit />
                </div>
              </div>
            )}
            <span className="photo-icon">
              {!previewChildPhoto && <BsImage />}
            </span>
          </label>
          <input
            id="child-photo-picker"
            type="file"
            onChange={handlePhotoChange}
            ref={photoRef}
            accept="image/*"
            hidden
          />

          <label
            style={nameErr || fullNameRequiredErr ? { color: "#910000" } : null}
            htmlFor="name"
          >
            Full name{" "}
            {fullNameRequiredErr && (
              <span className="name-validation">Last name is required!</span>
            )}
          </label>
          <input
            onChange={handleNameChange}
            style={
              nameErr || fullNameRequiredErr ? { borderColor: "#b10000" } : null
            }
            id="name"
            type="text"
            placeholder="ex. Anna Armstrong"
            value={name}
          />

          <label style={dobErr ? { color: "#910000" } : null} htmlFor="dob">
            Date of birth
          </label>
          <input
            style={dobErr ? { borderColor: "#b10000" } : null}
            onChange={handleDobChange}
            ref={dobRef}
            id="dob"
            type="date"
          />

          <div className="gender-box" onChange={handleGenderChange}>
            <p>Gender</p>
            <label htmlFor="boy">Boy</label>
            <input
              defaultChecked
              name="gender"
              id="boy"
              type="radio"
              value="Boy"
            />
            <label htmlFor="girl">Girl</label>
            <input name="gender" id="girl" type="radio" value="Girl" />
          </div>

          <label htmlFor="pob">Place of birth</label>
          <input
            placeholder="ex. Austin, TX"
            ref={pobRef}
            id="pob"
            type="text"
          />

          <div className="add-child-buttons-container">
            <span onClick={closeAddChildModal}>Cancel</span>
            <div>
              <button id="add-child-submit" onClick={addChild} type="submit">
                Confirm
              </button>
              <div id="submit-loader"></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
