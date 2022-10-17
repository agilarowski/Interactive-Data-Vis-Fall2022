/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

/* LOAD DATA */
d3.csv('bmi.csv', d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */

    const xScale = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d.Height))])
    .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Weight)])
    .range([height - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
    .domain(["0", "1", "2", "3", "4", "5"])
    .range(["red", "blue", "purple", "yellow", "pink", "green"])
    
    /* HTML ELEMENTS */

    // svg
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// axis scales
const xAxis = d3.axisBottom(xScale)
svg.append("g")
.attr("transform", `translate(0,${height - margin.bottom})`)
.call(xAxis);

const yAxis = d3.axisLeft(yScale)
svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(yAxis);

// circles
const dot = svg
  .selectAll("circle")
  .data(data, d => d.BioID) // second argument is the unique key for that row
  .join("circle")
  .attr("cx", d => xScale(d.envScore2020))
  .attr("cy", d => yScale(d.ideologyScore2020))
  .attr("r", radius)
  .attr("fill", d => colorScale(d.Party))

    
  });