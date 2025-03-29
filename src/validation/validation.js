export default function validation(start, end, link) {
    if (end < start) {
        return [false, "End cannot be set less than start"];
    }
    if (!link.length) {
        return [false, "Link cannot be left empty"];
    }
    return [true, "Good to go"];
}