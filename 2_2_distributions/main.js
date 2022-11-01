
// SCATTERPLOT GDP (Y-AXIS) AND HAPPINESS SCORE (X-AXIS) SIZED BY FREEDOM SCORE
  /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

/* LOAD DATA */
d3.csv('../data/HappyScore.csv', d => {
  return {
    country: d.Country,
    region: d.Region,
    happiness: +d.Score,
    gdp: +d.Economy,
    freedom: +d.Freedom
  }
}).then(data => {
  console.log('data :>> ' , data);


  /* SCALES */
  // xscale  - linear,count
  const xScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.happiness)), d3.max(data.map(d => d.happiness))])
    .range([margin.left, width - margin.right])

    // yscale - linear,count
  const yScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.gdp)), d3.max(data, d => d.gdp)])
    .range([height - margin.bottom, margin.top])

  const scaleR = d3.scaleSqrt() // Adding squared root scale for dot sizing - size dependant on freedom score
    .domain(d3.extent(data, d => d.freedom))
    .range([0.1,5])

  
  /* HTML ELEMENTS */
  // svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // axis scales
  const xAxis = d3.axisBottom(xScale)
  //svg.append("g")
  //.attr("transform", `translate(0,${height - margin.bottom})`)
 // .call(xAxis);

  const xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
  
  xAxisGroup.append("text")
    .attr("class", "axis-label")
    .attr("transform", 'translate(${width / 2}, $35')
    .text("Happiness Score") 

  
  const yAxis = d3.axisLeft(yScale)
    //.tickSize(width - marginLeft - marginRight +10)
    .tickPadding(2);
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis) 

  
  // circles
  const dot = svg
    .selectAll("circle.dot")
    .data(data, d => d.country) //  argument is the unique key for that row
    .join("circle").attr("class", "dot")
    .attr("cx", d => xScale(d.happiness))
    .attr("cy", d => yScale(d.gdp))
    .attr("r", d => scaleR(d.freedom))
    //.attr("fill", d => colorScale(d.Gender))

  const color = d3.scaleOrdinal(d3.schemeDark2);

  d3.selectAll(".dot")
    .style("fill", d => color(d.region))

  const legend = d3.select("dot")
    .append("g").attr("class" , "legend")
    .attr("transform", `translate(${[85, 50]})`)

  legend.selectAll(g.item)
    .data(d.regions)
    .join("g")
    .attr("class", "item")
    .each(function(d, i) {
      d3.select(this)
        .append("rect")
        .attr("y", i*10)
        .attr("height", 8)
        .attr("width", 20)
        .style("fill", color(d));

      d3.select(this)
        .append("text")
        .attr("y", i * 10)
        .attr("x", 24)
        .text(d)
    })

});
// PROJECT 2 END - this is scatter plot of height and weight following demo code (no sized dots)

// PROJECT 1 BEGINNING
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

}); */