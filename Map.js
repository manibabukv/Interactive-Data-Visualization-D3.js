let gk = 35;
let pre = 1;
let lastk = 35;
let handleRadioChange;
var zoom = d3.zoom().on("zoom", function () {

    let trans = d3.event.transform;
    let k = +lastk;

    let transk = +trans.k;
    if (transk == pre) {
        g.attr("transform", d3.zoomIdentity.translate(trans.x, trans.y).scale(k));
    }
});

var svg = d3.select("#map")
    .append("svg")
    .attr("width", 600)
    .attr("height", 600)
    .on("dblclick", function () {
        if (gk < 80) {
            lastk = lastk + 2;
            gk = gk + 2;
            g.attr("transform", d3.zoomIdentity.translate(-99, -100).scale(gk));
        }
        else {
            lastk = lastk - 2;
            gk = gk + 2;
            g.attr("transform", d3.zoomIdentity.translate(-99, -100).scale(gk));
        }
    })
    .call(zoom)


let g = svg.append("g")
    .attr("transform", "translate(-99,-100) scale(35) rotate(-1)")


d3.select('#plus').on('click', function () {
    if (gk < 80) {
        gk = gk + 2;
        let k = +gk;
        lastk = k;
        g.attr("transform", d3.zoomIdentity.translate(-99, -100).scale(k));
    }
})

d3.select('#minus').on('click', function () {
    if (gk > 35) {
        gk = gk - 2;
        let k = +gk;
        lastk = k;
        g.attr("transform", d3.zoomIdentity.translate(-99, -100).scale(k));
    }
})

d3.json("streets.json", function (error, data) {

    var lineFunc = d3.line()
        .x(function (d) { return d.x })
        .y(function (d) { return d.y })
        .curve(d3.curveLinear)

    let paths = null;
    data.forEach((d1, i1) => {
        paths = g.append("g")
            .attr("class", "path")
            .selectAll("path")
            .data(d1)
            .enter().append("path")
            .attr("stroke", "black")
            .attr("stroke-width", "0.01px")
            .attr("fill", "none");

        paths.attr("d", lineFunc(d1));


    });


});

d3.csv("deaths_age_sex.csv", function (error, data) {

    var ST = [{ name: 'CEORCE STREET', x: 130, y: 417, rotate: -72 }, { name: 'BREWER STREET', x: 400, y: 225, rotate: 42 },
    { name: 'RECENT STREET', x: 260, y: 380, rotate: -60 }, { name: 'OXFORD STREET', x: 330, y: 590, rotate: 10 },
    { name: 'DEAN STREET', x: 600, y: 550, rotate: -65 }]

    var WH = [{ x: 330, y: 452, w: 45, h: 38, rotate: 20 }]

    var BR = [{ x: 485, y: 408.5, w: 20, h: 13, rotate: -60 }]

    let location = g.selectAll("image")
        .attr("class", "loc")
        .data(data)
        .enter().append("image")
        .attr("xlink:href", 'marker.png').attr("class", function (d) { return "c" + d.age + d.gender; })
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("width", 0.5)
        .attr("height", 0.5)
        .on("mouseover", function (d) {
            let gender = d.gender == 0 ? 'Male' : 'Female';
            let age = '';
            if (d.age == 0) {
                age = '0-10';
            }
            else if (d.age == 1) {
                age = '11-20';
            }
            else if (d.age == 2) {
                age = '21-40';
            }
            else if (d.age == 3) {
                age = '41-60';
            }
            else if (d.age == 4) {
                age = '61-80';
            }
            else {
                age = '80';
            }
            d3.selectAll(".agess").style("opacity", 0.2);
            d3.select("#ages" + gender + age).style("opacity", 1);
        })
        .on("mouseout", function (d) {
            d3.selectAll(".agess").style("opacity", 1);
        })

    location.append('title').html(function (d) {
        let gender = d.gender == 0 ? 'Male' : 'Female';
        let age = '';
        if (d.age == 0) {
            age = '0-10';
        }
        else if (d.age == 1) {
            age = '11-20';
        }
        else if (d.age == 2) {
            age = '21-40';
        }
        else if (d.age == 3) {
            age = '41-60';
        }
        else if (d.age == 4) {
            age = '61-80';
        }
        else {
            age = '>80';
        }
        return "Age: " + age + "\n" + "Sex: " + gender;
    })

    let wh = g.selectAll(".wh")

        .data(WH)
        .enter().append("image")
        .attr("xlink:href", 'workhouse.png').attr("class", 'allOthers')
        .attr("transform", function (d) { return "rotate(" + d.rotate + " " + d.x / 35 + "," + d.y / 35 + ")"; })
        .attr("x", function (d) { return d.x / 34; })
        .attr("y", function (d) { return d.y / 34; })
        .attr("width", function (d) { return d.w / 35; })
        .attr("height", function (d) { return d.h / 35; })

    let bre = g.selectAll(".br")

        .data(BR)
        .enter().append("image")
        .attr("xlink:href", 'brewery.png').attr("class", 'allOthers')
        .attr("transform", function (d) { return "rotate(" + d.rotate + " " + d.x / 35 + "," + d.y / 35 + ")"; })
        .attr("x", function (d) { return d.x / 35; })
        .attr("y", function (d) { return d.y / 35; })
        .attr("width", function (d) { return d.w / 35 + 0.3; })
        .attr("height", function (d) { return d.h / 35 + 0.3; })


    let streets = g.selectAll(".place-label")
        .attr("class", "place-label")
        .data(ST)
        .enter().append("text")
        .attr("transform", function (d) { return "rotate(" + d.rotate + " " + d.x / 35 + "," + d.y / 35 + ")"; })
        .attr("x", function (d) { return d.x / 35; })
        .attr("y", function (d) { return d.y / 35; })
        .style("font-size", "0.3px")
        .text(function (d) { return d.name; });

    handleRadioChange = function (val) {
        if (val == 'gender') {
            d3.select("#genders").style('display', 'block');
            d3.select("#locations").style('display', 'none');
            d3.select("#ages").style('display', 'none');
            location.attr("xlink:href", function (d) {
                if (d.gender == 0) {
                    return "marker1.png";
                }
                else {
                    return "marker2.png";
                }
            })
        }
        else if (val == 'age') {
            d3.select("#genders").style('display', 'none');
            d3.select("#locations").style('display', 'none');
            d3.select("#ages").style('display', 'block');
            location.attr("xlink:href", function (d) {
                let age = '';
                if (d.age == 0) {
                    age = "marker3.png";
                }
                else if (d.age == 1) {
                    age = "marker4.png";
                }
                else if (d.age == 2) {
                    age = "marker5.png";
                }
                else if (d.age == 3) {
                    age = "marker6.png";
                }
                else if (d.age == 4) {
                    age = "marker7.png";
                }
                else {
                    age = "marker8.png";
                }
                return age;
            })
        }
        else {
            d3.select("#genders").style('display', 'none');
            d3.select("#locations").style('display', 'inline');
            d3.select("#ages").style('display', 'none');
            location.attr("xlink:href", "marker.png");
        }
    }
})

d3.csv("pumps.csv", function (error, data) {
    data.forEach(d => {
        let pump = g.append("image").attr("class", 'allOthers')
            .attr("xlink:href", 'pump.png')
            .attr("x", +d.x)
            .attr("y", +d.y - 1)
            .attr("width", 0.5)
            .attr("height", 0.5)

    });
})