import "./Main.css";
import { useContext } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } =
    useContext(Context);

  return (
    <div className="main">
      <div className="nav">
        <p>ArashGemini</p>
        <div className="user-icon-container">
          <img className="user-icon" src={assets.user_icon} alt="user-icon" />
        </div>
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="green">
              <p>
                <span>Welcome to ArashGemini.</span>
              </p>
              <p>How can I help you?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>What is the virtual DOM in React.js?</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>What’s the weather like in Copenhagen today?</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>How do I create a moment worth remembering every single day?</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Debug and optimize the code snippet below?</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <div className="user-icon-container">
                <img className="user-icon" src={assets.user_icon} alt="user-icon" />
              </div>
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="gemini-icon" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} alt="gallery-icon" />
              <img src={assets.mic_icon} alt="mic-icon" />
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} alt="send-icon" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may give inaccurate information, so double-check responses. Your feedback makes
            Gemini Apps more helpful and safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
