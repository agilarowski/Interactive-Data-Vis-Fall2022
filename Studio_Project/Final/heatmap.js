// HEATMAP/ MATRIX FOR CONTAINER_1
function heatmap (){
    // SVG element
    const width = 1200;
    const height = 1200;
    const margin = 400;

    // Color scale for nodes
    const color = d3.scaleSqrt().range(['lightyellow','red']);

    const nodes = [];

    const format = d3.format(',.2f');

    // Loading data
    // Population refers to those who moved out of state
    d3.csv("migration_clean.csv", function(row) {
        nodes.push({node: row.Destination, total: +row.Total, code: row.Code, pop: +row.Population});
        // Pushing the data array into object
        const array = [];
        for(key in row) {
            if(key != 'Population' && key != 'Destination' && key != 'Total' && key != 'Code') {
                if(isNaN(row[key]) || +row[key] <= 0) continue;
                const obj = {
                    value: +row[key] ,
                    target: row.Destination,
                    source: key
                }
                array.push(obj);
            }
        }
        return array;

    }).then(function(data) {
        // Edges {source, target, value},
        const edges = d3.merge(data);
        
        const filteredNodes  = nodes.filter(d => d.total >= 0 || d.pop >= 0)
                                    .sort((a,b) => d3.descending(a.total, b.total)); // states with the most migration "action" should be in the top left corner
        // Edges {source, target, value}, referencing to an element in the nodes array
        const filteredEdges = edges.filter(edge => filteredNodes.find(n => n.node == edge.target))
                                   .filter(edge => filteredNodes.find(n => n.node == edge.source));

        filteredEdges.forEach(function(edge) {
            edge.source = filteredNodes.map(n => n.node).indexOf(edge.source);
            edge.target = filteredNodes.map(n => n.node).indexOf(edge.target);
        });
        // Fitting the matrix to SVG
        const matrixLayout = dvj.adjacencyMatrix().size([width-margin,height-margin]);

        // Bringing the matrix and providing it with data
        const matrix = dvj.linksToMatrix(filteredNodes, filteredEdges);
        
        const result = matrixLayout(filteredNodes, matrix);

        // Setting the color scale domain (from zero to California: max people moved out)
        color.domain([0,d3.max(edges, d => d.value)]);

        draw(filteredNodes, result);
    });
        // Putting it all together, adding interactivity and axis labels
    function draw(nodes, data) {

        const svg = d3.select("#container_1").append("svg").attr("width",width).attr("height",height);
        const chart = svg.append("g").attr("transform", `translate(${[margin/2,margin/2]})`);

    
        const cell = chart.selectAll('g.cell')
                .data(data)
                .enter()
                .append("g").attr("class", 'cell')
                .attr("transform", d => `translate(${[d.x, d.y]})`)
                .on("mouseover", highlight)
                .on("mouseout", unHighlight);

        cell.append("rect")
                .attr("height", d => d.h)
                .attr("width", d => d.w)
                .attr("rx",d => d.w/4).attr("ry", d => d.h/4)
                .style("stroke", 'black')
                .style("fill", d => d.value ? color(d.value) : 'white')

        chart.selectAll('text.source')
                .data(data.filter(d => d.y == 0))
                .enter()
                .append("text").attr("class",'source')
                .attr("y", d => d.x + d.w/2)
                .style("text-anchor", 'start')
                .attr("x", 5)
                .attr("transform",`rotate(-90) `)
                .text((d,i) => nodes[i].node)
                .on("mouseover", highlight)
                .on("mouseout", unHighlight);
        chart.append("text")
                .style("text-anchor", 'middle')
                .attr("transform",`rotate(-90,${[0,height/2 - margin/2]}) translate(${[0, height/2 - margin/2 - 75]})`)
                .style("font-size", 24)
                .text('FROM');

        chart.selectAll('text.target')
                .data(data.filter(d => d.x == 0))
                .enter()
                .append("text").attr("class",'target')
                .attr("y", d => d.y + d.h/2)
                .style("text-anchor", 'end')
                .attr("x", -10)
                .text((d,i) => nodes[i].node)
                .on("mouseover", highlight)
                .on("mouseout", unHighlight);
        chart.append("text")
                .style("text-anchor", 'middle')
                .attr("transform",`translate(${[width/2 - margin/2, -75]})`)
                .style("font-size", 24)
                .text('TO');
        // Adding tooltip, text showing inside the cell
        const tooltip = chart.append("g")
                .attr("class",'tooltip')
                .style("opacity", 0)
                .style("pointer-events", 'none')

        tooltip.append("rect")
                .style("fill", 'white')
                .style("stroke", 'black')
        tooltip.append("text")
                .style("font-size", 8)
                .style("alignment-baseline", 'middle')
                .style("text-anchor", 'middle')

    }
    // Highlight and unhighlight functions - to receive current datum and add or remove CSS classes from rect and text elements
    function unHighlight(d,i,nodes) {
        d3.selectAll(".cell, text.source, text.target").classed('faded highlight', false);
        d3.select('.tooltip').style("opacity", 0);
    }

    function highlight(d) {
        d3.selectAll(".cell").classed('faded', k => !(k.x == d.x || k.y == d.y))
        d3.selectAll(".cell").classed('highlight', k => k.x == d.x || k.y == d.y)
        d3.selectAll("text.source").classed('highlight', k => k.x == d.x)
        d3.selectAll("text.target").classed('highlight', k => k.y == d.y)

        d3.select('.tooltip').select("text")
                .attr("x", d.w * .75)
                .attr("y", d.h * .75)
                .text(d.value ? format(d.value/1000) : 0); // Some of the values are in hundred thousands and it doesn't fit in cell

        d3.select('.tooltip')
                .attr("transform", `translate(${[d.x -d.w/4, d.y -d.h/4]})`)
                .style("opacity", 1)

                .select("rect")
                .style("stroke-width", 3)
                .attr("rx", d.w/4)
                .attr("ry", d.h/4)
                .style("fill", d.value ? color(d.value) : 'white')
                .attr("width", 1.5 * d.w)
                .attr("height", 1.5 * d.w)
    }}

    heatmap();
