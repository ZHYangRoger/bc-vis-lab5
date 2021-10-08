let ori_data;

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

async function main(){
    //FETCH DATA
    const url = "coffee-house-chains.csv";
    ori_data = await loadData(url);
    //console.log(ori_data);
    ori_data.sort(function(a, b){
        return parseInt(b.stores) - parseInt(a.stores);
    });
    //console.log(ori_data);

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
    
        let storeRange = d3.extent(stores);
        let revRange = d3.extent(revenue);

    let xScale = d3.scaleBand()
                        .domain(company)
                        .rangeRound([0, width])

    let yScale = d3.scaleLinear()
                    .domain([storeRange[1], 0])
                    .range([0, height]);

    let xAxis = d3.axisBottom()
	.scale(xScale);

    let yAxis = d3.axisLeft()
	.scale(yScale);

            svg.append("g")
                    .attr("class", "axis x-axis")
                    .attr("transform", `translate(0, ${height})`)
                    .call(xAxis);
    
            svg.append("g")
                    .attr("class", "axis y-axis")
                    .attr("transform", `translate(0, ${width}`)
                    .call(yAxis);

    let t = "Stores";
    let title = svg.append("text")
                    .attr("class", "y-axis-title")
                    .attr('x', -15)
                    .attr('y', -5)
                    .text(t)

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
        update(ori_data, type, sort);
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
        //console.log(sort);
        update(ori_data, type, sort);
    })




    //UPDATE FUNCTION (ENTER-UPDATE-EXIT) ACCORDING TO THE USER SELECTION (TYPE)
    function update(ori_data, type, sort){
        //UPDATE SCALES
        if (sort == "s-to-l"){
            // stores.sort((a, b) => a - b);
            // revenue.sort((a, b) => a - b);
            //console.log(stores);
            if (type == "stores"){
                ori_data.sort(function(a, b){
                return parseInt(a.stores) - parseInt(b.stores);
                });
            }
            else{
                ori_data.sort(function(a, b){
                    return parseFloat(a.revenue) - parseFloat(b.revenue);
                });
            }
            //console.log(ori_data);
        }
        else{
            // stores.sort((a, b) => b - a);
            // revenue.sort((a, b) => b - a);
            //console.log(stores);
            if (type == "stores"){
                ori_data.sort(function(a, b){
                    return parseInt(b.stores) - parseInt(a.stores);
                });
            }
            else{
                ori_data.sort(function(a, b){
                    return parseFloat(b.revenue) - parseFloat(a.revenue);
                });
            }
            
            //console.log(ori_data);
        }

        xScale.domain(ori_data.map(d=>d.company));

        storeRange = d3.extent(stores);
        revRange = d3.extent(revenue);

        if (type == "stores"){
            yScale.domain([storeRange[1], 0])
            //xScale.domain(company)
            t = "Stores"
        }
        else{
            yScale.domain([revRange[1], 0])                        
            //console.log(yScale);
            //xScale.domain(company)
            t = "Billion USD"
        }

        
        console.log(xScale.domain());


        //console.log(ori_data);

            bars.data(ori_data)
                .attr("class", "bar")
            //.attr("y", d => yScale(d.type))
                .transition()
                .duration(1000)
                .attr("y", function(d){
                    //console.log(d);
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

            bars.exit().remove();


            title.transition()
                    .duration(1000)
                    .text(t)
        
            
            xAxis = d3.axisBottom(xScale);
                

            yAxis = d3.axisLeft(yScale);
                    

            svg.select(".x-axis").transition()
                    .duration(1000).call(xAxis);
                    

           svg.select(".y-axis").transition()
                    .duration(1000).call(yAxis);
                    

            
    }   
}

main();