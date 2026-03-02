import { useState, useContext } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { chats, openChat, newChat } = useContext(Context);

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt="burger-icon"
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="plus-icon" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {chats.map((chat) => {
              return (
                <div onClick={() => openChat(chat.id)} key={chat.id} className="recent-entry">
                  <img src={assets.message_icon} alt="message-icon" />
                  <p>{chat.title.slice(0, 18)} ...</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-title">
          <img src={assets.question_icon} alt="question-icon" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-title">
          <img src={assets.history_icon} alt="history-icon" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-title">
          <img src={assets.setting_icon} alt="setting -icon" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
