import { useState, type CSSProperties, useEffect } from 'react';
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import { collectVideoData } from '../contents/content';

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(`#end`);

export const getShadowHostId = () => "plasmo-inline-example-unique-id";

const Switch = () => {
  const [isChecked, setIsChecked] = useState(false);

  const sendCollectAndSendVideoDataMessage = () => {
    const videoData = collectVideoData();
    console.log("Collected video data:", videoData);

    chrome.runtime.sendMessage({ action: "collectAndSendVideoData", videoData }, response => {
      if (response.status === "success") {
        console.log("Video data sent successfully:", response.data);
      } else {
        console.error("Failed to send video data:", response.message);
      }
    });
  };

  useEffect(() => {
    if (isChecked) {
      sendCollectAndSendVideoDataMessage();
    }
  }, [isChecked]);

  const toggleSwitch = () => {
    setIsChecked(prevState => !prevState);
  };

  const switchStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '34px'
  };

  const sliderStyle: CSSProperties = {
    position: 'absolute',
    cursor: 'pointer',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: isChecked ? '#666666' : '#ccc',
    transition: '0.4s',
    borderRadius: '34px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
  };

  const circleStyle: CSSProperties = {
    position: 'absolute',
    height: '26px',
    width: '26px',
    left: isChecked ? '24px' : '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '0.4s',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  return (
    <label style={switchStyle}>
      <input type="checkbox" checked={isChecked} onChange={toggleSwitch} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={sliderStyle}>
        <span style={circleStyle}></span>
      </span>
    </label>
  );
};

export default Switch;
