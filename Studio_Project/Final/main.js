// function europeBubble (){
//     const width_b = 500, hight_b = 500, marginH = 40, marginW = 50;

//     const scaleX = d3.scaleLinear().range([marginW, width_b-marginW]);
//     const scaleY = d3.scaleLog().range([hight_b-marginH, marginH]);
//     const scaleR = d3.scaleSqrt().range([1,15]);
//     const color  = d3.scaleOrdinal(d3.schemeDark2);

//     const axisX = d3.axisBottom(scaleX)
//             .tickSize(hight_b - marginH*2 + 10)
//             .tickPadding(2);
//     const axisY = d3.axisLeft(scaleY)
//             .tickSize(width_b - marginW*2 + 10)
//             .tickPadding(2)
//             .ticks(8, ',');

//     const format = d3.format("$,.0f");
//     const formatSI = d3.format(",.2%");

//     const data = {
//         continents: new Set()
//     }

//     const svg_1 = d3.select("#container_0").append("svg").attr("width",width_b).attr("height",hight_b);

//     d3.csv("Aliens_2021_fix.csv", function(row) {
//         if(+row.HDI_2021 >0 && +row.GDP_2021 >0 && +row.Pop_2021 >0) {
//             data.continents.add(row.Continent);
//             return {
//                 name: row.Country,
//                 code: row.Code,
//                 continent: row.Continent,
//                 population: +row.Pop_2021,
//                 hdi: +row.HDI_2021,
//                 gdp: +row.GDP_2021,
//                 alien: +row.Percent_alien
//             }
//         }
//     })
//     .then(function(dataset) {
//         data.continents = [...data.continents].sort((a,b,) => d3.ascending(a,b));
//         data.countries = dataset;
//         scaleY.domain(d3.extent(dataset, d => d.gdp));
//         scaleX.domain(d3.extent(dataset, d => d.hdi));
//         scaleR.domain(d3.extent(dataset, d => d.alien));

//         drawAxes();
//         draw();
//         drawTooltips();
//     });

//     function drawTooltips() {
//         const tooltip = d3.select("svg_1")
//                 .append("g")
//                 .attr("class", "tooltip")
//                 .attr("opacity", 0);

//         tooltip.append("rect")
//                 .attr("width", 80)
//                 .attr("height", 60)
//                 .attr("rx", 3).attr("ry", 3)
//                 .attr("x", -3).attr("y", -10);
//         tooltip.append("text").attr("class", "name");
//         tooltip.append("text").attr("class", "hdi").attr("y", 15);
//         tooltip.append("text").attr("class", "gdp").attr("y", 30);
//         tooltip.append("text").attr("class", "alien").attr("y", 45);
//     }

//     function drawAxes() {
//         const xG = d3.select("svg_1").append("g").attr("class", "x-axis")
//                 .attr("transform", `translate(${[0,marginH]})`)
//                 .call(axisX);

//         const yG = d3.select("svg_1").append("g").attr("class", "y-axis")
//                 .attr("transform", `translate(${[width_b-marginW,0]})`)
//                 .call(axisY);

//         d3.select("svg_1").append("text").attr("class","label")
//                 .text("Human Development Index (HDI)")
//                 .attr("transform", `translate(${[width_b/2,hight_b-3]})`)
//         d3.select("svg_1").append("text").attr("class","label")
//                 .text("Annual GDP per capita (USD)")
//                 .attr("transform", `translate(${[3,hight_b/2]}) rotate(90)`)

//     }

//     function draw() {
//         d3.select("svg_1").selectAll("circle.dot")
//                 .data(data.countries)
//                 .join("circle").attr("class", "dot")
//                 .attr("r", d => scaleR(d.alien))
//                 .attr("cx", d => scaleX(d.hdi))
//                 .attr("cy", d => scaleY(d.gdp))
//                 .style("fill", d => color(d.continent))
//                 .style("fill-opacity", .7)
//                 .on("mouseenter", showDetails)
//                 .on("mouseleave", clearDetails);

//         const legend = d3.select("svg_1")
//                 .append("g").attr("class", "legend")
//                 .attr("transform", `translate(${[85, 50]})`);

//         legend.selectAll("g.item")
//                 .data(data.continents)
//                 .join("g").attr("class", "item")
//                 .on("mouseenter", showContinents)
//                 .on("mouseleave", clearContinents)
//                 .each(function(d, i) {
//                     d3.select(this)
//                             .append("rect")
//                             .attr("y", i * 10)
//                             .attr("height", 8)
//                             .attr("width", 20)
//                             .style("fill", color(d));

//                     d3.select(this)
//                             .append("text")
//                             .attr("y", i * 10)
//                             .attr("x", 24)
//                             .text(d);
//                 });

//      }

//     function showContinents(d) {
//         d3.selectAll(".item").classed("fade", k => k != d)
//         d3.selectAll(".dot").classed("show", k => k.continent == d);
//     }

//     function clearContinents(d) {
//         d3.selectAll(".item").classed("fade", false)
//         d3.selectAll(".dot").classed("show", false);
//     }

//     function showDetails(d) {
//         d3.select(".tooltip").attr("opacity", 1)
//         d3.select(".tooltip")
//                 .attr("transform", `translate(${[10 + scaleX(d.hdi), scaleY(d.gdp) - 12]})`)

//         const text1 = d3.select(".tooltip .name").text(d.name);
//         const text2 = d3.select(".tooltip .gdp").text("GDP: " + format(d.gdp));
//         const text3 = d3.select(".tooltip .hdi").text("HDI: " + d.hdi);
//         const text4 = d3.select(".tooltip .alien").text("Foreign-born population: " + formatSI(d.alien));

//         const boxWidth = 6 + d3.max([text1.node().getComputedTextLength(),
//                                      text2.node().getComputedTextLength(),
//                                      text3.node().getComputedTextLength(),
//                                      text4.node().getComputedTextLength()]);

//         d3.select(".tooltip rect").attr("width", boxWidth);
//     }

//     function clearDetails( ) {
//         d3.select(".tooltip").attr("opacity", 0)
//     }}

//     europeBubble();


const w = 500, h = 300, marginH = 40, marginW = 50;

    const scaleX = d3.scaleLinear().range([marginW, w-marginW]);
    const scaleY = d3.scaleLog().range([h-marginH, marginH]);
    const scaleR = d3.scaleSqrt().range([1,15]);
    const color  = d3.scaleOrdinal(d3.schemeDark2);

    const axisX = d3.axisBottom(scaleX)
            .tickSize(h - marginH*2 + 10)
            .tickPadding(2);
    const axisY = d3.axisLeft(scaleY)
            .tickSize(w - marginW*2 + 10)
            .tickPadding(2)
            .ticks(8, ',');

    const format = d3.format("$,.0f");
    const formatSI = d3.format(",.2%");

    const data = {
        continents: new Set()
    }

    d3.csv("Aliens_2021_fix.csv", function(row) {
        if(+row.HDI_2021 >0 && +row.GDP_2021 >0 && +row.Pop_2021 >0) {
            data.continents.add(row.Continent);
            return {
                name: row.Country,
                code: row.Code,
                continent: row.Continent,
                population: +row.Pop_2021,
                hdi: +row.HDI_2021,
                gdp: +row.GDP_2021,
                alien: +row.Percent_alien
            }
        }
    })
    .then(function(dataset) {
        data.continents = [...data.continents].sort((a,b,) => d3.ascending(a,b));
        data.countries = dataset;
        scaleY.domain(d3.extent(dataset, d => d.gdp));
        scaleX.domain(d3.extent(dataset, d => d.hdi));
        scaleR.domain(d3.extent(dataset, d => d.alien));

        drawAxes();
        drawBubble();
        drawTooltips();
    });

    function drawTooltips() {
        const tooltip = d3.select("#chart1")
                .append("g")
                .attr("class", "tooltip")
                .attr("opacity", 0);

        tooltip.append("rect")
                .attr("width", 80)
                .attr("height", 60)
                .attr("rx", 3).attr("ry", 3)
                .attr("x", -3).attr("y", -10);
        tooltip.append("text").attr("class", "name");
        tooltip.append("text").attr("class", "hdi").attr("y", 15);
        tooltip.append("text").attr("class", "gdp").attr("y", 30);
        tooltip.append("text").attr("class", "alien").attr("y", 45);
    }

    function drawAxes() {
        const xG = d3.select("#chart1").append("g").attr("class", "x-axis")
                .attr("transform", `translate(${[0,marginH]})`)
                .call(axisX);

        const yG = d3.select("#chart1").append("g").attr("class", "y-axis")
                .attr("transform", `translate(${[w-marginW,0]})`)
                .call(axisY);

        d3.select("#chart1").append("text").attr("class","label")
                .text("Human Development Index (HDI)")
                .attr("transform", `translate(${[w/2,h-3]})`)
        d3.select("#chart1").append("text").attr("class","label")
                .text("Annual GDP per capita (USD)")
                .attr("transform", `translate(${[3,h/2]}) rotate(90)`)

    }

    function drawBubble() {
        d3.select("#chart1").selectAll("circle.dot")
                .data(data.countries)
                .join("circle").attr("class", "dot")
                .attr("r", d => scaleR(d.alien))
                .attr("cx", d => scaleX(d.hdi))
                .attr("cy", d => scaleY(d.gdp))
                .style("fill", d => color(d.continent))
                .style("fill-opacity", .7)
                .on("mouseenter", showDetails)
                .on("mouseleave", clearDetails);

        const legend = d3.select("#chart1")
                .append("g").attr("class", "legend")
                .attr("transform", `translate(${[85, 50]})`);

        legend.selectAll("g.item")
                .data(data.continents)
                .join("g").attr("class", "item")
                .on("mouseenter", showContinents)
                .on("mouseleave", clearContinents)
                .each(function(d, i) {
                    d3.select(this)
                            .append("rect")
                            .attr("y", i * 10)
                            .attr("height", 8)
                            .attr("width", 20)
                            .style("fill", color(d));

                    d3.select(this)
                            .append("text")
                            .attr("y", i * 10)
                            .attr("x", 24)
                            .text(d);
                });

     }

    function showContinents(d) {
        d3.selectAll(".item").classed("fade", k => k != d)
        d3.selectAll(".dot").classed("show", k => k.continent == d);
    }

    function clearContinents(d) {
        d3.selectAll(".item").classed("fade", false)
        d3.selectAll(".dot").classed("show", false);
    }

    function showDetails(d) {
        d3.select(".tooltip").attr("opacity", 1)
        d3.select(".tooltip")
                .attr("transform", `translate(${[10 + scaleX(d.hdi), scaleY(d.gdp) - 12]})`)

        const text1 = d3.select(".tooltip .name").text(d.name);
        const text2 = d3.select(".tooltip .gdp").text("GDP: " + format(d.gdp));
        const text3 = d3.select(".tooltip .hdi").text("HDI: " + d.hdi);
        const text4 = d3.select(".tooltip .alien").text("Foreign-born population: " + formatSI(d.alien));

        const boxWidth = 6 + d3.max([text1.node().getComputedTextLength(),
                                     text2.node().getComputedTextLength(),
                                     text3.node().getComputedTextLength(),
                                     text4.node().getComputedTextLength()]);

        d3.select(".tooltip rect").attr("width", boxWidth);
    }

    function clearDetails( ) {
        d3.select(".tooltip").attr("opacity", 0)
    }