//eventListeners.js

import { updatePathColors} from './geoJSONLoader.js';
import { colorMapping, hexToRGBA } from './util.js';

// 자치구 컬러링 함수
function getColorForDistrict(d, i) {
    return hexToRGBA(colorMapping[i % colorMapping.length], 0.5);
}

// 자치구 레이어 토글 함수
function toggleLayer(svg, isVisible) {
    svg.style("display", isVisible ? "block" : "none");
}

// 핫플표시 레이어 토글 함수
function toggleHotPlaces(map, markerClusterGroup, isVisible) {
    if (isVisible) {
        markerClusterGroup.addTo(map);
    } else {
        markerClusterGroup.remove();
    }
}

// 히트맵 레이어 토글 함수
function toggleHeatmap(svg, isVisible) {
    svg.style("display", isVisible ? "block" : "none");
}

// 자치구 레이어 셋업 함수
export function setupLayerToggle(g) {
    const layerToggle = document.getElementById('layerToggle');
    layerToggle.checked = false;

    layerToggle.addEventListener('change', function (e) {
        toggleLayer(g, e.target.checked);
        if (e.target.checked) {
            updatePathColors(g, getColorForDistrict); 
        }
    });

    // 자치구 레이어 토글 초기화
    toggleLayer(g, layerToggle.checked);
}

// 핫플 마커 셋업 함수
export function setupHotPlacesToggle(map, markerClusterGroup) {
    const hotplacesToggle = document.getElementById('hotplacesToggle');
    hotplacesToggle.checked = false;  // Set the initial state of the checkbox if needed

    // Toggle event listener
    hotplacesToggle.addEventListener('change', function () {
        toggleHotPlaces(map, markerClusterGroup, this.checked);
    });

    // Initialize hot places based on the checkbox state
    toggleHotPlaces(map, markerClusterGroup, hotplacesToggle.checked);
}

// 히트맵 레이어 셋업 함수
export function setupHeatmapToggle(g) {
    const heatmapToggle = document.getElementById('heatmapToggle');
    const seasonSelect = document.getElementById('seasonSelect');
    const seasonSliderContainer = document.getElementById('season-slider-container');

    heatmapToggle.checked = false;

    heatmapToggle.addEventListener('change', function() {
        toggleHeatmap(g, this.checked);
        seasonSelect.disabled = !this.checked;

        if (this.checked) {
            updatePathColors(g, getColorForDistrict); // 여기서 getColorForDistrict 대신 히트맵컬러링 function으로 하시면 됩니다.
            //현재는 위랑 같이 GetColorFOrDistrict로 그냥 자치구 채우는 function이 들어가 있는 상태입니다.
        } else {
            // 다른경우들 추가할 필요가 있으면 할것.
        }

        // 히트맵 체크 풀릴시 드롭다운 전체로 바꾸기
        seasonSelect.value = 'overall';
        toggleSliderVisibility();
    });

    seasonSelect.addEventListener('change', toggleSliderVisibility);

    function toggleSliderVisibility() {
        seasonSliderContainer.classList.toggle('visible', heatmapToggle.checked && seasonSelect.value === 'bySeason');
    }

    // 히트맵 토글 초기화
    toggleHeatmap(g, heatmapToggle.checked);
    toggleSliderVisibility();
}