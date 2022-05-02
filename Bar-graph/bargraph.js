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
    .range([padding, w - padding]);

  let yMin = d3.min(yValues);
  let yMax = d3.max(yValues) + 1500;

  yScale = d3.scaleLinear().domain([0, yMax]).range([h, 0]);
}

function createAxes() {
  let xAxis = d3.axisBottom(xScale).ticks(6);
  title
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis)
    .selectAll("*")
    .attr("class", "tick");

  let yAxis = d3.axisLeft(yScale).ticks(10);
  title
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},-${padding})`)
    .call(yAxis)
    .selectAll("*")
    .attr("class", "tick");
}

function createBars() {
  // let tooltip = title
  //   .append("div")
  //   .style("position", "absolute")
  //   .style("width", "10px")
  //   .style("height", "20px")
  //   .style("background-color", "#9cccff")
  //   .style("border", "2px solid #5d7794")
  //   .style("visibility", "visible");

  let tooltip = d3
    .select("#huh")
    .style("position", "absolute")
    .style("visibility", "visible");

  title
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d.time)
    .attr("data-gdp", (d) => d.gdp)
    .attr("x", (d) => xScale(d.timeConverted))
    .attr("y", (d) => h - padding - (h - yScale(d.gdp)))
    .attr("height", (d) => h - yScale(d.gdp))
    .attr("width", 5)
    .attr("fill", "blue")
    .on("mouseover", () => {
      console.log("over");
      return tooltip.style("visibilty", "visible");
    }) //make tooltip visible
    .on("mousemove", (e) =>
      tooltip
        .style("margin-left", `${e.pageX - 100}px`)
        .style("margin-top", `${100}px`)
    ) //get location of mouse to decide position of tooltip
    .on("mouseout", () => {
      console.log("out");
      console.log(document.querySelector("#huh").style);
      return tooltip.style("visibility", "hidden");
    });
}
