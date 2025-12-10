import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const notificationClass = `notification notification-${type}`;
  const progressBarClass = `notification-progress notification-progress-${type}`;
  const iconClass =
    type === "success"
      ? "fa-solid fa-check-circle"
      : type === "error"
      ? "fa-solid fa-times-circle"
      : "fa-solid fa-exclamation-circle";

  return (
    <div className={notificationClass}>
      <div className={progressBarClass}></div>
      <div className="notification-content">
        <i className={iconClass}></i>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
