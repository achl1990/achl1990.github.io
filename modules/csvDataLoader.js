// csvDataLoader.js

// csv 데이터 불러오기 함수
export function loadCSVData(url, callback) {
    d3.csv(url).then(function(data) {
        if (callback) callback(data);
        // 콘솔에서 볼 수 있음
        console.log("CSV Data:", data);
        console.log("First item:", data[0]);
        if (callback) callback(data);
    }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
    });
}

export function aggregateLocations(data) {
    const locationsMap = new Map();

    data.forEach(d => {
        const lat = parseFloat(d.lat);
        const lng = parseFloat(d.long);

        // Skip invalid entries
        if (isNaN(lat) || isNaN(lng)) return;

        const key = `${lng}-${lat}`;
        if (!locationsMap.has(key)) {
            locationsMap.set(key, {
                latLng: [lat, lng],
                entries: []
            });
        }
        locationsMap.get(key).entries.push({
            NaverName: d.NaverName,
            address: d.address,
            commentsCount: d.commentsCount,
            followersCount: d.followersCount,
            likesCount: d.likesCount,
            locationName: d.locationName,
            merged_hashtags: d.merged_hashtags,
            lattitude: d.lat,
            longitude: d.long,
            url: d.url
        });
    });

    return Array.from(locationsMap.values());
}
