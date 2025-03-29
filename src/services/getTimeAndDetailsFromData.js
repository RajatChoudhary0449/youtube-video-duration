import parseISO8601Duration from "../utils/parseISO8601Duration";
import roundoftime from "../utils/roundoftime";
const apiKey = import.meta.env.VITE_APP_API_KEY;
const generateConcatenatedString = (arr) => {
  return arr.join();
}
export default async function getTimeAndDetailsFromData(data, start, end) {
  let arr = [];
  let details = [];
  if (!data.length) return [];
  let startidx = ((start === -1) ? (1) : start) - 1;
  let endidx = ((end === Infinity) ? (data.length) : end) - 1;
  let curtime = [0, 0, 0, 0], totaltime = [0, 0, 0, 0]
  let videoIds = [];
  for (let i = startidx; i <= endidx; i++) {
    let idx = i + 1;
    curtime = parseISO8601Duration(data[idx - 1]?.contentDetails?.duration);
    videoIds.push(data[idx - 1]?.id);
    for (let j = 0; j < 4; j++) {
      totaltime[j] += curtime[j];
    }
    roundoftime(totaltime);
    arr.push({ idx: idx, curtime: curtime, totaltime: [...totaltime] });
  }
  for (let i = 0; i < videoIds.length; i += 50) {
    let slicedvideoIds = videoIds.slice(i, i + 50);
    const getString = generateConcatenatedString(slicedvideoIds);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${getString}&key=${apiKey}`;
    const response = await fetch(url);
    const data2 = await response.json();
    details = details.concat(data2.items.map(item => item.snippet));
  }
  arr = arr.map((val, index) => ({ ...val, detail: details[index] }));
  return arr;
}