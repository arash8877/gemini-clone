import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <img className="menu" src={assets.menu_icon} alt="burger-icon" />
        <div className="new-chat">
          <img src={assets.plus_icon} alt="plus-icon" />
          <p>New chat</p>
        </div>
        <div className="recent">
            <p className="recent-title">Recent</p>
            <div className="recent-entry">
                <img src={assets.message_icon} alt="message-icon" />
                <p>What is react ...</p>
            </div>
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-item recent-title">
            <img src={assets.question_icon} alt="question-icon" />
            <p>Help</p>
        </div>
        <div className="bottom-item recent-title">
            <img src={assets.history_icon} alt="history-icon" />
            <p>Activity</p>
        </div>
        <div className="bottom-item recent-title">
            <img src={assets.setting_icon} alt="setting -icon" />
            <p>Settings</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
