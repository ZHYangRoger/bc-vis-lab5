let ori_data;

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

async function main(){
    //FETCH DATA
    const url = "coffee-house-chains.csv";
    ori_data = await loadData(url);


    //CHART INIT
    var margin = {top: 20, right: 10, bottom: 20, left: 45};
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

    let yScale = d3.scaleLinear()
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

    svg.append("text")
        .attr("class", "y-axis-title")
        .attr('x', -15)
        .attr('y', -5)
        .text("Stores")

    let type = "stores";
    let sort = "l-to-s";
    let num = 0;


    //INITIAL BAR
    let bars = svg.selectAll("barChart")
                    .data(ori_data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("y", d => yScale(d.stores))
                    .attr("x", function(d, i){
                        return(i * xScale.bandwidth() + 0.5);
                    })
                    .attr("width", xScale.bandwidth() - 7)
                    .attr("height", d => height - yScale(d.stores))
                    .attr("fill", "rgb(88, 142, 192)")

    //UPDATE DATA AND APPEND CHART
    document.getElementById('group-by').onchange = function(){
        type = document.querySelector("option:checked").value;
        update(ori_data, type);
    };


    //SORT VALUE
    d3.select("#sort").on('click', () => {
        num += 1;
        if (num % 2 == 0){
            sort = "l-to-s";
            //console.log(sort);
        }
        else{
            sort = "s-to-l";
            //console.log(sort);
        }
    })
    

    //UPDATE FUNCTION (ENTER-UPDATE-EXIT) ACCORDING TO THE USER SELECTION (TYPE)
    function update(ori_data, type){
        //UPDATE SCALES
        if (type == "stores")
            yScale = d3.scaleLinear()
                        .domain([storeRange[1], 0])
                        .range([0, height]);
        else 
            yScale = d3.scaleLinear()
                        .domain([revRange[1], 0])
                        .range([0, height]);

        
            bars.attr("class", "bar")
            //.attr("y", d => yScale(d.type))
                .transition()
                .duration(1000)
                .attr("y", function(d){
                    if (type == "stores")
                        return yScale(d.stores);
                    else    
                        return yScale(d.revenue);
                })
                .attr("x", function(d, i){
                    return(i * xScale.bandwidth() + 0.5);
                })
                .attr("width", xScale.bandwidth() - 7)
                //.attr("height", d => height - yScale(d.type))
                .attr("height", function(d){
                    if (type == "stores"){
                        //console.log("s");
                        return height - yScale(d.stores);
                    }
                    else{
                        //console.log(d.revenue);
                        return height - yScale(d.revenue);
                    }
                })
                .attr("fill", "rgb(88, 142, 192)")
                .merge(bars);
        
    }
}

main();