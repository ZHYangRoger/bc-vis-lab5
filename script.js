let ori_data;

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

async function main(){
    const url = "coffee-house-chains.csv";
    ori_data = await loadData(url);

    var margin = {top: 20, right: 10, bottom: 20, left: 10};
    const width = 700 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
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
                        .paddingInner(0.1);

    const yScale = d3.scaleLinear()
                    .domain(storeRange[1], 0)
                    .range([0, height]);

    svg.selectAll("barChart")
        .data(ori_data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", height)
        .attr("x", function(d, i){
            return(i * xScale.bandwidth());
        })
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d.stores))
        .attr("fill", "rgb(243, 153, 50)")
}

main();