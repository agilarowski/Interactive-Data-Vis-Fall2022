function usMap(){
// SVG element that will contain my map 
const width_map = 1300;
const height_map = 600;
const FILE_map = "states.geojson";

// Appending svg to my first container
const svg_1 = d3.select("#container").append("svg")
        .attr("width", width_map).attr("height", height_map);

// Projection and geopath
const projection = d3.geoAlbersUsa();
const geoPath = d3.geoPath().projection(projection);

const map = {};

// Scales
// Using treshold - tried linear scale but it didn't look how I wanted. The states with the most migrants in and out are kind of outliers,
// (huge difference in value) and it caused the linear scale to move "too fast"
const thresholds = [-300000, -100000, -30000, 25000, 100000, 150000],
      labels = ["Very High","High","Medium","Low","High","Very High"],
      colors = ["#330000", "brown", "red", "lightgray", "olive", "darkgreen"];

const migScale = d3.scaleThreshold().domain(thresholds).range(colors);

// Loading data

Promise.all([
     d3.json('' + FILE_map),
     d3.csv('data_states.csv', function(row) {
         return {
             population: +row.Mig_2019,
             house: +row.Median_house,
             income: +row.Median_income,
             code: row.Code
         }
     })
]).then(function([shapes, thematic]) {
        console.log(shapes);   // shape data from geo
        console.log(thematic); // thematic data form my csv

        // Save in context of usMap()
        map.features   = shapes.features;
        // Pairing files
        map.features.forEach(function(d) {
            const entry = thematic.filter(t => t.code == d.id)[0];
            if(entry) {
                d.properties.population = entry.population;
                d.properties.house = entry.house 
                d.properties.income = entry.income;
                d.properties.affordability = entry.house / entry.income;
            }
        })
        draw();
        drawTooltips();
});
// Tooltips
function  drawTooltips() {
    svg_1.append("g").attr("id", "tooltip_map")
        .style("opacity", 0)
        .each(function(d) {
            d3.select(this).append("rect")
                    .attr("height", 40)
                    .attr("width", 210)
                    .attr("rx", 5).attr("ry", 5)
                    .attr("x", -75).attr("y", -20)
            d3.select(this).append("text")
                    .attr("y", -5)
            d3.select(this).append("text")
                    .attr("y", 15);
        })
}

function draw() {
    svg_1.selectAll("path.state")
        .data(map.features)
        .enter().append("path")
        .attr("class","state")
        .attr('d', geoPath)
        .style("fill", d => migScale(d.properties.population))
        .on("mouseenter", showTooltip)
        .on("mouseleave", hideTooltip)
}

function showTooltip(d,i) {
    const label = labels[colors.indexOf(migScale(d.properties.population))];

    const tooltip_1 = d3.select("#tooltip_map")
            .attr("transform", `translate(${[d3.event.x, d3.event.y]})`)
            .style("opacity", 1);
    tooltip_1.select("text:first-of-type")
            .text(d.properties.name)
    tooltip_1.select("text:last-child")
            .text(`Net migration: ${d.properties.population} (${label})`)
}
function hideTooltip() {
    d3.select("#tooltip_map").style("opacity", 0)
}}

usMap();
