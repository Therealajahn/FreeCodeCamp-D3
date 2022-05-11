let padding = { top: 60, right: 60, bottom: 120, left: 60 };
let radius = 6;
let width = 1200;
let height = 600;
let padWidth = width - (padding.left + padding.right);
let padHeight = height - (padding.top + padding.bottom);
let barHeight;

let data = [];
let yearList = [];
let monthList = [];
let heatList = [];

let xScale;
let yScale;
let colorScale;
let tooltip;

const numberToMonth = {
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
    createToolTips();
    createRects();
    createLegend();
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
  function createToolTips() {
    const tooltip = canvas
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", "0");
  }
  yScale = d3.scaleBand().domain(monthList).range([0, padHeight]);
  barHeight = yScale.bandwidth();

  colorScale = (heat) =>
    d3.interpolateSpectral(
      d3.scaleLinear().domain(d3.extent(heatList)).range([0, 1])(heat)
    );
  console.log(d3.extent(heatList));
}

function createAxes() {
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => d)
    .ticks(10);
  canvas
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${padding.left},${height - padding.bottom})`)
    .call(xAxis);
  let yAxis = d3.axisLeft(yScale).tickFormat((d) => numberToMonth[d]);
  canvas
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding.left},${padding.top})`)
    .call(yAxis);
}

function createToolTips() {
  tooltip = d3
    .select("#canvas-overlay")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", "0")
    .style("min-width", "50px")
    .style("min-height", "20px")
    .style("background-color", "grey")
    .style("color", "white")
    .style("font-size", "20px")
    .style("padding", "10px")
    .style("text-align", "center")
    .style("border-radius", "4px");
}

function createRects() {
  const rect = canvas
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-year", (d) => d.year)
    .attr("data-month", (d) => d.month - 1)
    .attr("data-temp", (d, i) => heatList[i])
    .attr("height", `${barHeight}`)
    .attr("width", `${padWidth / (data.length / 12)}`)
    .attr("x", (d) => xScale(d.year) + padding.left)
    .attr("y", (d, i) => yScale(monthList[i]) + padding.left)
    .attr("i", (d, i) => i)
    .attr("fill", (d, i) => colorScale(heatList[i]))

    .on("mouseover", (e, d) => {
      let i = e.target.getAttribute("i");
      e.target.setAttribute("stroke", "black");
      tooltip
        .style("opacity", "0.9")
        .html(
          `${d.year}-${numberToMonth[monthList[i]]}<br>
          ${heatList[i].toFixed(2)}<br>
          ${d.variance.toFixed(2)}`
        )
        .attr("data-year", d.year);
      console.log("in");
    })
    .on("mousemove", (e) => {
      //get mouse location
      console.log("mousemove", e.pageX, e.pageY);
    })
    .on("mouseout", (e) => {
      e.target.setAttribute("stroke", "none");
      tooltip.style("opacity", "0");
      console.log("out");
    });
}

function createLegend() {
  let margin = { bottom: 60, left: 100 };
  let length = 500;
  let heatValues = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, 15.6];
  let legendScale = d3
    .scaleBand()
    .domain(heatValues)
    .range([margin.left, margin.left + length]);
  let legend = canvas.append("g").attr("id", "legend");
  let legendX = d3.axisBottom(legendScale).tickFormat((d, i) => heatValues[i]);
  legend
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(legendX);

  let rectHeight = 20;
  let rectWidth = length / heatValues.length;
  heatValues.forEach((d, i) => {
    legend
      .append("rect")
      .attr("class", "legend-cell")
      .attr("width", `${rectWidth}`)
      .attr("height", `${rectHeight}`)
      .attr("x", `${rectWidth * i}`)
      .attr("y", `${height - rectHeight}`)
      .attr("transform", `translate(${margin.left},-${margin.bottom})`)
      .attr("fill", `${colorScale(d)}`)
      .attr("stroke", "black");
  });
}
