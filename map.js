import { initializeMap, addSVGToMap, initializeMarkerCluster } from './modules/mapInit.js';
import { setupLayerToggle, setupHeatmapToggle, setupHotPlacesToggle } from './modules/eventListeners.js';
import { loadAndProcessGeoJSON } from './modules/geoJSONLoader.js';
import { aggregateLocations, loadCSVData } from './modules/csvDataLoader.js';

// 초기화
const map = initializeMap();
const { svg, g } = addSVGToMap(map);
const markerClusterGroup = initializeMarkerCluster(map, []);

// 토글 세팅
setupLayerToggle(svg);
setupHeatmapToggle(svg);
loadAndProcessGeoJSON(map, g, svg);

// CSV 데이터 불러오기 및 뭉치기
loadCSVData('https://raw.githubusercontent.com/achl1990/Trendy-Instagram-Spot-Visualization/main/data/insta_data_cleaned_2.csv', function(rawData) {
    const aggregatedData = aggregateLocations(rawData);
    updateMarkerClusterGroup(aggregatedData);
});

const sharedPopup = L.popup();

// markerCluster group 업데이터
function updateMarkerClusterGroup(aggregatedData) {
    markerClusterGroup.clearLayers();

    aggregatedData.forEach(location => {
        const lat = parseFloat(location.latLng[1]); // Latitude
        const lng = parseFloat(location.latLng[0]); // Longitude

        if (isNaN(lat) || isNaN(lng)) {
            console.error('Invalid location data:', location);
            return;
        }

        const marker = L.marker([lat, lng]);
        marker.on('click', () => {
            const popupContent = createPopupContent(location);
            sharedPopup.setContent(popupContent);
            sharedPopup.setLatLng(marker.getLatLng());
            sharedPopup.openOn(map);
        });
        markerClusterGroup.addLayer(marker);
    });
    setupHotPlacesToggle(map, markerClusterGroup);
}

function createPopupContent(locationData) {
    let totalComments = locationData.entries.reduce((sum, entry) => sum + parseInt(entry.commentsCount, 10), 0);
    let isPopularSpot = totalComments > 100;
    let totalThreads = locationData.entries.length;

    // Assuming all entries have the same name and address
    let firstEntry = locationData.entries[0];
    let content = `
        <div class="popup-content">
            <h4>${firstEntry.NaverName}</h4>
            <p>주소: ${firstEntry.address}</p>
            <p>총 게시글 수: ${totalThreads}</p>
            <p>총 댓글 수: ${totalComments}</p>
    `;

    if (isPopularSpot) {
        content += `<div class="popular-spot-note">인기가 많은 곳이에요!</div>`;
    }

    content += `<div class="instagram-links" style="max-height: 150px; overflow-y: auto;"><ul>`;
    locationData.entries.forEach(entry => {
        content += `<li><a href="${entry.url}" target="_blank">이 장소를 인스타그램에서 보기!</a></li>`;
    });
    content += '</ul></div>';

    content += '</div>';
    return content;
}
