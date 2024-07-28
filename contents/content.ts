// content.ts

// Function to get the current YouTube video URL
export function getCurrentVideoUrl(): string {
  return window.location.href;
}

// Function to get the current playtime
export function getCurrentPlaytime(): number | null {
  const video = document.querySelector('video');
  return video ? video.currentTime : null;
}

// Function to get the current channel name
export function getChannelName(): string | null {
  const ownerDiv = document.getElementById('owner');
  if (!ownerDiv) {
      console.error("Owner div not found");
      return null;
  }

  const anchorTag = ownerDiv.querySelector('a[href*="/@"]');
  if (!anchorTag) {
      console.error("Channel anchor tag not found");
      return null;
  }

  const href = anchorTag.getAttribute('href') ?? '';
  const channelName = href.split('/@')[1] || '';
  
  return channelName || null;
}

// Function to collect video data
export function collectVideoData() {
  return {
      url: getCurrentVideoUrl(),
      playtime: getCurrentPlaytime(),
      channelName: getChannelName()
  };
}


