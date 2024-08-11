async function authenticateUser(): Promise<string | null> {
  try {
    const response = await fetch('http://localhost:3002/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // We're not sending a key, so the body can be empty
      body: JSON.stringify({"key":"ADI"})
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Authentication response:', data);
      if (data.userData) {
        // The userData field contains the user ID string
        return data.userData;
      } else {
        console.log('No user data in response');
        return null;
      }
    } else {
      console.log('Authentication failed:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

async function sendVideoDataToBackend(videoData: any, userId: string) {
  try {
    const response = await fetch('http://localhost:3002/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...videoData, userId })
    });
    const rawText = await response.text(); // Get the raw response text
    console.log('Raw response text:', rawText); // Log the raw response
    try {
      const data = JSON.parse(rawText); // Try to parse the JSON
      console.log('Video data sent successfully:', data);
      return data;
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return { status: 'error', message: 'Invalid JSON response from server' };
    }
  } catch (error) {
    console.error('Error sending video data:', error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "authenticate") {
    authenticateUser().then(userId => {
      sendResponse({ userId: userId });
    });
    return true; // Indicates that the response is sent asynchronously
  }

  if (message.action === "collectAndSendVideoData") {
    const videoData = message.videoData;
    const userId = message.userId;
    
    if (!userId) {
      console.log('Collecting data without user ID');
    }

    sendVideoDataToBackend(videoData, userId || 'anonymous')
      .then((data) => sendResponse({ status: "success", data: data }))
      .catch((error) => sendResponse({ status: "error", message: error.message }));

    return true;
  }
});