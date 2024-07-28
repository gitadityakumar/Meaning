// Function to send video data to the backend
async function sendVideoDataToBackend(videoData: any) {
  try {
      const response = await fetch('http://localhost:3000/url', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(videoData)
      });
      const data = await response.json();
      console.log('Success:', data);
  } catch (error) {
      console.error('Error:', error);
  }
}

// Listener for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "collectAndSendVideoData") {
      const videoData = message.videoData;
      sendVideoDataToBackend(videoData)
        .then(() => sendResponse({ status: "success", data: videoData }))
        .catch((error) => sendResponse({ status: "error", message: error.message }));

      // Return true to indicate that the response is sent asynchronously
      return true;
  }
});
