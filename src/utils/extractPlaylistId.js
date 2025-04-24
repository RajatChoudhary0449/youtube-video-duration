export default function extractPlaylistId(url) {
  const regex = /https:\/\/(?:www\.)?youtube\.com\/(?:playlist\?list=|watch\?v=[^&]+&list=)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : url;
}