export default async function fetchDetailsFromIds(videoIds) {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const videoDetails = [];
    for (let i = 0; i < videoIds.length; i += 50) {
        const slicedIds = videoIds.slice(i, i + 50).join(',');
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${slicedIds}&key=${apiKey}`;
        const videoResponse = await fetch(videoDetailsUrl);
        const videoData = await videoResponse.json();
        videoDetails.push(...videoData.items);
    }
    return [videoDetails, "Good to go"];
};