let w = 1100;
let h = 600;
let padding = 50;
let xScale;
let yScale;
let xValues;
let yValues;
let dataset;

let title = d3
  .select("#overlay")
  .append("svg")
  .attr("id", "title")
  .attr("height", h)
  .attr("width", w);
// .style("background-color", "#d9ffff");

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    createDataArrays(json["data"]);
    createScales();
    createAxes();
    createBars();
  });

function createDataArrays(rawData) {
  xValues = Object.values(rawData).map((array) => new Date(array[0]));
  yValues = Object.values(rawData).map((array) => array[1]);

  dataset = Object.values(rawData).map((array) => ({
    timeConverted: new Date(array[0]),
    time: array[0],
    gdp: array[1],
  }));
}

function createScales() {
  let xMin = d3.min(xValues);
  let xMax = d3.max(xValues);

  console.table(`xmin:${xMin} xmax:${xMax}`);

  xScale = d3
    .scaleTime()
    .domain([xMin, xMax])
    .range([0, w - padding * 2]);

  let yMin = d3.min(yValues);
  let yMax = d3.max(yValues);

  yScale = d3.scaleLinear().domain([0, yMax]).range([h, padding]);
}

function createAxes() {
  let xAxis = d3.axisBottom(xScale).ticks(6);
  title
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${padding}, ${h - padding})`)
    .call(xAxis);

  let yAxis = d3.axisLeft(yScale).ticks(10);
  title
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},-${padding})`)
    .call(yAxis);
}

function createBars() {
  let tooltip = d3
    .select("#overlay")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("width", "120px")
    .style("height", "30px")
    .style("padding", "5px")
    .style("background-color", "#9cccff")
    .style("border", "2px solid #5d7794")
    .style("opacity", "0");

  let bar = title
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d.time)
    .attr("data-gdp", (d) => d.gdp)
    .attr("x", (d) => xScale(d.timeConverted) + padding)
    .attr("y", (d) => h - padding - (h - yScale(d.gdp)))
    .attr("height", (d) => h - yScale(d.gdp))
    .attr("width", "2.9px")
    .attr("fill", "blue")
    .attr("index", (d, i) => i)
    .on("mouseover", (e, d) => {
      return tooltip
        .transition()
        .duration(200)
        .style("opacity", "1")
        .attr("data-date", `${d.time}`)
        .text(`Date:${d.time} GDP:${d.gdp}`);
    }) //make tooltip visible
    .on("mousemove", (e) => {
      tooltip
        .style("margin-left", `${e.pageX + 50}px`)
        .style("margin-top", `${-100}px`);
      // .text(`${xValues[i]}`);
    }) //get location of mouse to decide position of tooltip
    .on("mouseout", () => {
      return tooltip.transition().duration(200).style("opacity", "0");
    });
}
