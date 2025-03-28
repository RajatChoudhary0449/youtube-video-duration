import parseISO8601Duration from "./parseISO8601Duration";
import roundoftime from "./roundoftime";

export default function gettimefromdata(data, start, end) {
  let arr = [];
  if (!data.length) return [];
  let startidx = ((start === -1) ? (1) : start) - 1;
  let endidx = ((end === Infinity) ? (data.length) : end) - 1;
  let curtime = [0, 0, 0, 0], totaltime = [0, 0, 0, 0]
  for (let i = startidx; i <= endidx; i++) {
    let idx = i + 1;
    curtime = parseISO8601Duration(data[idx - 1]?.contentDetails?.duration);
    for (let j = 0; j < 4; j++) {
      totaltime[j] += curtime[j];
    }
    roundoftime(totaltime);
    arr.push({ idx: idx, curtime: curtime, totaltime: [...totaltime] });
  }
  return arr;
}