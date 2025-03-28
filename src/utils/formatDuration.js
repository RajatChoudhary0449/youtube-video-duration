export default function formatDuration(time) {
    const [days, hours, minutes, remainingSeconds] = time;
    if (time[0]) return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
    else return `${hours}h ${minutes}m ${remainingSeconds}s`;
}