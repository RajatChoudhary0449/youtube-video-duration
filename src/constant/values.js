const isMobile = window.innerWidth <= 768;
export const DEFAULTSTART = -1;
export const DEFAULTEND = Infinity;
export const VIDEOLIMIT = 500;
export const DEFAULTCOLS=isMobile?["Index","Thumbnail","Duration"]:["Index", "Title", "Thumbnail", "Duration", "Published Date", "Action"];
export const ALLCOLS=["Index", "Title", "Thumbnail", "Duration", "Published Date", "Action", "Views", "Likes", "Comment Count"];
export const DEFAULTOFFSETS=isMobile?5:10;