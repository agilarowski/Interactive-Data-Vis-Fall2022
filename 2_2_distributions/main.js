

  /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

/* LOAD DATA */
d3.csv('../data/Happiness_new.csv', d => {
  return {
    country: d.Country,
    happiness: +d.Happiness_Score,
    gdp: +d.Economy
  }
}).then(data => {
  console.log('data :>> ' data);


  /* SCALES */
  // xscale  - linear,count
  const xScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.happiness)), d3.max(data.map(d => d.happiness))])
    .range([margin.left, width - margin.right])

    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.gdp)), d3.max(data, d => d.gdp)])
    .range([height - margin.bottom, margin.top])

  /*const colorScale = d3.scaleOrdinal()
    .domain(["Male", "Female"])
    .range(["blue", "green", "purple"])

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
    .data(data, d => d.country) //  argument is the unique key for that row
    .join("circle")
    .attr("cx", d => xScale(d.happiness))
    .attr("cy", d => yScale(d.gdp))
    .attr("r", radius)
    //.attr("fill", d => colorScale(d.Gender))

});

/* CONSTANTS AND GLOBALS */
/*const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

/* LOAD DATA */
/*d3.csv('../data/bmi.csv', d3.autoType).then(data => {
  console.log(data)

  /* SCALES */
  // xscale  - linear,count
  /*const xScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.Height)), d3.max(data.map(d => d.Height))])
    .range([margin.left, width - margin.right])

    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.Weight)), d3.max(data, d => d.Weight)])
    .range([height - margin.bottom, margin.top])

  const colorScale = d3.scaleOrdinal()
    .domain(["Male", "Female"])
    .range(["blue", "green", "purple"])

  /* HTML ELEMENTS */
  // svg
  /*const svg = d3.select("#container")
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
    .data(data, d => d.ID) // second argument is the unique key for that row
    .join("circle")
    .attr("cx", d => xScale(d.Height))
    .attr("cy", d => yScale(d.Weight))
    .attr("r", radius)
    .attr("fill", d => colorScale(d.Gender))

});