import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { storage, db } from "../../../firebase/firebase";
import "../Header.scss";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  FieldValue,
} from "firebase/firestore";
import { useRef } from "react";

export default function Profile() {
  const { userInfo, userCollection, currentUser, db, dataLoading } = useAuth();
  const [submittingChildSuccess, setSubmittingChildSuccess] = useState(false);
  const [childPhoto, setChildPhoto] = useState("");
  const [previewChildPhoto, setPreviewChildPhoto] = useState("");
  const photoRef = useRef("");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [fullNameRequired, setFullNameRequired] = useState(false);
  const dobRef = useRef("");
  const [dobErr, setDobErr] = useState(false);
  const [gender, setGender] = useState("Boy");
  const pobRef = useRef("");

  useEffect(() => {
    userCollection();
    previewImage();
  }, [childPhoto]); // eslint-disable-line

  const openModalAddChild = () => {
    let modal = document.getElementById("addChildModal");
    modal.style.display = "block";
  };

  const closeAddChildModal = () => {
    let modal = document.getElementById("addChildModal");
    modal.style.display = "none";
    resetAddChildFields();
  };

  const resetAddChildFields = () => {
    let boyInput = document.getElementById("boy");
    boyInput.checked = true;
    setName("");
    dobRef.current.value = "";
    pobRef.current.value = "";
    setNameErr(false);
    setFullNameRequired(false);
    setDobErr(false);
    setChildPhoto("");
    photoRef.current.value = "";
  };

  const addChild = async (e) => {
    e.preventDefault();
    if (name.trim() === "" && dobRef.current.value === "") {
      setNameErr(true);
      setDobErr(true);
      return;
    } else if (name.trim() === "") {
      setNameErr(true);
      return;
    } else if (name.trim().indexOf(" ") === -1 && dobRef.current.value === "") {
      setFullNameRequired(true);
      setDobErr(true);
      return;
    } else if (name.trim().indexOf(" ") === -1) {
      setFullNameRequired(true);
      return;
    } else if (dobRef.current.value === "") {
      setDobErr(true);
      return;
    }
    e.target.disabled = true;
    setSubmittingChildSuccess(true);
    let loader = document.getElementById("submit-loader");
    let toast = document.querySelector(".success-toast");
    loader.style.display = "block";
    const userDoc = doc(db, "users", currentUser.uid);
    const storageRef = storage.ref();
    const fileRef = storageRef.child(childPhoto.name);
    await fileRef.put(childPhoto);
    const inputs = {
      date_added: new Date(),
      name: name,
      dob: dobRef.current.value,
      gender: gender,
      pob: pobRef.current.value,
      photo_name: childPhoto.name,
      photo_url: await fileRef.getDownloadURL(),
    };
    try {
      await updateDoc(userDoc, {
        children: arrayUnion(inputs),
      });
      userCollection();
      setSubmittingChildSuccess(false);
      closeAddChildModal();
      setTimeout(() => {
        toast.classList.add("toast-show");
      }, 500);
      setTimeout(() => {
        toast.classList.remove("toast-show");
      }, 3500);
    } catch (err) {
      console.log(err);
    }
    loader.style.display = "none";
    e.target.disabled = false;
  };

  const removeChild = async (child) => {
    const userDoc = doc(db, "users", currentUser.uid);
    await updateDoc(userDoc, {
      children: arrayRemove(child),
    });
    userCollection();
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameErr(false);
    setFullNameRequired(false);
  };

  const handleDobChange = (e) => {
    setDobErr(false);
  };

  const handlePhotoChange = (e) => {
    setChildPhoto(e.target.files[0]);
  };

  const previewImage = () => {
    if (childPhoto !== "") {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewChildPhoto(fileReader.result);
      };
      fileReader.readAsDataURL(childPhoto);
    }
  };

  return (
    <div>
      <Link to="/">Home</Link>
      {!dataLoading ? (
        <div>
          <div className="success-toast">
            <span>
              Successfully Added{" "}
              {userInfo.children[userInfo.children.length - 1] &&
                userInfo.children[userInfo.children.length - 1].name}
              !
            </span>
          </div>
          <h1>My profile</h1>
          <h3>My username: {userInfo.username}</h3>

          <button onClick={openModalAddChild}>Add child</button>

          <div id="addChildModal">
            <div>
              <h2>Child's Details</h2>
              <form>
                <label htmlFor="child-photo-picker">
                  <img
                    className="child-current-image"
                    src={previewChildPhoto}
                    alt=""
                  />
                </label>
                <input
                  id="child-photo-picker"
                  type="file"
                  onChange={handlePhotoChange}
                  ref={photoRef}
                />

                <label
                  style={
                    nameErr || fullNameRequired ? { color: "#910000" } : null
                  }
                  htmlFor="name"
                >
                  Full name{" "}
                  {fullNameRequired && (
                    <span className="name-validation">
                      Last name is required!
                    </span>
                  )}
                </label>
                <input
                  onChange={handleNameChange}
                  style={
                    nameErr || fullNameRequired
                      ? { borderColor: "#b10000" }
                      : null
                  }
                  id="name"
                  type="text"
                  placeholder="ex. Anna Armstrong"
                  value={name}
                />

                <label
                  style={dobErr ? { color: "#910000" } : null}
                  htmlFor="dob"
                >
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

                <div className="buttons-container">
                  <span onClick={closeAddChildModal}>Cancel</span>
                  <div>
                    <button
                      id="add-child-submit"
                      onClick={addChild}
                      type="submit"
                    >
                      Confirm
                    </button>
                    <div id="submit-loader"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {userInfo.children &&
            userInfo.children.map((child, key) => {
              const { name, dob, gender, photo_name, photo_url } = child;
              return (
                <div key={key}>
                  <h3>{name}</h3>
                  <h3>{dob}</h3>
                  <h3>{gender}</h3>
                  <img
                    src={photo_url}
                    alt={photo_name}
                    style={{ width: "10%" }}
                  />

                  <button onClick={(e) => removeChild(child)}>Remove</button>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
