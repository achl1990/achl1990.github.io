// util.js

// 자치구 컬러맵
export const colorMapping = [
    "#FFD700", "#C0C0C0", "#008000", "#800000", "#000080",
    "#FF4500", "#2E8B57", "#A0522D", "#FFC0CB", "#87CEEB",
    "#FFA07A", "#708090", "#FFFACD", "#FF6347", "#6A5ACD",
    "#20B2AA", "#FF69B4", "#DC143C", "#32CD32", "#BA55D3",
    "#F08080", "#4682B4", "#9ACD32", "#40E0D0", "#FF8C00"
];

// HEX 색상 코드를 지정된 opacity의 RGBA 문자열로 변환함.
export function hexToRGBA(hex, opacity) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}