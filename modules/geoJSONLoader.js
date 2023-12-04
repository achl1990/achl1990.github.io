// geoJSONLoader.js

// GeoJSON 데이터를 불러오고 처리하는 함수
export function loadAndProcessGeoJSON(map, g, svg) {
    // 지도 좌표를 SVG 좌표로 변환하는 함수
    function projectPoint(x, y) {
        const point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    // D3 지오 변환 및 경로 설정
    const transform = d3.geoTransform({ point: projectPoint });
    const path = d3.geoPath().projection(transform);
 
    // 서울 지역 GeoJSON 데이터 불러오기
    d3.json('https://raw.githubusercontent.com/achl1990/Trendy-Instagram-Spot-Visualization/main/data/Seoul_Gu.topojson').then(function (seoulData) {
        const seoulGeoJSON = topojson.feature(seoulData, seoulData.objects.Seoul_Gu);
        drawGeoJSONPaths(seoulGeoJSON, g, path);
        map.on("moveend", () => updateMapElements(seoulGeoJSON, g, path, svg));
        updateMapElements(seoulGeoJSON, g, path, svg);
    });
}

// GeoJSON 데이터를 기반으로 지도에 그리기
function drawGeoJSONPaths(geoJsonData, g, path) {
    // 지역구 그리기
    g.selectAll("path")
        .data(geoJsonData.features)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke", "#808080")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

    // 텍스트 라벨
    g.selectAll("text")
        .data(geoJsonData.features)
        .enter().append("text")
        .attr("class", "text-label")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1])
        .text(d => d.properties.SIG_KOR_NM);
}

export function updatePathColors(g, getColor) {
    // getColor에 따라 채우기
    g.selectAll("path")
        .attr("fill", (d, i) => getColor(d, i));
}

// 지도 요소 업데이트 함수
function updateMapElements(geoJsonData, g, path, svg) {
    // 경로 및 텍스트 위치 업데이트
    g.selectAll("path").attr("d", path);
    g.selectAll("text")
        .attr("x", d => path.centroid(d)[0])
        .attr("y", d => path.centroid(d)[1]);

    // SVG 크기 및 위치 조정
    const bounds = path.bounds(geoJsonData),
        topLeft = bounds[0],
        bottomRight = bounds[1];

    svg.attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
}