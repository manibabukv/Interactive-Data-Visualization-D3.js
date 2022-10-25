
var margin5 = { top: 10, right: 60, bottom: 20, left: 60 },
    width5 = 560 - margin5.left - margin5.right,
    height5 = 300 - margin5.top - margin5.bottom;

var svg5 = d3.select("#stackbars")
    .append("svg")
    .attr("width", width5 + margin5.left + margin5.right)
    .attr("height", height5 + margin5.top + margin5.bottom)
    .style("overflow", "visible")
    .append("g")
    .attr("transform",
        "translate(" + margin5.left + "," + margin5.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("deaths_age_sex.csv", function (error, newData) {

    let labels = ['0-10', '11-20', '21-40', '41-60', '61-80', '>80'];
    let total = 0;
    let data = [];
    labels.forEach((lab, index) => {
        let filterMale = newData.filter((d) => { return +d.age == index && d.gender == 0; })
        let filterFemale = newData.filter((d) => { return +d.age == index && d.gender == 1; })
        let obj = {};
        obj["group"] = lab;
        obj["Male"] = +filterMale.length;
        obj["Female"] = +filterFemale.length;
        data.push(obj);
        total = total + (+filterMale.length) + (+filterFemale.length);
    })
    if (error) throw error;


    var subgroups = ["Male", "Female"]

    var groups = d3.map(data, function (d) { return (d.group) }).keys()

    var x5 = d3.scaleBand()
        .domain(groups)
        .range([0, width5])
        .padding([0.2])
    svg5.append("g")
        .attr("transform", "translate(0," + height5 + ")")
        .call(d3.axisBottom(x5).tickSizeOuter(0));

    var y5 = d3.scaleLinear()
        .domain([0, 180])
        .range([height5, 0]);
    svg5.append("g")
        .call(d3.axisLeft(y5));

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c', '#377eb8'])

    var stackedData = d3.stack()
        .keys(subgroups)
        (data)

    svg5.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) { return color(d.key); })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect").attr('class', 'agess').attr('id', function (d) {
            let grp = d.data.group;
            if (grp == '>80') {
                grp = '80';
            }
            return d[1] == d.data.Male ? "agesMale" + grp : "agesFemale" + grp;
        })
        .attr("x", function (d) { return x5(d.data.group); })
        .attr("y", function (d) { return y5(d[1]); })
        .attr("height", function (d) { return y5(d[0]) - y5(d[1]); })
        .attr("width", x5.bandwidth())
        .on("mouseover", function (d) {
            d3.selectAll('image').style('opacity', 0);
            d3.selectAll('.allOthers').style('opacity', 1);
            div.transition()
                .duration(200)
                .style("opacity", 1);

            let age = d.data.group == '0-10' ? 0 : d.data.group == '11-20' ? 1 : d.data.group == '21-40' ? 2 : d.data.group == '41-60' ? 3 : d.data.group == '61-80' ? 4 : 5;
            if (d[1] == d.data.Male) {
                let percentage = (+d.data.Male / total) * 100;
                percentage = percentage.toFixed(2);
                div.html("Gender: Male" + "<br/>" + "Age: " + d.data.group + "<br/>" + " Number of Deaths: " + d.data.Male + "<br/>" + " Percentage: " + percentage + '%')
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                d3.selectAll('.c' + age + '0').style('opacity', 1);
            }
            else {
                let percentage = (+d.data.Female / total) * 100;
                percentage = percentage.toFixed(2);
                d3.selectAll('.c' + age + '1').style('opacity', 1);
                div.html("Gender: Female" + "<br/>" + "Age: " + d.data.group + "<br/>" + " Number of Deaths: " + d.data.Female + "<br/>" + " Percentage: " + percentage + '%')
                    .style("left", (d3.event.pageX + 30) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            }
        }).on("mouseout", function (d) {
            d3.selectAll('image').style('opacity', 1);
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })


    svg5.append('rect').attr("width", 15).attr("height", 15).attr("x", 0).attr("y", -40).style("fill", color('Male'));
    svg5.append('text').attr("x", 20).attr("y", -27.5).style("color", color('Male')).text("Male")
    svg5.append('rect').attr("width", 15).attr("height", 15).attr("x", 70).attr("y", -40).style("fill", color('Female'));
    svg5.append('text').attr("x", 90).attr("y", -27.5).style("color", color('Female')).text("Female")

    svg5.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("x", width5)
        .attr("y", height5 + margin5.bottom + 5)
        .text("Age Group");

    svg5.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .style("font-size", "12px")
        .attr("y", -30)
        .attr("x", -4)
        .attr("transform", "rotate(-90)")
        .text("Number of Deaths");


});