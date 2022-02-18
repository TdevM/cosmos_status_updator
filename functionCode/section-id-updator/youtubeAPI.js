const {google} = require('googleapis');
const {liveBroadcastPossibleStates} = require('./constants')
require("dotenv").config();

//LIVE - https://www.youtube.com/watch?v=1qz3dUqjxF0
// UPCOMING - https://www.youtube.com/watch?v=qlEgEunop0I
// PAST STREAM - https://www.youtube.com/watch?v=vZGlo3TqlVE
// NON LIVE VIDEO -  https://www.youtube.com/watch?v=Jp_DFHS8bzM

// Each API may support multiple versions. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.
const youtube = google.youtube({
  version: 'v3', auth: process.env.YOUTUBE_API_KEY
});

async function getBroadcastContentDetails(videoId, etag) {
  // Create custom HTTP headers for the request to enable use of eTags
  const headers = {};
  if (etag) {
    headers['If-None-Match'] = etag;
  }
  const res = await youtube.videos.list({
    part: "id,snippet,contentDetails,statistics,liveStreamingDetails", id: videoId, headers: headers,
  });
  console.log('Status code: ' + res.status);
  return res.data.items[0];
}

const computeVideoStatus = async (videoId) => {
  const broadcastDetails = await getBroadcastContentDetails(videoId)
  
  if (!broadcastDetails) {
    return
  }
  
  if (!broadcastDetails.liveStreamingDetails) {
    return
  }
  
  if (broadcastDetails.liveStreamingDetails) {
    
    if (broadcastDetails.snippet.liveBroadcastContent === 'none') {
      return liveBroadcastPossibleStates.PAST_LIVE
    }
    
    if (broadcastDetails.snippet.liveBroadcastContent === 'upcoming') {
      return liveBroadcastPossibleStates.UPCOMING
    }
    
    if (broadcastDetails.snippet.liveBroadcastContent === 'live') {
      return liveBroadcastPossibleStates.CURRENT_LIVE
    }
  }
}

module.exports = {
  computeVideoStatus
}
