let padding = 40;
let radius = 6;
let width = 1100 - padding * 2;
let height = 500 - padding * 2;
let data = [];
let xScale;
let yScale;
let fastestTimes;
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

//prettier-ignore
const title = 
canvas
.append("title")
.text("ScatterPlot")
.attr("id", "title");

//prettier-ignore

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    console.log(json);
    data = json;
    filterData(json);
    createAxes();
    createToolTips();
    createDots();
    createLegend();
  });

function filterData(json) {
  //put years into an array
  const years = json.map((data) => data.Year);
  console.log(d3.extent(years));
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(years))
    .range([padding, width - padding]);
  //parse time to Date format

  fastestTimes = json.map((data) => d3.timeParse("%M:%S")(data.Time));

  yScale = d3
    .scaleTime()
    .domain(d3.extent(fastestTimes))
    .range([padding, height - padding]);
}

function createAxes() {
  //scaleLinear for x
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => d)
    .ticks(10);
  canvas
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height - padding})`)
    .call(xAxis);
  //use scaleTime for y axis
  //generate ticks using tickValues and tickFormat
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  canvas
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);
}

function createToolTips() {
  tooltip = d3
    .select("#canvas-overlay")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("width", "120px")
    .style("min-height", "10px")
    .style("padding", "5px")
    .style("background-color", "#9cccff")
    .style("border", "2px solid #5d7794")
    .style("opacity", "0");
}

function createDots() {
  // data-xvalue" and "data-yvalue
  const dots = canvas
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d, i) => fastestTimes[i])
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d, i) => yScale(fastestTimes[i]))
    .attr("fill", (d) => (d.Doping ? "red" : "blue"))
    .attr("opacity", 0.7)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("r", radius)
    .on("mouseover", (e, d) => {
      return tooltip
        .transition()
        .duration(200)
        .style("opacity", "1")
        .attr("data-year", `${d.Year}`)
        .text(`${d.Doping}`);
    }) //make tooltip visible
    .on("mousemove", (e) => {
      tooltip
        .style("margin-left", `${e.pageX - 150}px`)
        .style("margin-top", `${e.pageY - 200}px`);
      // .text(`${xValues[i]}`);
    }) //get location of mouse to decide position of tooltip
    .on("mouseout", () => {
      return tooltip.transition().duration(200).style("opacity", "0");
    });
}

function createLegend() {
  let legend = d3
    .select("#canvas-overlay")
    .append("div")
    .attr("id", "legend")
    .style("width", "150px")
    .style("height", "80px")
    .style("border-radius", "4px")
    // .style("background-color", "#fff")
    .style("display", "grid")
    .style("grid", "1fr 1fr / 1fr 2fr")
    .style("align-items", "center")
    .style("justify-self", "right");

  function line(color, id, text) {
    let height = 20;

    legend
      .append("div")
      .style("width", `${height}px`)
      .style("height", `${height}px`)
      .style("background-color", `${color}`)
      .style("margin-left", "5px");

    legend.append("p").html(`${text}`);
  }
  line("red", "accused", "Accused of doping");
  line("blue", "not-accused", "Not Accused of Doping");
}
