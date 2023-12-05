// mapInit.js

// 지도를 초기화하고 리플렛 map 인스턴스를 리턴함.
export function initializeMap() {
    const map = L.map('map').setView([37.5665, 126.9780], 10.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    return map;
}

// 지도에 SVG 요소를 추가하고 그룹화된 오브젝트를 리턴함.
export function addSVGToMap(map) {
    const svg = d3.select(map.getPanes().overlayPane).append("svg").attr('pointer-events', 'auto');
    const g = svg.append("g").attr("class", "leaflet-zoom-hide");
    return { svg, g };
}

// MarkerCluster 그룹 초기화
export function initializeMarkerCluster(map, locations) {
    const markerClusterGroup = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            // Get the number of items in the cluster
            var count = cluster.getChildCount();

            // Create a new divIcon with the Instagram image as the background
            return L.divIcon({
                html: '<div style="background-size:cover;background-image:url(https://github.com/achl1990/Trendy-Instagram-Spot-Visualization/raw/main/data/Instagram_icon.png);width: 50px; height: 50px; border-radius: 50%; position: relative; display: flex; justify-content: center; align-items: center;"><span style="color: white;">' + count + '</span></div>',
                className: '',
                iconSize: L.point(50, 50) // Set the size of the icon
            });
        }
    });

    locations.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude]);
        const popupContent = createPopupContent(location);
        marker.bindPopup(popupContent); // Bind the popup once

        // Attach click event listener to marker
        marker.on('click', function() {
            marker.openPopup(); // Just open the popup on click
        });

        markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);
    return markerClusterGroup;
}