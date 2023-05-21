var marginLine = { top: 30, right: 40, bottom: 30, left: 50 },
  widthLine = 800 - marginLine.left - marginLine.right,
  heightLine = 600 - marginLine.top - marginLine.bottom;

var xLine = d3.scaleLinear().range([0, widthLine]);
var y0Line = d3.scaleLinear().range([heightLine, 0]);
var y1Line = d3.scaleLinear().range([heightLine, 0]);

var xAxisLine = d3.axisBottom(xLine).ticks(5);
var yAxisLeftLine = d3.axisLeft(y0Line).ticks(5);
var yAxisRightLine = d3.axisRight(y1Line).ticks(5);

var valueline = d3.line()
  .x(function (d) { return xLine(d.Year); })
  .y(function (d) { return y0Line(d.Outflow); });

var valueline2 = d3.line()
  .x(function (d) { return xLine(d.Year); })
  .y(function (d) { return y1Line(Math.floor(d.Unemployment)); });

var svgLine = d3.select("#lineChart")
  .append("svg")
  .attr("width", widthLine + marginLine.left + marginLine.right)
  .attr("height", heightLine + marginLine.top + marginLine.bottom)
  .append("g")
  .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

// Get the data
d3.csv("saldo.csv").then(function (data) {
  data.forEach(function (d) {
    d.Year = +d.Year;
    d.Outflow = +d.Outflow;
    d.Unemployment = +Math.floor(d.Unemployment);
  });

  // Scale the range of the data
  xLine.domain(d3.extent(data, function (d) { return d.Year; }));
  y0Line.domain([0, d3.max(data, function (d) { return d.Outflow; })]);
  y1Line.domain([0, d3.max(data, function (d) { return Math.floor(d.Unemployment); })]);

  svgLine.append("path")        // Add the valueline path.
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

  svgLine.append("path")        // Add the valueline2 path.
    .data([data])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", valueline2);

  svgLine.append("g")            // Add the X Axis
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightLine + ")")
    .call(xAxisLine);

  svgLine.append("g")
    .attr("class", "y axis")
    .style("fill", "steelblue")
    .call(yAxisLeftLine);

  svgLine.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + widthLine + " ,0)")
    .style("fill", "red")
    .call(yAxisRightLine);
});
