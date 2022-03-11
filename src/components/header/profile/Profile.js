import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ".././styles/Profile.scss";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import AddChildModal from "./AddChildModal";
import EditMyProfile from "./EditMyProfile";

export default function Profile() {
  const [infoEditable, setInfoEditable] = useState(false);
  const { userInfo, userCollection, currentUser, db, dataLoading } = useAuth();

  useEffect(() => {
    userCollection();
  }, []); // eslint-disable-line

  const openAddChildModal = () => {
    if (infoEditable) {
      toggleEdit();
    }
    let modal = document.getElementById("addChildModal");
    modal.classList.add("child-modal-display");
  };
  const removeChild = async (child) => {
    const userDoc = doc(db, "users", currentUser.uid);
    await updateDoc(userDoc, {
      children: arrayRemove(child),
    });
    userCollection();
  };

  const toggleEdit = () => {
    // let container = document.querySelector(".main-user-info-container");
    let toggleBtn = document.querySelector(".edit-profile-toggle");
    let lock = document.querySelector(".edit-lock");
    let editText = document.querySelector("label[for=edit-profile]");
    if (infoEditable) {
      // container.style.backgroundColor = "#edede944";
      toggleBtn.classList.remove("edit-active");
      lock.classList.remove("edit-lock-active");
      editText.style.color = "#717171";
    } else {
      // container.style.backgroundColor = "#d0ffb777";
      toggleBtn.classList.add("edit-active");
      lock.classList.add("edit-lock-active");
      editText.style.color = "#52b788";
    }
    setInfoEditable(!infoEditable);
  };

  return (
    <div>
      {/* TOAST  */}
      <div className="success-toast">
        <span>
          Successfully added{" "}
          {userInfo.children &&
            userInfo.children[userInfo.children.length - 1] &&
            userInfo.children[userInfo.children.length - 1].name}
          !
        </span>
      </div>
      {!dataLoading ? (
        <div className="profile-main">
          <div className="main-user-info-container">
            <div>
              {!infoEditable ? (
                <div className="user-personal-info">
                  <img src={userInfo.photo_url} alt={userInfo.photo_name} />
                  <section className="names-section">
                    <input
                      id="profile-full-name"
                      value={userInfo.full_name}
                      readOnly
                    />
                    <input
                      id="profile-username"
                      value={userInfo.username}
                      readOnly
                    />
                  </section>
                </div>
              ) : (
                <EditMyProfile toggleEdit={toggleEdit} />
              )}
              <label onClick={toggleEdit} htmlFor="edit-profile">
                <div id="edit-profile" className="edit-profile-toggle"></div>
                Edit
                <div className="edit-lock"></div>
              </label>
            </div>
          </div>

          <div className="additional-user-info-container">
            <button onClick={openAddChildModal}>Add child</button>
            <AddChildModal />
            {userInfo.children &&
              userInfo.children.map((child, key) => {
                const { name, date_added } = child;
                let id = date_added.seconds.toString();
                return (
                  <div key={key}>
                    <Link to={id}>{name}</Link>
                    <button onClick={(e) => removeChild(child)}>Remove</button>
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
