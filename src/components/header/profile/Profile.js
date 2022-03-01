import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
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
  const nameRef = useRef("");
  const dobRef = useRef("");
  const genderRef = useRef("");
  const pobRef = useRef("");

  useEffect(() => {
    userCollection();
  }, []); // eslint-disable-line

  const openModalAddChild = () => {
    let modal = document.getElementById("addChildModal");
    modal.style.display = "block";
  };

  const closeModalAddChild = () => {
    let modal = document.getElementById("addChildModal");
    modal.style.display = "none";
  };

  const addChild = async (e) => {
    e.preventDefault();

    const userDoc = doc(db, "users", currentUser.uid);

    const inputs = {
      date_added: new Date(),
      name: nameRef.current.value,
      dob: dobRef.current.value,
      gender: genderRef.current.value,
      pob: pobRef.current.value,
    };

    try {
      const data = await updateDoc(userDoc, {
        children: arrayUnion(inputs),
      });
      userCollection();
    } catch (err) {
      console.log(err);
    }
  };

  const removeChild = async (child) => {
    const userDoc = doc(db, "users", currentUser.uid);

    await updateDoc(userDoc, {
      children: arrayRemove(child),
    });
    userCollection();
  };

  const handleGenderChange = (e) => {
    genderRef.current = e.target;
  };

  return (
    <div>
      <Link to="/">Home</Link>
      {!dataLoading ? (
        <div>
          <h1>My profile</h1>
          <h3>My username: {userInfo.username}</h3>

          <button onClick={openModalAddChild}>Add child</button>

          <div id="addChildModal" style={{ display: "none" }}>
            <button onClick={closeModalAddChild}>CLOSE</button>
            <div>
              <form>
                <label htmlFor="name">Full name</label>
                <input ref={nameRef} id="name" type="text" />

                <label htmlFor="dob">Date of birth</label>
                <input ref={dobRef} id="dob" type="date" />

                <div onChange={handleGenderChange}>
                  <p>Gender</p>
                  <label htmlFor="boy">Boy</label>
                  <input
                    ref={genderRef}
                    name="gender"
                    id="boy"
                    type="radio"
                    value="Boy"
                  />
                  <label htmlFor="girl">Girl</label>
                  <input
                    ref={genderRef}
                    name="gender"
                    id="girl"
                    type="radio"
                    value="Girl"
                  />
                </div>

                <label htmlFor="pob">Place of birth</label>
                <input ref={pobRef} id="pob" type="text" />

                <button onClick={addChild} type="submit">
                  Confirm
                </button>
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
