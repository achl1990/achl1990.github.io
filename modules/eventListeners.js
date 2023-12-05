//eventListeners.js

import { updatePathColors, updatePathHeat} from './geoJSONLoader.js';
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
            const season_information1 = 'overall'
            updatePathHeat(g, season_information1);
            seasonSelect.addEventListener('change', function() {
                if (seasonSelect.value === 'overall'){
                    const season_information1 = 'overall'
                    updatePathHeat(g, season_information1);
                } else if (seasonSelect.value === 'spring'){
                    const season_information2 = 'spring'
                    updatePathHeat(g, season_information2);
                } else if (seasonSelect.value === 'summer'){
                    const season_information3 = 'summer'
                    updatePathHeat(g, season_information3);
                } else if (seasonSelect.value === 'fall'){
                    const season_information4 = 'fall'
                    updatePathHeat(g, season_information4);
                } else if (seasonSelect.value === 'winter'){
                    const season_information5 = 'winter'
                    updatePathHeat(g, season_information5);
                } else{

                }
            })

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
