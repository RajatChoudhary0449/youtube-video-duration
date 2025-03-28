export default function divideTheTime(totaltime, factor) {
    totaltime = [...totaltime];
    const newtime = [0, 0, 0, 0];
    const rate = [24, 60, 60];
    for (let i = 0; i < 3; i++) {
        totaltime[i + 1] += Math.floor(totaltime[i] % factor) * rate[i];
        newtime[i] = Math.floor(totaltime[i] / factor);
    }
    newtime[3] = Math.floor(totaltime[3] / factor);
    for (let i = 3; i > 0; i--) {
        if (newtime[i] >= rate[i - 1]) {
            newtime[i - 1] += Math.floor(newtime[i] / rate[i - 1]);
            newtime[i] = Math.floor(newtime[i] % rate[i - 1]);
        }
    }
    return newtime;
}