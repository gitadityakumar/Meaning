import { useState, useEffect } from 'react';
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";
import { collectVideoData, setCollectionEnabled } from './content'; 
import type { VideoData } from './content';
import { getCurrentPlaytime } from './collection';
import { sendMessage } from './utils';


export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(`#end`);

export const getShadowHostId = () => "plasmo-inline-example-unique-id";

const Switch = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [currentVideoData, setCurrentVideoData] = useState<VideoData | null>(null);

const sendVideoData = async (videoData: VideoData, isFullData: boolean) => {
  try {
    const response = await sendMessage<{ status: string; data?: VideoData; message?: string }>({
      action: isFullData ? "collectAndSendVideoData" : "updateVideoPlaytime",
      videoData
    });
    if (response.status === "success") {
      console.log(isFullData ? "Video data sent successfully:" : "Playtime updated successfully:", response.data);
    } else {
      console.error(isFullData ? "Failed to send video data:" : "Failed to update playtime:", response.message);
    }
  } catch (error) {
    console.error("Error sending video data:", error);
  }
};

  // const sendCollectAndSendVideoDataMessage = async (videoData: VideoData) => {
  //   try {
  //     const response = await sendMessage<{ status: string; data?: VideoData; message?: string }>({
  //       action: "collectAndSendVideoData",
  //       videoData
  //     });
  //     if (response.status === "success") {
  //       console.log("Video data sent successfully:", response.data);
  //     } else {
  //       console.error("Failed to send video data:", response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error sending video data:", error);
  //   }
  // };

  const handleSwitchToggle = () => {
    setIsChecked(prevState => !prevState);
  };

  useEffect(() => {
    setCollectionEnabled(isChecked);
    let intervalId: number | null = null;
  
    const checkAndSendVideoData = () => {
      if (window.location.hostname === 'www.youtube.com') {
        const newVideoData = collectVideoData();
        
        if (!currentVideoData || newVideoData.url !== currentVideoData.url) {
          // New video detected, send full data
          setCurrentVideoData(newVideoData);
          sendVideoData(newVideoData, true);
        } else {
          // Same video, update playtime
          const updatedPlaytime = getCurrentPlaytime();
          if (updatedPlaytime !== null && updatedPlaytime !== currentVideoData.playtime) {
            const updatedVideoData = { ...currentVideoData, playtime: updatedPlaytime };
            setCurrentVideoData(updatedVideoData);
            sendVideoData(updatedVideoData, false);
          }
        }
      }
    };
  
    if (isChecked) {
      // Initial check
      checkAndSendVideoData();
      
      // Set up interval for periodic checks
      intervalId = window.setInterval(checkAndSendVideoData, 5000); // Check every 5 seconds
    }
  
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isChecked, currentVideoData]);

  const switchStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '34px'
  };

  const sliderStyle: React.CSSProperties = {
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

  const circleStyle: React.CSSProperties = {
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
      <input type="checkbox" checked={isChecked} onChange={handleSwitchToggle} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={sliderStyle}>
        <span style={circleStyle}></span>
      </span>
    </label>
  );
};

export default Switch;
