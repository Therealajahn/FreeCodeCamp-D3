//prettier-ignore

const canvas = d3
.select("body")
.append("svg")
.attr("id", "canvas");

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
