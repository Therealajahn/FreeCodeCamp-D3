//https://observablehq.com/@didoesdigital/about-map-data-geojson-and-topojson-with-d3

let padding = 130;
let width = 1200;
let height = 600;

const canvasOverlay = d3
  .select("#canvas-wrapper")
  .append("div")
  .attr("id", "canvas-overlay");

const canvas = d3
  .select("#canvas-wrapper")
  .append("svg")
  .attr("id", "canvas")
  .attr("width", `${width}`)
  .attr("height", `${height}`);

const mapFile =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

const educationFile =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const pathGenerator = d3.geoPath();

async function applyData() {
  const education = await d3.json(educationFile);
  const map = await d3.json(mapFile);
  // console.log(education);
  // console.log(map);
  let colorScale = createColorScale(education);
  let tooltip = createToolTip();
  createCountyPaths(map, education, colorScale, tooltip);
  createLegend(colorScale);
}
applyData();

function createColorScale(education) {
  let bachelorsList = Object.keys(education).map(
    (key) => education[key].bachelorsOrHigher
  );

  // let array = [];
  // for (
  //   let i = d3.min(bachelorsList);
  //   i <= d3.max(bachelorsList);
  //   i += (d3.max(bachelorsList) - d3.min(bachelorsList)) / 10
  // ) {
  //   array.push(i);
  // }
  //generate values for legend

  return (amountEducated) =>
    d3.interpolateSpectral(
      d3.scaleLinear().domain(d3.extent(bachelorsList)).range([0, 1])(
        amountEducated
      )
    );
}

function createToolTip() {
  return d3
    .select("#canvas-overlay")
    .append("div")
    .attr("id", "tooltip")
    .attr("position", "absolute")
    .style("opacity", "0")
    .style("width", "100px")
    .style("min-height", "10px")
    .style("background-color", "grey")
    .style("color", "white")
    .style("font-size", "15px")
    .style("padding", "5px")
    .style("text-align", "center")
    .style("border-radius", "4px");
}

function createCountyPaths(map, education, colorScale, tooltip) {
  const getCounty = (d) => education.filter((county) => county.fips === d.id);

  canvas
    .append("g")
    .attr("id", "map")
    .attr("transform", `translate(${padding},0)`)
    .selectAll("path")
    .data(topojson.feature(map, map.objects.counties).features)
    .join("path")
    .attr("d", pathGenerator)
    .attr("class", "county")
    // .attr("huh", (d) => console.log(d))
    .attr("data-fips", (d) => getCounty(d)[0].fips)
    .attr("data-education", (d) => getCounty(d)[0].bachelorsOrHigher)
    .attr("fill", (d, i) => colorScale(education[i].bachelorsOrHigher))
    .attr("datum", (d) => d)

    .on("mouseover", (e, d) => {
      e.target.setAttribute("stroke", "black");
      tooltip
        .style("opacity", "0.9")
        .html(
          `${getCounty(d)[0].area_name},${getCounty(d)[0].state}: ${
            getCounty(d)[0].bachelorsOrHigher
          }%`
        )
        .attr("data-education", getCounty(d)[0].bachelorsOrHigher);
    })
    .on("mousemove", (e) => {
      tooltip
        .style("margin-left", `${e.pageX - 80}px`)
        .style("margin-top", `${e.pageY - 100}px`);
    })
    .on("mouseout", (e) => {
      e.target.setAttribute("stroke", "none");
      tooltip.style("opacity", "0");
    });
}

function createLegend(colorScale) {
  let margin = { bottom: 580, left: 380 };
  let length = 400;
  let educationValues = [
    2.6, 9.85, 17.1, 24.35, 31.6, 38.85, 46.1, 53.35, 60.6, 67.85, 75.1,
  ];
  let legendScale = d3
    .scaleBand()
    .domain(educationValues)
    .range([margin.left, margin.left + length]);
  let legend = canvas.append("g").attr("id", "legend");
  let legendX = d3
    .axisBottom(legendScale)
    .tickFormat((d, i) => educationValues[i]);
  legend
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(legendX);

  let rectHeight = 20;
  let rectWidth = length / educationValues.length;
  educationValues.forEach((d, i) => {
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
