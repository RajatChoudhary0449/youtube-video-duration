import toastNotification from "../utils/toastNotification";

export default async function fetchChannelDetail(channelId) {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        const newobj = data.items.map(item => ({ ...item.snippet, ...item.statistics }));
        return [newobj, true];
    }
    catch (error) {
        toastNotification(error, "error");
        return [{}, false];
    }
}