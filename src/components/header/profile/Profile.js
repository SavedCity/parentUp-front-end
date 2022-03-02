import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
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
  const nameRef = useRef("");
  const [nameErr, setNameErr] = useState(false);
  const [fullNameRequired, setFullNameRequired] = useState(false);
  const dobRef = useRef("");
  const [dobErr, setDobErr] = useState(false);
  const [gender, setGender] = useState("Boy");
  const pobRef = useRef("");

  useEffect(() => {
    userCollection();
  }, []); // eslint-disable-line

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
    nameRef.current.value = "";
    dobRef.current.value = "";
    pobRef.current.value = "";
  };

  const addChild = async (e) => {
    e.preventDefault();
    if (nameRef.current.value.trim() === "") {
      setNameErr(true);
      return;
    } else if (nameRef.current.value.trim().indexOf(" ") === -1) {
      setFullNameRequired(true);
      return;
    }
    e.target.disabled = true;
    setSubmittingChildSuccess(true);
    let loader = document.getElementById("submit-loader");
    let toast = document.querySelector(".success-toast");
    loader.style.display = "block";
    const userDoc = doc(db, "users", currentUser.uid);
    const inputs = {
      date_added: new Date(),
      name: nameRef.current.value,
      dob: dobRef.current.value,
      gender: gender,
      pob: pobRef.current.value,
    };
    try {
      await updateDoc(userDoc, {
        children: arrayUnion(inputs),
      });
      userCollection();
      setSubmittingChildSuccess(false);
      closeAddChildModal();
      toast.classList.add("toast-show");
      setTimeout(() => {
        toast.classList.remove("toast-show");
      }, 2000);
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
    setNameErr(false);
    setFullNameRequired(false);
  };

  return (
    <div>
      <Link to="/">Home</Link>
      {!dataLoading ? (
        <div>
          <div className="success-toast">
            <span>Successfully Added!</span>
          </div>
          <h1>My profile</h1>
          <h3>My username: {userInfo.username}</h3>

          <button onClick={openModalAddChild}>Add child</button>

          <div id="addChildModal">
            <div>
              <form>
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
                  ref={nameRef}
                  id="name"
                  type="text"
                />

                <label htmlFor="dob">Date of birth</label>
                <input ref={dobRef} id="dob" type="date" />

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
                <input ref={pobRef} id="pob" type="text" />

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
              const { name, dob, gender } = child;
              return (
                <div key={key}>
                  <h3>{name}</h3>
                  <h3>{dob}</h3>
                  <h3>{gender}</h3>

                  <button onClick={(e) => removeChild(child)}>Remove</button>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
