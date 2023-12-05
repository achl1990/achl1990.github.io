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
    
    g.selectAll("text")
        .text(d => d.properties.SIG_KOR_NM)
}


export function updatePathHeat(g, season_info) {
    // 빨강 함수
    function interpolateRedsWithOpacity(value1, value2, opacity_default) {
        // Ensure the value is within the range [0, 1]
        var clampedValue = Math.max(0, Math.min(1, 1.2*value1/value2));
        // Use D3's interpolateReds function to get the color
        var color = d3.interpolateReds(clampedValue);
        // Combine the color with the specified opacity
        var opacity = opacity_default + value1/value2/2
        return d3.color(color).copy({opacity});
    }
    
    // gu_count_access Data
    const gu_count_access = {
        '강남구' : {'spring':40,'summer':56,'fall':71,'winter':62,'overall':229},
        '강동구' : {'spring':5,'summer':2,'fall':2,'winter':1,'overall':10},
        '강북구' : {'spring':4,'summer':3,'fall':4,'winter':6,'overall':17},
        '강서구' : {'spring':25,'summer':8,'fall':5,'winter':7,'overall':45},
        '관악구' : {'spring':4,'summer':3,'fall':9,'winter':4,'overall':20},
        '광진구' : {'spring':16,'summer':24,'fall':12,'winter':7,'overall':59},
        '구로구' : {'spring':1,'summer':3,'fall':1,'winter':1,'overall':6},
        '금천구' : {'spring':2,'summer':3,'fall':10,'winter':3,'overall':18},
        '노원구' : {'spring':4,'summer':6,'fall':6,'winter':2,'overall':18},
        '도봉구' : {'spring':0,'summer':1,'fall':1,'winter':0,'overall':2},
        '동대문구' : {'spring':11,'summer':1,'fall':5,'winter':3,'overall':20},
        '동작구' : {'spring':8,'summer':1,'fall':6,'winter':3,'overall':18},
        '마포구' : {'spring':68,'summer':67,'fall':79,'winter':43,'overall':257},
        '서대문구' : {'spring':13,'summer':5,'fall':5,'winter':6,'overall':29},
        '서초구' : {'spring':53,'summer':37,'fall':24,'winter':17,'overall':131},
        '성동구' : {'spring':109,'summer':76,'fall':73,'winter':30,'overall':288},
        '성북구' : {'spring':5,'summer':7,'fall':6,'winter':2,'overall':20},
        '송파구' : {'spring':74,'summer':31,'fall':63,'winter':47,'overall':215},
        '양천구' : {'spring':1,'summer':0,'fall':1,'winter':0,'overall':2},
        '영등포구' : {'spring':45,'summer':37,'fall':79,'winter':38,'overall':199},
        '용산구' : {'spring':62,'summer':77,'fall':90,'winter':58,'overall':287},
        '은평구' : {'spring':10,'summer':3,'fall':4,'winter':12,'overall':29},
        '종로구' : {'spring':90,'summer':70,'fall':99,'winter':106,'overall':365},
        '중구' : {'spring':42,'summer':45,'fall':80,'winter':63,'overall':230},
        '중랑구' : {'spring':12,'summer':3,'fall':4,'winter':3,'overall':22}
    };

    const season_max = {
        'spring': 109,
        'summer': 77,
        'fall': 99,
        'winter': 106,
        'overall': 365
        };
    
    const season_total ={
        'spring': 704,
        'summer': 569,
        'fall': 739,
        'winter': 524,
        'overall': 2536
    }

    var denom_max = season_max[season_info];
    var denom_total = season_total[season_info];

    function convertToPercentage(number) {
        // 입력된 숫자가 0과 1 사이에 있는지 확인
        if (number >= 0 && number <= 1) {
            // 숫자를 퍼센트로 변환하여 반환
            return (number * 100).toFixed(2) + '%';
        } else {
            // 범위를 벗어난 경우 에러 메시지 반환
            return '입력된 숫자는 0부터 1까지어야 합니다.';
        }
    };
    

    g.selectAll("path")
        .attr("fill", (d) => interpolateRedsWithOpacity(gu_count_access[d.properties.SIG_KOR_NM][season_info],denom_max,0.5))

    
    g.selectAll("text")
        .style("font-size", "12px")
        .style("font-family", "Hanna, sans-serif")
        .text(d => `${d.properties.SIG_KOR_NM}`+'\n'+`${convertToPercentage(gu_count_access[d.properties.SIG_KOR_NM][season_info]/denom_total)}`);
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