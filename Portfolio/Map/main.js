/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
height = window.innerHeight * 0.7,
margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
  d3.json("usStates.json"),
  d3.csv("uni.csv", d3.autoType),
]).then(([geojson, uni]) => {
  
  // svg element in our main `d3-container` element
  svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // SPECIFY PROJECTION
  
  const projection = d3.geoAlbersUsa()
    .fitSize([
      width-margin.left-margin.right,
      height-margin.top-margin.bottom
    ], geojson);

  // DEFINE PATH FUNCTION
  const path = d3.geoPath(projection)

  // draw base layer path - one path for each state
  const states = svg.selectAll("path.states")
    .data(geojson.features)
    .join("path")
    .attr("class", 'states')
    .attr("stroke", "black")
    .attr("fill", "transparent")
    .attr("d", path)


  // draw point for all cities
  const capitalCircles = svg.selectAll("circle.university")
    .data(uni)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "red")
    .attr("transform", d=> {
      
      const [x, y] = projection([d.longitude, d.latitude])
      return `translate(${x}, ${y})`
    })
    .on('mouseover', function(d) {
      d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d => d.description)
      })
    .on('mouseout', function() {
          d3.select('#tooltip').style('opacity', 0)
          })
    .on('mousemove', function() {
              d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
              })

    
});
