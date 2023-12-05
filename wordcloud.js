// wordcloud.js

import { loadCSVData } from './modules/csvDataLoader.js';

// 알림 및 로그 함수
function showAlertAndLog(message, log) {
    alert(message);
    if (log) console.log(log);
}

// CSV 파싱 및 전처리 함수
function prepareWordCloudData(csvData, userInput) {
    const guRow = csvData.find(row => row.gu === userInput);
    try {
        const hashtagsObj = JSON.parse(guRow.hashtags.replace(/'/g, '"'));
        return Object.entries(hashtagsObj).map(([word, frequency]) => ({ word, frequency }));
    } catch (error) {
        console.error('Error parsing hashtags data:', error);
        return null;
    }
}

function generateWordCloud(wordCloudData) {
    if (!wordCloudData) {
        console.error('No data available for word cloud.');
        return;
    }

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const layout = d3.layout.cloud()
        .size([740, 740])
        .words(wordCloudData.map(d => ({text: d.word, size: d.frequency * 10})))
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("#wordCloud").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => d.size + "px")
            .style("font-family", "Impact")
            .style("fill", (d, i) => color(i))
            .attr("text-anchor", "middle")
            .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
            .text(d => d.text)
            .transition()
            .duration(600)
            .style("opacity", 1)
            .attr("font-size", d => d.size + "px");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('generateWordCloud');
    const inputField = document.getElementById('guInput');
    let csvData;

    function handleButtonClick() {
        const userInput = inputField.value.trim();
        if (!userInput) return;

        if (csvData && csvData.some(row => row.gu === userInput)) {
            const wordCloudData = prepareWordCloudData(csvData, userInput);
            if (wordCloudData) {
                d3.select("#wordCloud svg").remove();
                generateWordCloud(wordCloudData);
            }
        } else {
            showAlertAndLog('유효하지 않은 입력입니다! 유효한 자치구를 입력하세요.', 'Invalid input: ' + userInput);
            inputField.value = '';
        }
    }

    button.addEventListener('click', handleButtonClick);
    inputField.addEventListener('keyup', event => {
        if (event.key === 'Enter') handleButtonClick();
    });

    loadCSVData('https://raw.githubusercontent.com/achl1990/Trendy-Instagram-Spot-Visualization/main/data/seonal_heatmap.csv', data => {
        csvData = data;
    });
});
