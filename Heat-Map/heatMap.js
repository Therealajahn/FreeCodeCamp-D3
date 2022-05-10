let padding = 60;
let radius = 6;
let width = 1100;
let height = 500;
let padWidth = width - padding * 2;
let padHeight = height - padding * 2;

let data = [];
let yearList = [];
let monthList = [];
let heatList = [];

let xScale;
let yScale;
let colorScale;
let tooltip;

const numberToMonth = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};
//prettier-ignore

const canvasOverlay = d3
  .select("#canvas-wrapper")
  .append("div")
  .attr("id", "canvas-overlay")

const canvas = d3
  .select("#canvas-wrapper")
  .append("svg")
  .attr("id", "canvas")
  .attr("width", `${width}`)
  .attr("height", `${height}`);

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    data = json;
    filterData(json);
    createAxes();
    // createToolTips();
    createRects();
    // createLegend();
  });

function filterData(json) {
  console.log(json);
  let baseTemperature = json.baseTemperature;
  data = json.monthlyVariance;

  data.forEach((d) => {
    yearList.push(d.year);
    monthList.push(d.month % 12);
    heatList.push(baseTemperature - d.variance);
  });

  xScale = d3.scaleLinear().domain(d3.extent(yearList)).range([0, padWidth]);
  yScale = d3.scaleBand().domain(monthList).range([0, padHeight]);

  colorScale = d3.scaleLinear().domain(d3.extent(heatList)).range([0, 1]);
}

function createAxes() {
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => d)
    .ticks(10);
  canvas
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${padding},${height - padding})`)
    .call(xAxis);
  let yAxis = d3.axisLeft(yScale).tickFormat((d, i) => numberToMonth[i + 1]);
  canvas
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},${padding})`)
    .call(yAxis);
}

// function createToolTips(){
// }

function createRects() {
  const rect = canvas
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", (d) => d.year)
    .attr("data-month", (d, i) => monthList[i])
    .attr("data-temp", (d, i) => heatList[i])
    .attr("height", `${padHeight / 12}`)
    .attr("width", `${padWidth / (data.length / 12)}`)
    .attr("x", (d) => xScale(d.year) + padding)
    .attr("y", (d, i) => yScale(monthList[i]) + padding)
    .attr("fill", (d, i) => d3.interpolateSpectral(colorScale(heatList[i])));
}
