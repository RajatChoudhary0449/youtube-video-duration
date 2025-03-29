import extractPlaylistId from "../utils/extractPlaylistId";

export default async function fetchIDs(link) {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const playlistId = extractPlaylistId(link);
    if (!playlistId) {
        return [[], "Invalid Link"];
    }
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    let videoIds = [];
    let nextPageToken = '';
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
            alert("Network Error");
            return [[], error];
        }
        const curdata = await response.json();
        if (!curdata || !curdata.items) return;
        const ids = curdata.items.map(item => item?.contentDetails?.videoId);
        videoIds = [...videoIds, ...ids];
        nextPageToken = curdata.nextPageToken;
    }
    while (nextPageToken);
    return [videoIds,"Good to go"];
}