import { DEFAULTEND, DEFAULTSTART, VIDEOLIMIT } from "../constant/values";
import parseISO8601Duration from "../utils/parseISO8601Duration";
import roundoftime from "../utils/roundoftime";
export default async function getTimeAndDetailsFromData(data, start, end) {
  if (!data.length) return [];
  let arr = [];
  let startidx = ((start === DEFAULTSTART) ? (1) : start) - 1;
  let endidx = ((end === DEFAULTEND) ? (data.length) : end) - 1;
  let curtime = [0, 0, 0, 0], totaltime = [0, 0, 0, 0]
  for (let i = startidx; i <= endidx; i++) {
    let idx = i + 1;
    curtime = parseISO8601Duration(data[idx - 1]?.contentDetails?.duration);
    const { snippet, id: videoId } = data[idx - 1];
    for (let j = 0; j < 4; j++) {
      totaltime[j] += curtime[j];
    }
    roundoftime(totaltime);
    arr.push({ idx: idx, curtime: curtime, totaltime: [...totaltime], detail: { ...snippet, id: videoId }, id: videoId });
  }
  if (arr.length === VIDEOLIMIT) {
    alert(`Maximum video is constrained to ${VIDEOLIMIT}`);
  }
  return arr;
}