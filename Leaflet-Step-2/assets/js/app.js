//---------------------------
// Basic plot with Plotly
//---------------------------

// d3.csv("/assets/data/data.csv").then(function(data) {
//     console.log(data);
//     income = data.map(d => d.income);
//     obesity = data.map(d => d.obesity);
//     console.log(income)
//     // Create Plotly trace object
//     var data = [{
//         x: income,
//         y: obesity,
//         mode: "markers"
//     }];

//     // Create Plotly layout object
//     var layout1 = {
//         title: "Fatness vs income"
//     };

//     // Slam the plotly plot into the webpage
//     Plotly.newPlot("scatter", data, layout1);
//   });

//---------------------------
// Basic plot with D3
//---------------------------

// // Define the dimensions for the graphic
// var svgWidth = 855; // md-col-9 is 855 px
// var svgHeight = 500;0

// // Put an scalable vector graphic element into the HTML at id="scatter"
// var mysvg = d3.select("#scatter")
//     .append("svg")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);

// // Define the margins that chart will have within the svg element
// var margin = {
//     top: 60,
//     right: 60,
//     bottom: 60,
//     left: 60
//     };

// // Define the pixel range that the chart will have within the svg element
// var width = svgWidth - margin.left - margin.right
// var height = svgHeight - margin.top - margin.bottom

// // Create a group within the svg for the data markers
// var markerGroup = mysvg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`)

// // Use promise object to load csv data
// d3.csv("/assets/data/data.csv").then(function(data) {

//     console.log(data)
//     // define scaling functions which transform data into pixel locations
//     var scaleX = d3.scaleLinear()
//         .domain([d3.min(data, d => d.income), d3.max(data, d => d.income)])  // domain is the range of the data
//         .range([0, width]);  // range is the range of the pixels

//     var scaleY = d3.scaleLinear()
//         .domain([d3.min(data, d => d.obesity), d3.max(data, d => d.obesity)])  // domain is the range of the data
//         .range([height, 0]);  // range is the range of the pixels

//     // bind the data to circle markers
//     circleGroup = markerGroup.selectAll("circle")
//         .data(data) // bind data to circles
//         .enter().append("circle") // for new data, append a circle
//         .attr("cx", d => scaleX(d.income)) // put the circle at correct pixel via calculation
//         .attr("cy", d => scaleY(d.obesity)) 
//         .attr("r", 8)
//         .attr("fill", "blue")
//         .attr("stroke", "blue")
//         .attr("stroke-width", "8")
//         .attr("text", "t")
//         .attr("opacity", "0.5")

//     textGroup = markerGroup.selectAll("text")
//         .data(data) // bind data to circles
//         .enter().append("text") // for new data, append a circle
//         .attr("class", "markertext")
//         .attr("dx", d => scaleX(d.income) -6) // put the circle at correct pixel via calculation
//         .attr("dy", d => scaleY(d.obesity) +3) 
//         .text(d => d.abbr)
//         .attr("fill", "white")

//     // add left axis to chart
//     var leftAxis = d3.axisLeft(scaleY);
//     var bottomAxis = d3.axisBottom(scaleX);

//     // within the marker group add another group for bottom axis
//     markerGroup.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(bottomAxis);
    
//     markerGroup.append("g")
//         .call(leftAxis);

//     // Add axis labels to markerGroup
//     markerGroup.append("text")
//         .attr("x", width/2 - margin.left)
//         .attr("y", height) // Shift down to bottom of the chart group
//         .attr("dy", margin.bottom*0.6) // shift down extra
//         .text("Income")

//     markerGroup.append("text")
//         .attr("x", 0 - margin.left)
//         .attr("y", height/2)
//         .text("Obesity")

//     // define tooltip parameters
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       //.offset([80, -60])
//       .html(function(d) {
//         return (`${d.state}<br>income: ${d.income}<br>obesity: ${d.obesity}`);
//       });
    
    
//     // define tooltip parameters
//     var toolTippointer = d3.tip()
//       .attr("class", "tooltippointer")
//       .html("")

//     textGroup.call(toolTip);
//     textGroup.call(toolTippointer);

//     // Step 8: Create event listeners to display and hide the tooltip
//     // ==============================
//     textGroup.on("mouseover", function(data) {
//       toolTip.show(data, this);
//       toolTippointer.show();
//     })
//     circleGroup.on("mouseout", function(data) {
//         toolTip.hide(data, this);
//         toolTippointer.hide();
//     })

// });

//---------------------------
// Advanced plot with D3
//---------------------------

//-----------------------------------------------------------------------
// Define the dimensions for the graphic
//-----------------------------------------------------------------------
var svgWidth = 855; // md-col-9 is 855 px
var svgHeight = 500;0

// Put an scalable vector graphic element into the HTML at id="scatter"
var mysvg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Define the margins that chart will have within the svg element
var margin = {
    top: 60,
    right: 60,
    bottom: 90,
    left: 90
    };

// Define the pixel range that the chart will have within the svg element
var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom

// Create a group within the svg for the data markers
var ChartGroup = mysvg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//-----------------------------------------------------------------------
// Define functions for dynamically changing the value -> to pixel based on user inputs
//-----------------------------------------------------------------------
// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {

    var xmin = d3.min(data, d => d[chosenXAxis]); // define lowest x value
    var xmax = d3.max(data, d => d[chosenXAxis]); // define highest x value
    var xrange = xmax - xmin; // define the range

    var xLinearScale = d3.scaleLinear()
      .domain([xmin - 0.1 * xrange, xmax + 0.1 * xrange])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {

    var ymin = d3.min(data, d => d[chosenYAxis]); // define lowest y value
    var ymax = d3.max(data, d => d[chosenYAxis]); // define highest y value
    var yrange = ymax - ymin; // define the range

    var yLinearScale = d3.scaleLinear()
      .domain([ymin - 0.1 * yrange, ymax + 0.1 * yrange])
      .range([height, 0]);
  
    return yLinearScale;
  
  }
  
// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
  }

// function used for updating xAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
  }

// function used for updating text markers group with a transition to
// new markers
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]) - 6)
        .attr("dy", d => newYScale(d[chosenYAxis]) + 3);

    return textGroup;
  }
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//-----------------------------------------------------------------------
// Create initial chart
//-----------------------------------------------------------------------
function initChart(data) {
    
    chosenXAxis = "income" // set initial choice of x axis to "income"
    chosenYAxis = "obesity" // set initial choice of y axis to "obesity"

    xLinearScale = xScale(data, chosenXAxis); // Set x scale

    yLinearScale = yScale(data, chosenYAxis); // Set x scale

    // bind the data to circle markers
    circleGroup = ChartGroup.selectAll("circle")
        .data(data) // bind data to circles
        .enter().append("circle") // for new data, append a circle
        .attr("cx", d => xLinearScale(d[chosenXAxis])) // put the circle at correct pixel via calculation
        .attr("cy", d => yLinearScale(d[chosenYAxis])) 
        .attr("r", 8)
        .attr("fill", "blue")
        .attr("stroke", "blue")
        .attr("stroke-width", "8")
        .attr("text", "t")
        .attr("opacity", "0.5")

    // bind the data to text markers
    textGroup = ChartGroup.selectAll("text")
        .data(data) // bind data to circles
        .enter().append("text") // for new data, append a circle
        .attr("class", "markertext")
        .attr("dx", d => xLinearScale(d[chosenXAxis]) -6) // put the circle at correct pixel via calculation
        .attr("dy", d => yLinearScale(d[chosenYAxis]) +3) 
        .text(d => d.abbr)
        .attr("fill", "white")

    // create D3 axis objects
    var leftAxis = d3.axisLeft(yLinearScale);
    var bottomAxis = d3.axisBottom(xLinearScale);

    // within the marker group add another group for bottom axis
    xAxis = ChartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    yAxis = ChartGroup.append("g")
        .call(leftAxis);

    // Add x-axis labels to a new group
    var xlabelsGroup = ChartGroup.append("g")
        .attr("transform", `translate(${width/2}, ${height + 20})`);

    incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20) // Shift down to bottom of the chart group
        .text("Median Household Income")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .classed("active", true)
        .classed("inactive", false)
        .attr("value", "income");
    
    povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40) // Shift down to bottom of the chart group
        .text("Poverty (% of Pop.)")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .classed("active", false)
        .classed("inactive", true)
        .attr("value", "poverty");

    ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60) // Shift down to bottom of the chart group
        .text("Meadian Age")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .classed("active", false)
        .classed("inactive", true)
        .attr("value", "age");


    // Add y-axis labels to a new group
    var ylabelsGroup = ChartGroup.append("g")

    obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0-height/2)
        .attr("y", 0 - 40)
        .text("Obesity (% of Pop.)")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .classed("active", true)
        .classed("inactive", false)
        .attr("value", "obesity");

    smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0-height/2)
        .attr("y", 0 - 60)
        .text("Smoking (% of Pop.)")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .classed("active", false)
        .classed("inactive", true)
        .attr("value", "smokes");
    
    healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0-height/2)
        .attr("y", 0 - 80)
        .text("Lacking Healthcare (% of Pop.)")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .classed("active", false)
        .classed("inactive", true)
        .attr("value", "healthcare");
    
    // define tooltip parameters
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .html(function(d) {
        return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`);
    });
    
    // define tooltip parameters
    var toolTippointer = d3.tip()
    .attr("class", "tooltippointer")
    .html("")

    textGroup.call(toolTip);
    textGroup.call(toolTippointer);

    // show tooltip on mouseover the text within the marker
    textGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    toolTippointer.show();
    })

    // hide tooltip on mouseout of the circle
    circleGroup.on("mouseout", function(data) {
        toolTip.hide(data, this);
        toolTippointer.hide();
    })

    return [xlabelsGroup, ylabelsGroup];
  
}

function updateChart(data, chosenXAxis, chosenYAxis){

    circleGroup = renderCircles(circleGroup, xScale(data, chosenXAxis), chosenXAxis, yScale(data, chosenYAxis), chosenYAxis);
    textGroup = renderText(textGroup, xScale(data, chosenXAxis), chosenXAxis, yScale(data, chosenYAxis), chosenYAxis);

    xAxis = renderXAxis(xScale(data, chosenXAxis), xAxis)
    yAxis = renderYAxis(yScale(data, chosenYAxis), yAxis)

    // define tooltip parameters
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .html(function(d) {
    return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`);
    });

    // define tooltip parameters
    var toolTippointer = d3.tip()
    .attr("class", "tooltippointer")
    .html("")

    textGroup.call(toolTip);
    textGroup.call(toolTippointer);

    // show tooltip on mouseover the text within the marker
    textGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    toolTippointer.show();
    })

    // hide tooltip on mouseout of the circle
    circleGroup.on("mouseout", function(data) {
        toolTip.hide(data, this);
        toolTippointer.hide();
    })


    // changes classes to change bold text
    if (chosenXAxis === "income") {
        incomeLabel
        .classed("active", true)
        .classed("inactive", false);
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        ageLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if(chosenXAxis === "poverty") {
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
        povertyLabel
        .classed("active", true)
        .classed("inactive", false);
        ageLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else{
        incomeLabel
        .classed("active", false)
        .classed("inactive", true);
        povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        ageLabel
        .classed("active", true)
        .classed("inactive", false);
    }

    // changes classes to change bold text
    if (chosenYAxis === "obesity") {
        obesityLabel
        .classed("active", true)
        .classed("inactive", false);
        smokesLabel
        .classed("active", false)
        .classed("inactive", true);
        healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if(chosenYAxis === "smokes") {
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
        smokesLabel
        .classed("active", true)
        .classed("inactive", false);
        healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else{
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
        smokesLabel
        .classed("active", false)
        .classed("inactive", true);
        healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
    }
}


//-----------------------------------------------------------------------
// Load csv data and draw chart
//-----------------------------------------------------------------------

d3.csv("/assets/data/data.csv").then(function(data) { // Use promise object to load csv data

    data.forEach(function(data) { 
        data.poverty = +data.poverty; // Clean numerical data that will be used on chart
        data.income = +data.income;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes; 
    });

    console.log(data)
    chosenXAxis = 'income';
    chosenYAxis = 'obesity';
    labelGroups = initChart(data);

    // x axis labels event listener
    labelGroups[0].selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        console.log(chosenXAxis, chosenYAxis)

        updateChart(data, chosenXAxis, chosenYAxis);
        }
    });

    // y axis labels event listener
    labelGroups[1].selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;
        console.log(chosenXAxis, chosenYAxis)

        updateChart(data, chosenXAxis, chosenYAxis);
        }
    });

});
