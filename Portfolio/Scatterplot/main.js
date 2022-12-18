const w = 500, h = 300, marginH = 40, marginW = 50;

    const scaleX = d3.scaleLinear().range([marginW, w-marginW]);
    const scaleY = d3.scaleLinear().range([h-marginH, marginH]);
    const color  = d3.scaleOrdinal(d3.schemeDark2); // small number of categories, using scheme

    const axisX = d3.axisBottom(scaleX)
            .tickSize(h - marginH*2 + 10)
            .tickPadding(2);
    const axisY = d3.axisLeft(scaleY)
            .tickSize(w - marginW*2 + 10)
            .tickPadding(2);
            

    const format = d3.format("$,.0f"); // will be used in tooltip for GNI
    // Extracting continents names to create category
    const data = {
        continents: new Set()
    }
    // Loading data
    d3.csv("HDI_2022_clean.csv", function(row) {
        if(row.HDI_2022 >0 && row.GNI_per_capita >0) {
            data.continents.add(row.Continent); // Populating continents set
            return {
                name: row.Country,
                continent: row.Continent,
                hdi: +row.HDI_2022,
                life_ex: +row.Life_expectancy,
                gni: +row.GNI_per_capita

            
            }
        }
    }) // D3 requires an array (not a set) => converting
    .then(function(dataset) {
        data.continents = [...data.continents].sort((a,b,) => d3.ascending(a,b)); //instead of Array.from()
        data.countries = dataset;
        scaleY.domain(d3.extent(dataset, d => d.gni));
        scaleX.domain(d3.extent(dataset, d => d.life_ex));
        console.log(data)
        drawAxes();
        drawDots();
        drawTooltips();
    });
    // Tooltip
    function drawTooltips() {
        const tooltip = d3.select("svg")
                .append("g")
                .attr("class", "tooltip")
                .attr("opacity", 0); // initially hidden

        tooltip.append("rect") // rectangle with rounded corners
                .attr("width", 80)
                .attr("height", 45)
                .attr("rx", 3).attr("ry", 3)
                .attr("x", -3).attr("y", -10);
        tooltip.append("text").attr("class", "name"); // 3 lines of text in tooltip
        tooltip.append("text").attr("class", "gni").attr("y", 15);
        tooltip.append("text").attr("class", "life_ex").attr("y", 30);
    }

    function drawAxes() {
        const xG = d3.select("svg").append("g").attr("class", "x-axis")
                .attr("transform", `translate(${[0,marginH]})`)
                .call(axisX);

        const yG = d3.select("svg").append("g").attr("class", "y-axis")
                .attr("transform", `translate(${[w-marginW,0]})`)
                .call(axisY);

        d3.select("svg").append("text").attr("class","label")
                .text("Life expectancy")
                .attr("transform", `translate(${[w/2,h-3]})`)
        d3.select("svg").append("text").attr("class","label")
                .text("Annual GNI per capita 2022 (USD)")
                .attr("transform", `translate(${[3,h/2]}) rotate(90)`)

    }

    function drawDots() {
        d3.select("svg").selectAll("circle.dot")
                .data(data.countries)
                .join("circle").attr("class", "dot")
                .attr("r", 1.7)
                .attr("cx", d => scaleX(d.life_ex))
                .attr("cy", d => scaleY(d.gni))
                .style("fill", d => color(d.continent)) // categorizing continents by color
                .on("mouseenter", showInfo)
                .on("mouseleave", removeInfo);

        // Drawing legend box on the chart
        const legend = d3.select("svg")
                .append("g").attr("class", "legend")
                .attr("transform", `translate(${[85, 50]})`);

        legend.selectAll("g.item") //adding handlers to all legend items
                .data(data.continents)
                .join("g").attr("class", "item")
                .on("mouseenter", showContinents)
                .on("mouseleave", removeContinents)
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
     // conditionally add or remove class
    function showContinents(d) {
        d3.selectAll(".item").classed("remove", k => k != d)
        d3.selectAll(".dot").classed("show", k => k.continent == d);
    }

    function removeContinents() {
        d3.selectAll(".item").classed("remove", false)
        d3.selectAll(".dot").classed("show", false);
    }
    // Make tooltip visable when on a dot and update content
    function showInfo(d) {
        d3.select(this).attr("r", 4); // dot gets a bit bigger
        d3.select(".tooltip").attr("opacity", 1)
                .attr("transform", `translate(${[10 + scaleX(d.life_ex), scaleY(d.gni) - 12]})`)
        // Text to be shown on tooltip
        const text1 = d3.select(".tooltip .name").text(d.name);
        const text2 = d3.select(".tooltip .gni").text("GNI: " + format(d.gni));
        const text3 = d3.select(".tooltip .life_ex").text("Life expectancy: " + (d.life_ex));
        
        //DOM method to find the longest tooltip text to determine tooltip size (and making it a bit wider by +5)
        const tooltipWidth = 5 + d3.max([text1.node().getComputedTextLength(),
                                     text2.node().getComputedTextLength(),
                                     text3.node().getComputedTextLength()]);

        d3.select(".tooltip rect").attr("width", TooltipWidth);
    }

    function removeInfo(d) {
        d3.select(this).attr("r", 1.5); // dot returns to normal size
        d3.select(".tooltip").attr("opacity", 0) 
    }