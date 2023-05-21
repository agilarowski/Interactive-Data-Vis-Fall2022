
// var marginLine = { top: 30, right: 40, bottom: 30, left: 50 },
//     widthLine = 600 - marginLine.left - marginLine.right,
//     heightLine = 270 - marginLine.top - marginLine.bottom;
// // var parseDate = d3.time.format("%d-%b-%y").parse;
// var xLine = d3.scaleLinear().range([0, widthLine]);
// var y0Line = d3.scaleLinear().range([heightLine, 0]);
// var y1Line = d3.scaleLinear().range([heightLine, 0]);

// var xAxisLine = d3.axisBottom(xLine).ticks(5);

// // var xAxis = d3.axisBottom(xLine).ticks(5);
// // var yAxis = d3.axisLeft(y0Line).ticks(5);

// var yAxisLeftLine = d3.axisLeft(y0Line).ticks(5);

// var yAxisRightLine = d3.axisLeft(y1Line).ticks(5);

// var valueline = xLine(function (d) { return x(d.Year); })
//     .y0Line(function (d) { return y0Line(d.Outflow); });

// var valueline2 = xLine(function (d) { return xLine(d.Year); })
//     .y1Line(function (d) { return y1Line(Math.floor(d.Unemployment)); });

// var svgLine = d3.select("#lineChart")
//     .append("svg")
//     .attr("width", widthLine + marginLine.left + marginLine.right)
//     .attr("height", heightLine + marginLine.top + marginLine.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + marginLine.left + "," + marginLine.top + ")");

// // Get the data
// d3.csv("saldo.csv", function (data, error) {
//     console.log(data, "data")
//     return {
//         Year: (data.Year),
//         Outflow: +data.Outflow,
//         Unemployment: +Math.floor(data.Unemployment)
//     }
// }).then((data) => {

//         // Scale the range of the data
//         xLine.domain(d3.extent(data, function (d) { return d.Year; }));
//         y0Line.domain([0, d3.max(data, function (d) {
//             return Math.max(d.Outflow);
//         })]);
//         y1Line.domain([0, d3.max(data, function (d) {
//             return Math.max(Math.floor(d.Unemployment));
//         })]);

//         svgLine.append("path")        // Add the valueline path.
//             .attr("d", valueline(data));

//         svgLine.append("path")        // Add the valueline2 path.
//             .style("stroke", "red")
//             .attr("d", valueline2(data));

//         svgLine.append("g")            // Add the X Axis
//             .attr("class", "x axis")
//             .attr("transform", "translate(0," + heightLine + ")")
//             .call(xAxisLine);

//         svgLine.append("g")
//             .attr("class", "y axis")
//             .style("fill", "steelblue")
//             .call(yAxisLeftLine);

//         svgLine.append("g")
//             .attr("class", "y axis")
//             .attr("transform", "translate(" + widthLine + " ,0)")
//             .style("fill", "red")
//             .call(yAxisRightLine);
//     })

// set the dimensions and margins of the graph
var marginLine = { top: 30, right: 40, bottom: 30, left: 50 },
    widthLine = 600 - marginLine.left - marginLine.right,
    heightLine = 400 - marginLine.top - marginLine.bottom;


// set the ranges
var xLine = d3.scaleTime().range([0, widthLine]);
var yLine = d3.scaleLinear().range([heightLine, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return xLine(parseInt(d.Year)); })
    .y(function(d) { return yLine(parseInt(d.Outflow)); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return xLine(parseInt(d.Year)); })
    .y(function(d) { return yLine(parseInt(d.Unemployment)); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svgLine = d3.select("#lineChart").append("svg")
    .attr("width", widthLine + marginLine.left + marginLine.right)
    .attr("height", heightLine + marginLine.top + marginLine.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginLine.left + "," + marginLine.top + ")");

// Get the data
d3.csv("saldo.csv").then(function(data) {

  // format the data
  data.forEach(function(d) {
      d.Year = +parseInt(d.Year);
      d.Outflow = +d.Outflow;
      d.Unemployment = +d.Unemployment;
  });

  // Scale the range of the data
  xLine.domain(d3.extent(data, function(d) {  return parseInt(d.Year); }));
  yLine.domain([0, d3.max(data, function(d) {
	  return Math.max(d.Outflow, d.Unemployment); })]);

  // Add the valueline path.
  svgLine.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the valueline2 path.
  svgLine.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);

  // Add the X Axis
  svgLine.append("g")
      .attr("transform", "translate(0," + heightLine + ")")
      .call(d3.axisBottom(xLine));

  // Add the Y Axis
  svgLine.append("g")
      .call(d3.axisLeft(yLine));

});