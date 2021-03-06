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
        (child) => child.date_created.seconds.toString() === locationId
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
    let modal = document.getElementById("add-child-modal");
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
      editText.style.color = "#919191";
    } else {
      // container.style.backgroundColor = "#d0ffb777";
      toggleBtn.classList.add("edit-active");
      lock.classList.add("edit-lock-active");
      editText.style.color = "#717171";
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

      {/*  /////// MAIN USER INFORMATION SECTION /////// */}
      {!dataLoading ? (
        <div className="profile-main">
          <div className="main-user-info-container">
            <div>
              {!infoEditable ? (
                <div className="user-personal-info">
                  {userInfo.photo_url ? (
                    <img src={userInfo.photo_url} alt={userInfo.photo_name} />
                  ) : (
                    <span className="default-user-img-placeholder">
                      {userInfo.full_name && userInfo.full_name.charAt(0)}
                    </span>
                  )}
                  <section className="names-section">
                    <input
                      id="profile-full-name"
                      value={userInfo.full_name || ""}
                      readOnly
                    />
                    <input
                      id="profile-username"
                      value={userInfo.username || ""}
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

          {/* /////// ADDITIONAL INFO FOR USER SECTION /////// */}
          <div className="additional-user-info-container">
            <button
              className="open-child-modal-btn"
              onClick={openAddChildModal}
            >
              Add child
            </button>
            <AddChildModal />

            <h3 className="my-children-title">My Children</h3>
            <div className="my-children-container">
              {userInfo.children &&
                userInfo.children.map((child, key) => {
                  const { name, date_created, photo_url } = child;
                  const id = date_created.seconds.toString();
                  const childrenLength = userInfo.children.length;
                  const imageWH =
                    childrenLength === 1
                      ? "150px"
                      : childrenLength === 2
                      ? "120px"
                      : "100px";
                  const linkFontSize =
                    childrenLength === 1 ? "1.15rem" : "1rem";
                  return (
                    <div key={key}>
                      <Link
                        style={{
                          fontSize: linkFontSize,
                        }}
                        to={id}
                      >
                        <img
                          style={{
                            width: imageWH,
                            height: imageWH,
                          }}
                          src={photo_url}
                          alt={name}
                        />
                        {name}
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
