import {panZoomSetup} from './pan-zoom.js';

// These values were carefully selected to make the map fill the SVG.
const MAP_SCALE = 625;
const SVG_WIDTH = 772;
const SVG_HEIGHT = 500;

// Create a function that a population number
// to a shade of blue for country fills.


const tooltip = d3.select('.tooltip');
const tooltipCountry = tooltip.select('.country');
const tooltipMigrants = tooltip.select(".migrants");
var YEAR_SELECTED = "1966";
var migrantsByName = null; 

function hideTooltip() {
  tooltip.style('opacity', 0);
}

function L(obj) {
  console.log(obj);
}
async function load(svg, path) {
  // Load the id, name, and polygon coordinates of each country.
  let res = await fetch('./data/europe.json');
  const data = (await res.json()).features;

  // Load the id and population of each country.
  res = await fetch('./data/countries.csv');
  const csv = await res.text();
  const lines = csv.split('\n');
  const year_columns = lines[0].split(",").slice(1, lines[0].split(",").length-1);
  const migrants = lines.slice(1).map(line => {
    const timeline_data = line.split(',');
    // TTDT : use all data btw name and id... 1966 - 2021 
    return {  
              "country_name" : timeline_data[0], 
              "country_id" : timeline_data[timeline_data.length - 1],
              "year_data": convertYearsToObjects(timeline_data.slice(1,timeline_data.length-1), year_columns)
            };
  });
  

  // debugger; 
  // Add the population of each country to its data object.
  migrantsByName = {};
  for (const d of migrants) {
    migrantsByName[d.country_name] = d.year_data;
  }

  // Create an SVG group containing a path for each country.
  let g = svg
    .append('g')
    .attr('class', 'countries'); 
  g
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', path) // path is a function that is passed a data object
    .style('fill',"rgb(3,19,43)"); 
  g
    .selectAll('circle')
    .data(data.filter(h => h.geometry != null))
    .enter()
    .append("circle")
    .attr("r", "3")
    .attr("transform", (d) => { 

      let circleCoordinates = calculateAvgXAndY(d.geometry.coordinates);
      
      //return `translate(${path.projection()(d.geometry.coordinates)})`;
      return `translate(${path.projection()(circleCoordinates)})`;
      // return `translate(
      //   ${d.geometry.coordinates[0][0][0]},
      //   ${d.geometry.coordinates[0][0][1]}
      //   )`;
    })
    // .attr("cx","99")
    // .attr("cy","132")
    .attr("fill", "yellow");


    d3.select("#start").on("click", ()=> {
      d3.selectAll("circle").attr("r", (listData, idx, nodes)=> {
        debugger;
          return Number(d3.select(nodes[idx]).attr("r")) + .05; 
      });
    }
   );

    //.on('mouseenter', pathEntered);
    // .on('mousemove', pathMoved)
    // .on('mouseout', hideTooltip);
}

// This handles when the mouse cursor
// enters an SVG path that represent a country.
function pathEntered() {
  // Move this path element to the end of its SVG group so it
  // renders on top which allows it's entire stroke is visible.
  this.parentNode.appendChild(this);
}

// This handles when the mouse cursor
// moves over an SVG path that represent a country.
// function pathMoved(d) {
//   // Configure the tooltip.
//   tooltipCountry.text(d.properties.name);
//   let migrationCountForGivenYear = migrantsByName[d.properties.name] ?
//   migrantsByName[d.properties.name].filter(x => x === YEAR_SELECTED)[0] : 
//   "N/A";
//   tooltipMigrants.text(migrationCountForGivenYear);
//   tooltip
//     .style('left', d3.event.pageX + 'px')
//     .style('top', d3.event.pageY + 'px');

//   // Show the tooltip.
//   tooltip.style('opacity', 0.7);
// }

export function createWorldMap(svgId) {
  const svg = d3
    .select('#' + svgId)
    .attr('width', SVG_WIDTH)
    .attr('height', SVG_HEIGHT)
    .attr('viewBox', `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`);

  panZoomSetup(svgId, SVG_WIDTH, SVG_HEIGHT);

  // Create a function that manages displaying geographical data.
  const projection = d3
    .geoMercator()
    .scale(MAP_SCALE)
    .translate([SVG_WIDTH / 2.5, SVG_HEIGHT /.57]);

  // Create a function generate a value for the "d" attribute
  // of an SVG "path" element given polygon data.
  const path = d3.geoPath().projection(projection);

  load(svg, path);
}


const convertYearsToObjects = (dataSet, column_names) => {
    return column_names.map((colN, idx) => {
        return { [colN] : dataSet[idx] == "" ? 0 : Number(dataSet[idx]) }
        
    })
}

function calculateAvgXAndY(setOfCoordinates){
  let flatArr =[].concat.apply([], setOfCoordinates);
  let allX = flatArr.map((value, idx) => {
    return value[0]; 
  }); 
  let allY = flatArr.map((value, idx) => {
    return value[1];
  }); 
  return [d3.median(allX), d3.median(allY)];
}