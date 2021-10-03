let ori_data;

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

async function main(){
    const url = "coffee-house-chains.csv";
    ori_data = await loadData(url);

    var margin = {top: 20, right: 10, bottom: 20, left: 10};
    const width = 650 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;
    const svg = d3.select(".bar-chart")
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const company = [];
    const stores = [];
    const revenue = [];
    ori_data.forEach(a => company.push(a.company));
    ori_data.forEach(a => stores.push(a.stores));
    ori_data.forEach(a => revenue.push(a.revenue));

    const storeRange = d3.extent(stores);
    const revRange = d3.extent(revenue);

    const xScale = d3.scaleBand()
                        .domain(company)
                        .rangeRound([0, width])

    const yScale = d3.scaleLinear()
                    .domain([storeRange[1], 0])
                    .range([0, height]);

    const xAxis = d3.axisBottom()
	.scale(xScale);

    const yAxis = d3.axisLeft()
	.scale(yScale);

    svg.append("g")
	.attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)
	.call(xAxis);
    
    svg.append("g")
	.attr("class", "axis y-axis")
    .attr("transform", `translate(0, ${width}`)
	.call(yAxis);


    svg.selectAll("barChart")
        .data(ori_data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => yScale(d.stores))
        .attr("x", function(d, i){
            return(i * xScale.bandwidth());
        })
        .attr("width", xScale.bandwidth() - 5)
        .attr("height", d => height - yScale(d.stores))
        .attr("fill", "rgb(243, 153, 50)")
}

main();