import { VIDEOLIMIT } from "../constant/values";
import extractPlaylistId from "../utils/extractPlaylistId";
import toastNotification from "../utils/toastNotification";
export default async function fetchIDs(link,percentage,setPercentage) {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const playlistId = extractPlaylistId(link);
    if (!playlistId) {
        return [[], "Invalid Link"];
    }
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    let videoIds = [];
    let nextPageToken = '';
    let notify=false;
    do {
        let response;
        try {
            response = await fetch(playlistItemsUrl + (nextPageToken ? `&pageToken=${nextPageToken}` : ''));
            if (!response.ok) {
                if (response.status === 404) {
                    return [[], "Playlist not found."];
                }
                return [[], `${response.status} error`];
            }
        }
        catch (error) {
            console.log(error);
            toastNotification("Network Error");
            return [[], error];
        }
        const curdata = await response.json();
        if (!curdata || !curdata.items) return;
        const ids = curdata.items.map(item => item?.contentDetails?.videoId);
        videoIds = [...videoIds, ...ids];
        nextPageToken = curdata.nextPageToken;
        setPercentage(p=>p+(40*50/VIDEOLIMIT));//Percentage to cover * Each request fetched videos/Total Videos
        // if(videoIds.length>=VIDEOLIMIT/2 && !notify)
        // {
        //     toastNotification(`Please wait as already ${VIDEOLIMIT/4} videos are already fetched`,"info");
        //     notify=true;
        // }
    }
    while (nextPageToken && videoIds.length < VIDEOLIMIT);
    videoIds = videoIds.slice(0, VIDEOLIMIT);
    return [videoIds, "Good to go"];
}