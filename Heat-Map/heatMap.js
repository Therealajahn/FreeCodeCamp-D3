let padding = 40;
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

let numberToMonth = {
  0: "December",
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
};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    data = json;
    filterData(json);
    createAxes();
    // createToolTips();
    // createDots();
    // createLegend();
  });

function filterData(json) {
  console.log(json);
  let baseTemperature = json.baseTemperature;
  data = json.monthlyVariance;

  data.forEach((d) => {
    yearList.push(d.year);
    monthList.push(d.month);
    heatList.push(baseTemperature - d.variance);
  });

  xScale = d3.scaleLinear().domain(d3.extent(yearList)).range([0, padWidth]);
  yScale = d3
    .scaleLinear()
    .domain([d3.extent(monthList)])
    .range([0, padHeight]);
  colorScale = d3
    .scaleLinear()
    .domain(d3.extent(heatList))
    .range([])
    .interpolate(d3.interpolateSpectral);
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
  let yAxis = d3.axisLeft(yScale);
  canvas
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},${padding})`)
    .call(yAxis);
}
