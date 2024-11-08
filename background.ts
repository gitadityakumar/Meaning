let storedUserId: string | null = null;

import { API_ENDPOINT, sign_up } from "~contents/config";

// Initialize storedUserId from chrome.storage.local when the background script starts
chrome.storage.local.get("storedUserId", (data) => {
  storedUserId = data.storedUserId || null;
});

async function authenticateUser(providedUserId?: string) {
  if (providedUserId) {
    // Store the provided userId in chrome.storage.local and update storedUserId
    await chrome.storage.local.set({ storedUserId: providedUserId });
    storedUserId = providedUserId;
    // console.log("bg.ts***User ID set from popup:", providedUserId);
    return providedUserId;
  }

  // If userId already exists, return it without making an API call
  if (storedUserId) {
    // console.log("bg.ts***User ID retrieved from storage:", storedUserId);
    return storedUserId;
  }

  // If there's no userId, return null
  return null;
}

async function sendVideoDataToBackend(videoData: any, userId?: string) {
  try {
    // Use userId or fetch storedUserId from chrome.storage.local if not provided
    if (!userId) {
      const data = await chrome.storage.local.get("storedUserId");
      userId = data.storedUserId || "anonymous";
    }

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...videoData, userId }),
    });

    const rawText = await response.text();
    // console.log("Raw response text:", rawText);
    try {
      const data = JSON.parse(rawText);
      // console.log("Video data sent successfully:", data);
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return { status: "error", message: "Invalid JSON response from server" };
    }
  } catch (error) {
    console.error("Error sending video data:", error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "authenticate") {
    const providedUserId = message.userId;
    authenticateUser(providedUserId).then((userId) => {
      sendResponse({ userId: userId, status: "success" });
    });
    return true; // Keeps the message channel open for async response
  }

  if (message.action === "collectAndSendVideoData") {
    const videoData = message.videoData;
    const userId = message.userId || storedUserId;

    sendVideoDataToBackend(videoData, userId)
      .then((data) => sendResponse({ status: "success", data: data }))
      .catch((error) => sendResponse({ status: "error", message: error.message }));

    return true; // Keeps the message channel open for async response
  }
});
