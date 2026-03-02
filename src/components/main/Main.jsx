import "./Main.css";
import { Fragment, useContext, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    activeTurns,
    pendingPrompt,
    showResult,
    loading,
    setInput,
    input,
    retrySecondsLeft,
  } = useContext(Context);

  const resultContainerRef = useRef(null);

  useEffect(() => {
    if (!showResult || !resultContainerRef.current) return;

    const frameId = requestAnimationFrame(() => {
      resultContainerRef.current.scrollTo({
        top: resultContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeTurns, pendingPrompt, loading, showResult]);

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
          <div className="result" ref={resultContainerRef}>
            {activeTurns.map((turn, index) => (
              <Fragment key={`${turn.prompt}-${index}`}>
                <div className="result-title">
                  <div className="user-icon-container">
                    <img className="user-icon" src={assets.user_icon} alt="user-icon" />
                  </div>
                  <p>{turn.prompt}</p>
                </div>
                <div className="result-data">
                  <img src={assets.gemini_icon} alt="gemini-icon" />
                  <p dangerouslySetInnerHTML={{ __html: turn.response }}></p>
                </div>
              </Fragment>
            ))}

            {loading && pendingPrompt ? (
              <>
                <div className="result-title">
                  <div className="user-icon-container">
                    <img className="user-icon" src={assets.user_icon} alt="user-icon" />
                  </div>
                  <p>{pendingPrompt}</p>
                </div>
                <div className="result-data">
                  <img src={assets.gemini_icon} alt="gemini-icon" />
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() && retrySecondsLeft === 0) {
                  e.preventDefault();
                  onSent();
                }
              }}
              value={input}
              type="text"
              placeholder="Enter a prompt"
            />
            <div>
              <img src={assets.gallery_icon} alt="gallery-icon" />
              <img src={assets.mic_icon} alt="mic-icon" />
              {input ? (
                <img
                  onClick={retrySecondsLeft === 0 ? () => onSent() : undefined}
                  src={assets.send_icon}
                  alt="send-icon"
                  style={{
                    opacity: retrySecondsLeft > 0 ? 0.5 : 1,
                    cursor: retrySecondsLeft > 0 ? "not-allowed" : "pointer",
                  }}
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            {retrySecondsLeft > 0
              ? `Rate limit reached. Please wait ${retrySecondsLeft}s before retrying.`
              : "Gemini may give inaccurate information, so double-check responses. Your feedback makes Gemini Apps more helpful and safe."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
