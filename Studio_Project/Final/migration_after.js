let headersAfter = [];
    const widthAfter = 600;
    const heightAfter = 600;
    const marginAfter = 80;
    const svgAfter = d3.select("#chordChartAfter").append("svg").attr("width",widthAfter).attr("height",heightAfter);
    const chartAfter = svgAfter.append("g").attr("transform", `translate(${[widthAfter/2 + marginAfter/4, heightAfter/2 + marginAfter/4]})`);
    const radiusAfter = heightAfter/2 - marginAfter/2;

    const colorsAfter = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928','#ffed6f'];
    function colorAfter(index) {
        return colorsAfter[index];
    }

    function gradientIdAfter(d){
        return "grad-" + d.source.index + "-" + d.target.index;
    }
    function gradientAfter(d) {
        return "url(#" + gradientIdAfter(d) + ")";
    }
    function makeGradientsAfter(chords) {
        var grads = svgAfter.append("defs")
                .selectAll("linearGradient")
                .data(chords)
                .enter()
                .append("linearGradient")
                .attr("id", d => gradientId(d))
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", function(d) {
                    return radiusAfter * Math.cos((d.source.endAngle-d.source.startAngle) / 2 + d.source.startAngle - Math.PI/2);
                })
                .attr("y1", function(d) {
                    return radiusAfter * Math.sin((d.source.endAngle-d.source.startAngle) / 2 + d.source.startAngle - Math.PI/2);
                })
                .attr("x2", function(d) {
                    return radiusAfter * Math.cos((d.target.endAngle-d.target.startAngle) / 2 + d.target.startAngle - Math.PI/2);
                })
                .attr("y2", function(d) {
                    return radiusAfter * Math.sin((d.target.endAngle-d.target.startAngle) / 2 + d.target.startAngle - Math.PI/2);
                })

        // set the starting color (at 0%)
        grads.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", d => color(d.target.index))
                .attr("stop-opacity", 1);

        grads.append("stop")
                .attr("offset", "50%")
                .attr("stop-color", function(d) {
                    const tch = d3.hsl(color(d.target.index));
                    const sch = d3.hsl(color(d.target.index));
                    return d3.hsl((tch.h + sch.h)/2, (tch.s+sch.s)/2, (tch.l+sch.l)/2);
                })
                .attr("stop-opacity", 0.3);

        //set the ending color (at 100%)
        grads.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", d =>color(d.source.index))
                .attr("stop-opacity", 1);

        return grads;
    }
    //

    d3.csv("outflow_after_EU.csv", function(row) {
        const line = [];
        for(key in row) {
            if(isNaN(row[key])) continue;
            const obj = {
                value: +row[key] ,
                source: row.Country,
                target: key
            }
            line.push(obj);
        }
        return line.filter(d => d.value != 0);
    }).then(function(data) {
        const links = d3.merge(data).filter(d => d.target != 'RFN' && d.target != 'NRD'); // East and West DE
        const groups = d3.nest()
                         .key(d => d.source)
                         .key(d => d.target)
                         .rollup(d => d[0].value)
                         .map(links);
        const columns = data.columns
                            .filter((d,i) => i>0)
                            .filter(d => d != 'NRD' && d != 'RFN')

        const matrix = makeMatrixAfter(columns, groups);
        headers = columns.map(d => d === 'Republika Federalna Niemiec' ? 'RFN' : d);

        drawAfter(matrix);
    });

    function makeMatrixAfter(columns, groups) {
        const matrix = [];
        columns.forEach(function(r) {
            const row = [];
            columns.forEach(function(c) {
                let value = undefined;
                let target = groups.get(c);
                if(target) {
                    value = groups.get(c).get(r);
                }
                if(!value) {
                    target = groups.get(r);
                    if(target) {
                        value = groups.get(r).get(c);
                    }
                }
                if(!value) {
                    row.push(0);
                } else {
                    row.push(value);
                }
            });
            matrix.push(row);
        })
        return matrix;
    }

    function drawAfter(matrix) {
        console.log(matrix);

        const chord = d3.chord()
                        .padAngle(.02)
                        .sortGroups((a,b) => d3.descending(a,b))
        const chords = chord(matrix);

        const grads = makeGradients(chords);

        const ribbon = d3.ribbon().radius(radiusAfter);

        chartAfter.selectAll('path.ribbon')
                .data(chords)
                .enter().append("path").attr("class",'ribbon')
                .attr("d", ribbon)
                .style("stroke", 'black')
                .style("stroke-width", .2)
                .style("fill", d => gradient(d))
                .on("mouseover", highlightRibbon)
                .on("mouseout", d => {
                    d3.selectAll("path").classed('faded', false);
                    d3.select('.tooltip').transition().style("opacity", 0);
                });

        const arc = d3.arc().innerRadius(radiusAfter).outerRadius(radiusAfter+20);

        chartAfter.selectAll('path.arc')
                .data(chords.groups)
                .enter().append("path").attr("class",'arc')
                .attr("d", arc)
                .style("fill", d => color(d.index))
                .on("mouseover", highlightNode)
                .on("mouseout", d => d3.selectAll("path").classed('faded', false));

        chartAfter.selectAll("text")
                .data(chords.groups)
                .enter().append("text")
                .attr("x", d => arc.centroid(d)[0])
                .attr("y", d => arc.centroid(d)[1])
                .text(d => headers[d.index])
                .style("fill", d => contrast(color(d.index)))
                .attr("transform",d => `rotate(${(arc.endAngle()(d) + arc.startAngle()(d))*90/Math.PI},${arc.centroid(d)})`);

        const tooltip = chartAfter.append("g")
                .attr("class", 'tooltip hidden')
                .attr("transform", `translate(${[-75, -25]})`)
                .style("opacity", 0)
        tooltip.append("rect")
                .attr("width",150)
                .attr("height",50)
                .attr("rx", 10)
                .attr("ry", 10)
                .style("fill", 'white')
                .style("opacity", .8)

        const textFrom = tooltip.append("text").attr('id', 'label')
                .attr("x", 75)
                .attr("y", 20).each(function(d) {
                    d3.select(this).append('tspan').text('')
                    d3.select(this).append('tspan').attr("x",75).attr('dy', 20).text('');
                });
    }

    function contrastAfter(color) {
        const c = d3.rgb(color);
        return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) > 150 ? 'black' : 'white';
    }

    function highlightNodeAfter(node) {
        d3.selectAll("path.arc").classed('faded', d => !(d.index === node.index));
        d3.selectAll("path.ribbon").classed('faded', edge => !(edge.source.index === node.index || edge.target.index == node.index));
    }
    function highlightRibbonAfter(edge) {
        d3.selectAll("path.arc").classed('faded', node => !(node.index === edge.source.index || node.index === edge.target.index))
        d3.selectAll("path.ribbon").classed('faded', d => !(d === edge));
        d3.select('.tooltip').transition().style("opacity", 1);
        d3.select('#label tspan:nth-child(1)').text(`${headers[edge.source.index]}-${headers[edge.target.index]}`);
        d3.select('#label tspan:nth-child(2)').text(`${edge.source.value} migrants`);
    }