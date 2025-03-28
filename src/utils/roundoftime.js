export default function roundoftime(time) {
    const rate = [24, 60, 60];
    for (let i = 3; i > 0; i--) {
      if (time[i] >= rate[i - 1]) {
        time[i - 1] += Math.floor(time[i] / rate[i - 1]);
        time[i] = Math.floor(time[i] % rate[i - 1]);
      }
    }
  }