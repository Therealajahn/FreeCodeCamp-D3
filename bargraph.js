let w = 1000;
let h = 600;
let padding = 50;
let xScale;
let yScale;
let xValues;
let yValues;
let dataset;

let title = d3
  .select("body")
  .append("svg")
  .attr("id", "title")
  .attr("height", h)
  .attr("width", w)
  .style("background-color", "#d9ffff");

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    filterYears(json["data"]);
    createScales();
    createAxes();
    createBars();
  });

function filterYears(rawData) {
  let parseDate = d3.timeParse("%Y-%m-%d");

  xValues = Object.values(rawData).map((array) => parseDate(array[0]));
  yValues = Object.values(rawData).map((array) => array[1]);
  dataset = rawData;
}

function createScales(dataset) {
  let xMin = d3.min(xValues);
  let xMax = d3.max(xValues);

  xScale = d3
    .scaleTime()
    .domain([xMin, xMax + 5])
    .range([padding, w - padding]);

  let yMin = d3.min(yValues);
  let yMax = d3.max(yValues);

  yScale = d3
    .scaleLinear()
    .domain([0, yMax + 1500])
    .range([0, h]);
  yAxisScale = d3
    .scaleLinear()
    .domain([yMax + 1500, yMin - 100])
    .range([0, h]);
}

function createAxes() {
  let xAxis = d3.axisBottom(xScale).ticks(6);
  title
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  let yAxis = d3.axisLeft(yAxisScale).ticks(10);
  title
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis)
    .selectAll("*")
    .attr("class", "tick");
}

function createBars() {
  title
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(d[0].match(/^\w+/)))
    .attr("y", (d) => h - padding - yScale(d[1]))
    .attr("height", (d) => yScale(d[1]))
    .attr("width", 5)
    .attr("fill", "blue").attr;
}
