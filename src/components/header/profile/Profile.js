import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import ".././styles/Profile.scss";
import AddChildModal from "./AddChildModal";
import EditMyProfile from "./EditMyProfile";

export default function Profile() {
  const [infoEditable, setInfoEditable] = useState(false);
  const { userInfo, userCollection, dataLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    userCollection();
    let locationId;
    let filter;
    if (location.state) {
      locationId = location.state.id;
    }
    if (userInfo.children) {
      filter = userInfo.children.filter(
        (child) => child.date_added.seconds.toString() === locationId
      );
    }
    if (location.state && filter && filter.length !== 0) {
      childRemoved();
    }
  }, []); // eslint-disable-line

  const childRemoved = () => {
    let toast = document.querySelector(".removing-child-toast");
    setTimeout(() => {
      toast.classList.add("show-removing-child-toast");
    }, 250);
    setTimeout(() => {
      toast.classList.remove("show-removing-child-toast");
    }, 3500);
  };

  const openAddChildModal = () => {
    if (infoEditable) {
      toggleEdit();
    }
    let modal = document.getElementById("addChildModal");
    modal.classList.add("child-modal-display");
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
      <div className="adding-child-toast">
        <span>
          Successfully added{" "}
          {userInfo.children &&
            userInfo.children[userInfo.children.length - 1] &&
            userInfo.children[userInfo.children.length - 1].name}
          !
        </span>
      </div>

      <div className="removing-child-toast">
        <span>
          Successfully removed {location.state && location.state.name}!
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
                <span id="edit-profile" className="edit-profile-toggle"></span>
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
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
