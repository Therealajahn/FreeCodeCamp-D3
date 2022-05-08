let margin = { top: 20, left: 10, right: 10, bottom: 10 };
let width = 1100;
let height = 550;

//prettier-ignore

const canvas = d3
.select("#graph")
.append("svg")
.attr("id", "canvas")
.attr("width",`${width}`)
.attr("height",`${height}`);

//prettier-ignore

canvas
.append("title")
.text("ScatterPlot")
.attr("id", "title");

//prettier-ignore

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

fetch(url)
  .then((response) => response.json())
  .then((json) => console.log(json));
