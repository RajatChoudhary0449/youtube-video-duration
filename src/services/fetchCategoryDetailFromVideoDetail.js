export default async function fetchCategoryDetailFromVideoDetail(videoDetail) {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    try {
        const categoryIds = [...new Set(videoDetail.map(item => item.snippet.categoryId))].join();
        const categoryURL = `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&id=${categoryIds}&key=${apiKey}`;
        const categoryResponse = await fetch(categoryURL);
        const categorydata = await categoryResponse.json();
        const result = categorydata.items.map(item => item.snippet.title).join();
        return [result, "Good to go"];
    }
    catch (error) {
        return ["", error];
    }
}