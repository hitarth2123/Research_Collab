import React, { useState } from "react";
import KeyIcon from "../../assets/svg/KeyIcon.jsx";
import { doChangePassword } from "../../firebase/firebaseFunctions";
import { useAuth } from "../../context/AuthContext.jsx";
import { checkIsProperPassword } from "../../helpers.js";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { login, authState, logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let { currentPassword, newPassword, confirmPassword } = e.target.elements;
      currentPassword.value = checkIsProperPassword(currentPassword.value);
      newPassword.value = checkIsProperPassword(newPassword.value);
      confirmPassword.value = checkIsProperPassword(confirmPassword.value);
      if (newPassword.value !== confirmPassword.value) {
        throw new Error("Passwords do not match");
      }
      await doChangePassword(
        authState.user.email,
        currentPassword.value,
        newPassword.value
      );
      logout();
      alert("Password changed successfully. Please login again.");
      navigate("/auth/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="d-card col-12 col-md-4 glassEffect my-4 mx-auto">
      <div className="d-card-header">
        <h2>
          <KeyIcon />
          Change Password
        </h2>
      </div>
      <div className="d-card-body">
        <form id="changepassword" onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <label htmlFor="currentPassword">Current Password:</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="newPassword">New Password:</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password:</label>
          </div>

          <div className="row">
            <div className="offset-4 col-4 mt-3">
              <button
                className="btn btn-primary col-12 py-2"
                type="submit"
                id="submit"
              >
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
