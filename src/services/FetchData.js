import extractPlaylistId from "../utils/extractPlaylistId";

export const FetchData = async (link) => {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const playlistId = extractPlaylistId(link);
    if (!playlistId) {
        return [[]];
    }
    const playlistItemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
    const videoIds = [];
    let nextPageToken = '';
    if (link === "") {
        return [[]];
    }
    do {
        let response;
        try {
            response = await fetch(playlistItemsUrl + (nextPageToken ? `&pageToken=${nextPageToken}` : ''));
            if (!response.ok) {
                if (response.status === 404) {
                    console.error("Playlist not found.");
                    return [[], "", ""];
                }
                return [[], "", ""];
            }
        }
        catch (error) {
            console.log(error);
            alert("Network Error");
            return [[]];
        }
        const curdata = await response.json();
        if (!curdata || !curdata.items) return;
        curdata.items.forEach(item => {
            videoIds.push(item.contentDetails.videoId);
        });
        nextPageToken = curdata.nextPageToken;
    }
    while (nextPageToken);
    const videoDetails = [];
    for (let i = 0; i < videoIds.length; i += 50) {
        const batchIds = videoIds.slice(i, i + 50).join(',');
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batchIds}&key=${apiKey}`;
        const videoResponse = await fetch(videoDetailsUrl);
        const videoData = await videoResponse.json();
        videoDetails.push(...videoData.items);
    }
    return [videoDetails];
};