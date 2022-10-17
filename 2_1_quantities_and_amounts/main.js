


// CONSTANTS AND GLOBALS
const margin = {top: 20, right: 30, bottom: 40, left: 90};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
  .then((data) => {
    console.log("data", data)

  /* CREATING AND APPENDING X SCALE */
  
  const x = d3.scaleLinear()
  .domain([0, Math.max(...data.map(d => d.count))])
  .range([ 0, width]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)") // POSITIONING TEXT
    .style("text-anchor", "end");

/* CREATING AND APPENDING Y SCALE */
const y = d3.scaleBand()
  .range([ 0, height ])
  .domain(data.map(d => d.activity))
  .padding(.1);
svg.append("g")
  .call(d3.axisLeft(y))

/* BARS */

svg.selectAll("rect.bar")
  .data(data)
  .join("rect")
  .attr("class", "bar")
  .attr("x", x(0) )
  .attr("y", d => y(d.activity))
  .attr("width", d => x(d.count))
  .attr("height", y.bandwidth() )

  
  })
