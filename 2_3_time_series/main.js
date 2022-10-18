/* CONSTANTS AND GLOBALS */
const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = window.innerWidth * 0.7 - margin.left - margin.right,
    height = window.innerHeight * 0.7 - margin.top - margin.bottom;

/* PARSING THE YEAR */
const parseTime = d3.timeParse("%Y");

/* X AND Y SCALES */
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

/* ADDING AREA */
const area = d3.area()
    .x(function(d) { return x(d.Year); })
    .y0(height)
    .y1(function(d) { return y(d.Unemployment); });

/* LINE GENERATOR */
const genline = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Unemployment); });

/* APPENDING SVG TO #CONTAINER AS A GROUP ELEMENT AT TOP LEFT MARGIN */ 

const svg = d3.select("#container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

/* LOAD DATA */
d3.csv('../data/Unemployment.csv').then(function(data) {

  /* FROMATTING */
  data.forEach(d => {
      d.Year = parseTime(d.Year);
      d.Unemployment = +d.Unemployment;
  });

  /* RANGE SCALING */
  x.domain(d3.extent(data, d =>  d.Year ));
  y.domain([0, d3.max(data, d => d.Unemployment )]);

  /* ADDING AREA */
    svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);

  /* APPENDING LINE GENERATOR */
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", genline);

  /* X Axis */
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  /* X-AXIS LABEL */
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Unemployment Rate")

  /* Y AXIS AND Y-AXIS LABEL*/
  svg.append("g")
      .call(d3.axisLeft(y));

  svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Year")

});