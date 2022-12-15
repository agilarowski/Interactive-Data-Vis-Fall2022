// This code produces a matrix layout and was written by Helder da Rocha, "Learn D3.js", Packt Publishing, 2019.
// Chapter 10, "Visualizing Flows and Networks", pages 475-477
// The author gives readers permission to use the code on their onw data

const dvj = {}

dvj.matrixToLinks = function(nodes, matrix, objectID) {

    const links = [];

    for(let s = 0; s < matrix.length; s++) {
        for(let t = 0; t < matrix.length; t++) {
            const v = matrix[s][t];
            if(v != 0) {
                if(!objectID) {
                    links.push({source: s, target: t, value: v});
                } else {
                    links.push({source: nodes[s], target: nodes[t], value: v});
                }
            }
        }
    }

    return links;
}


dvj.linksToMatrix = function(nodes, links, objectID) {

    const matrix = [];

    for(let s = 0; s < nodes.length; s++) {
        const line = [];
        for(let t = 0; t < nodes.length; t++) {
            const link = !objectID ? links.filter(k => k.source == s && k.target == t) :
                                     links.filter(k => k.source == nodes[s] && k.target == nodes[t]);
            if(link.length != 0) {
                line.push(link[0].value);
            } else {
                line.push(0);
            }
        }
        matrix.push(line);
    }

    return matrix;
}


dvj.adjacencyMatrix = function() {
    let w = 1, h = 1;

    function layout(nodes, sourceMatrix) {

        const len = nodes.length;

        const resultMatrix = [];
        for(let s = 0; s < sourceMatrix.length; s++) {
            for(let t = 0; t < sourceMatrix.length; t++) {
                const v = +sourceMatrix[s][t];
                const rect = {x: t * w/len, y: s * h/len, w: w/len, h: h/len};
                if(v > 0) {
                    const edge = {source: nodes[s], target: nodes[t], value: value = v};
                    resultMatrix.push(Object.assign(edge, rect));
                } else {
                    resultMatrix.push(Object.assign({}, rect));
                }
            }
        }
        return resultMatrix;
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
}


dvj.arcDiagram = function() {
    let w = 1;

    const points = [];
    const curves = [];

    function layout(n, e) {

        const nodes = n.map(a => Object.assign({}, a));
        const edges = e.map(a => Object.assign({}, a));

        const len = nodes.length;

        nodes.forEach(function(node, i) {
            node.x = i * w/len;
            node.i = i;
            points.push(node);
        });

        const groups = d3.nest()
            .key(d => d.node)
            .rollup(d => d[0])
            .map(nodes);

        edges.forEach(function(edge, j) {
            if(isNaN(edge.source)) {
                edge.source = groups.get(edge.source);
                edge.target = groups.get(edge.target);
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            } else {
                edge.source = nodes[edge.source];
                edge.target = nodes[edge.target];
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            }
        });

        points.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source == node);
            node.targets = edges.filter(edge => edge.target == node);
        });

        return {nodes: () => points, links: () => curves};
    }

    layout.width = function(width) {
        return arguments.length ? (w = +width, layout) : w;
    }

    return layout;
}

dvj.curve = function() {

    let h = 2;
    let w = 1;

    let source = d => d.source.x;
    let target = d => d.target.x;
    let midY   = d => d.source.x - d.target.x;

    function layout(d) {
        const line = d3.line().curve(d3.curveBundle.beta(0.75));
        const height = d3.scaleLinear().range([0,h/2]).domain([0,w])
        return line([ [source(d),0],[(source(d)+target(d))/2,height(midY(d))],[target(d),0] ]);
    }

    layout.source = (func) => arguments.length ? (source = func, layout) : source;
    layout.target = (func) => arguments.length ? (target = func, layout) : target;
    layout.midY   = (func) => arguments.length ? (midY = func, layout) : midY;

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1] * 2, layout) : [w, h];
    }

    return layout;
}

dvj.circleDiagram = function() {
    let w = 1;
    let h = 1;

    const points = [];
    const curves = [];

    function layout(n, e) {

        const nodes = n.map(a => Object.assign({}, a));
        const edges = e.map(a => Object.assign({}, a));

        const circ = 2 * Math.PI;

        nodes.forEach(function(node, i) {
            node.angle = i * circ/nodes.length;
            node.radius = Math.min(w,h)/2;
            node.i = i;
            points.push(node);
        });

        const groups = d3.nest()
            .key(d => d.node)
            .rollup(d => d[0])
            .map(nodes);

        edges.forEach(function(edge, j) {
            if(isNaN(edge.source)) {
                edge.source = groups.get(edge.source);
                edge.target = groups.get(edge.target);
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            } else {
                edge.source = nodes[edge.source];
                edge.target = nodes[edge.target];
                if(edge.source && edge.target && edge.value > 0) {
                    curves.push(edge);
                }
            }
        });

        points.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source == node);
            node.targets = edges.filter(edge => edge.target == node);
        });

        return {nodes: () => points, links: () => curves};
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
};

dvj.squareGrid = function() {
    let w = 1;
    let h = 1;
    let rows = 1;
    let cols = 1;
    let offset = 0;
    let step = 1;

    const nodes = [];

    function layout(n, e) {

        const points = n.map(a => Object.assign({}, a));
        const edges  = e.map(a => Object.assign({}, a));

        const places = rows * cols;

        const grid = [];
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                const point = {};
                point.x = i * w/(cols-1);
                point.y = j * h/(rows-1);
                grid.push(point);
            }
        }

        points.forEach(function(point, i) {
            point.x = grid[(offset + step * i) % grid.length].x;
            point.y = grid[(offset + step * i) % grid.length].y;
            point.index = i%grid.length;
            nodes.push(point);
        });

        const groups = d3.nest()
            .key(d => d.node)
            .rollup(d => d[0])
            .map(points);

        edges.forEach(function(edge, j) {
            edge.source = groups.get(edge.source);
            edge.target = groups.get(edge.target);
        });

        nodes.forEach(function(node, i) {
            node.sources = edges.filter(edge => edge.source == node);
            node.targets = edges.filter(edge => edge.target == node);
        });

        edges.sort((a,b) => d3.ascending(a.source.node, b.source.node) || d3.ascending(a.target.node, b.target.node));

        console.log('sorted', edges)

        for (let i = 0; i < edges.length; i++) {
            if (i != 0 && edges[i].source == edges[i-1].source && edges[i].target == edges[i-1].target) {
                edges[i].edgeNumber = edges[i-1].edgeNumber + 1;
            } else {
                edges[i].edgeNumber = 1;
            };
        };

        return {nodes: () => nodes, edges: () => edges};
    }

    layout.offset = function(value) {
        return arguments.length ? (offset = +value, layout) : offset;
    }
    layout.step = function(value) {
        return arguments.length ? (step = +value, layout) : step;
    }
    layout.gridSize = function(array) {
        return arguments.length ? (cols = +array[0], rows = +array[1], layout) : [cols, rows];
    }
    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }

    return layout;
}

dvj.graphLink = function() {

    let w = 1;
    let h = 1;
    const ref = .00001;
    let allCurves = true;
    let direction = 1;
    let curvature = 1;
    let symmetric = true;

    const dx = d => d.target.x - d.source.x;
    const dy = d => d.target.y - d.source.y;
    const dr = (d,dir) => (dx(d)*dy(d)) * ref/curvature * (w+h) * (d.edgeNumber + dir)/4;
    let midY = d => d.source.x - d.target.x;
    let midX = d => d.source.y - d.target.y;

    function layout(d) {
        const direction = symmetric ? d.edgeNumber % 2 : 1;
        const curve = d.edgeNumber % 2 == 0 || allCurves ? `A ${dr(d,direction)},${dr(d,direction)} 0 0,${direction} ` : "L";
        return "M" + d.source.x + "," + d.source.y + curve + d.target.x + "," + d.target.y;
    }

    layout.size = function(array) {
        return arguments.length ? (w = +array[0], h = +array[1], layout) : [w, h];
    }
    layout.curvesOnly = function(bool) {
        return arguments.length ? (allCurves = bool, layout) : allCurves;
    }
    layout.symmetric = function(bool) {
        return arguments.length ? (symmetric = bool, layout) : symmetric;
    }
    layout.curvature = function(value) {
        return arguments.length ? (curvature = (value == 0) ? .0001 : value, layout) : curvature;
    }

    return layout;

}

// SVG element
const width = 1200;
const height = 1200;
const margin = 400;

// Color scale for nodes
const color = d3.scaleSqrt().range(['lightyellow','red']);

const nodes = [];

const format = d3.format(',.2f');

// Loading data
d3.csv("state.csv", function(row) {
    nodes.push({node: row.Destination, total: +row.Total, code: row.Code, pop: +row.Population});

    const line = [];
    for(key in row) {
        if(key != 'Population' && key != 'Destination' && key != 'Total' && key != 'Code') {
            if(isNaN(row[key]) || +row[key] <= 0) continue;
            const obj = {
                value: +row[key] ,
                target: row.Destination,
                source: key
            }
            line.push(obj);
        }
    }
    return line;

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

    // Setting the color scale domain
    color.domain([0,d3.max(edges, d => d.value)]);

    draw(filteredNodes, result);
});
    // Putting it all together
function draw(nodes, data) {

    const svg = d3.select("#container").append("svg").attr("width",width).attr("height",height);
    const chart = svg.append("g").attr("transform", `translate(${[margin/2,margin/2]})`);

    // Adding interactivity and axis labels
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
}