
var units = "People";
var months = [{month:"Nov-11",value:4573,loss:null},{month:"Dec-11",value:4632,loss:1.01},
              {month:"Jan-12",value:4029,loss:.87},{month:"Feb-12",value:2651,loss:.66},
              {month:"Mar-12",value:2013,loss:.76},{month:"Apr-12",value:2039,loss:1.01},
              {month:"May-12",value:2105,loss:1.03},{month:"Jun-12",value:2016,loss:.96},
              {month:"Jul-12",value:1663,loss:.82},{month:"Aug-12",value:1735,loss:1.04},
              {month:"Sep-12",value:2092,loss:1.21},{month:"Oct-12",value:2315,loss:1.11},
              {month:"Nov-12",value:2193,loss:.95},{month:"Dec-12",value:723,loss:.33}];

//this is the svg canvas attributes: (not buidlign abything just seeting up varaibels)
var margin = {top: 40, right: 20, bottom: 40, left: 100}, //comma is the equivalent of var : 
    width = 1200 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;


var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20b();//CHANGE

var axisScale = d3.scale.linear()
                  .domain([4600,0])
                  .range([0, height]);

//Create the Axis
var yAxis = d3.svg.axis()
              .scale(axisScale)
              .orient("left")
              .ticks(10);

// append the svg canvas to the page
var svg = d3.select("#chart").append("svg") //will select the id of cahrt from index.html ln:135 --> # looks for the id= from html
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") //group everything on the vancas together.  will edit down on ln38 below
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + -height + ")");

// Set the sankey diagram properties
var sankey = d3.sankey() //calling the function
    .nodeWidth(15)
    .nodePadding(0)
    .size([width, height]);

var path = sankey.link(); //sankey.link() is something happening in sankey.js 

svg.selectAll("text.values")
  .data(months)
  .enter()
  .append("text")
  .text(function(d){return d.value})
  .attr("x",function(d,i){return i*82-margin.left-5})
  .attr("y",20)
  .attr("transform", function(d){ 
          return "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + -(d.value/10+15) + ")";});

svg.selectAll("text.loss")
  .data(months)
  .enter()
  .append("text")
  .text(function(d){return d.loss})
  .attr("x",function(d,i){return i*82-margin.left-5})
  .attr("y",20)
  .attr("transform", function(d){ 
          return "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + -(d.value/10-5) + ")";});

svg.selectAll("text.months")
  .data(months)
  .enter()
  .append("text")
  .text(function(d){return d.month})
  .attr("x",function(d,i){return i*82-margin.left-10})
  .attr("y",20)
  .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ") scale(1,-1) translate(" + 0 + "," + margin.bottom + ")");

// load the data
d3.json("data/12months.json", function(error, graph) { //this is in the data folder

  sankey.nodes(graph.nodes)
    .links(graph.links)
    .layout(0);

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path) //d??? look it up later 
      // .style("stroke",function(d){
      //   if(i.source.node == 8 && i.target.node == 14){
      //   return "transparent";
      // }})
      .style("stroke-width", function(d) { return Math.max(.5, d.dy); })   //setting the stroke length by the data . d.dy is defined in sankey.js
      .sort(function(a, b) { return b.dy - a.dy; })
      .on("mouseover",linkmouseover)
      .on("mouseout",linkmouseout);  

// add the link titles
  link.append("svg:title") //this is the mouseover stuff title is an svg element you can use "svg:title" or just "title"
         .text(function(d) {
        return d.source.name + " --> " + 
                d.target.name + "\n" + format(d.value); });

// add in the nodes (creating the groups of the rectanlges)
  var node = svg.append("g").selectAll(".node") 
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
          return "translate(" + d.x + "," + d.y + ")";
      });
    //.call(d3.behavior.drag()   <---------- THIS IS THE DRAG THING TO REMOVE!!
      //.origin(function(d) { return d; })
      // .on("dragstart", function() {  //<-------- THIS IS MOUSEOVER DRAG CAPABILITIES .on(mousemove) called pointer events, look it up!
      // this.parentNode.appendChild(this); }) 
      // .on("drag", dragmove);
  
// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) {return d.dy; })
      .attr("width", sankey.nodeWidth(  ))
      .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); }) //matches name with the colors here! inside the replace is some sort of regex
      .style("stroke",function(d) { return d3.rgb(d.color).darker(1); }) //line around the box formatting
      .style("stroke-width",.5)
      .on("mouseover", nodemouseover)
      .on("mouseout", nodemouseout)
      .attr("cursor","pointer")
    .append("title")
      .text(function(d) { 
      return d.name + "\n" + format(d.value); });

// // add in the title for the nodes
//   node.append("text")
//       .attr("x", -6)
//       .attr("y", function(d) { return d.dy / 2; })
//       .attr("dy", ".35em")
//       .attr("text-anchor", "end")
//       .attr("transform", null)
//       .text(function(d) { return d.name.replace(/-.*/, ""); })
//       //.style("font-size", 5)
//     .filter(function(d) { return d.x < width / 2; })//positioning left or right of node
//       .attr("x", 6 + sankey.nodeWidth())
//       .attr("text-anchor", "start");

  // // the function for moving the nodes
  //   function dragmove(d) {
  //     d3.select(this).attr("transform", 
  //         "translate(" + d.x + "," + (
  //                 d.y = Math.max(0, Math.min(height/2 - d.dy, d3.event.y))
  //             ) + ")");
  //     sankey.relayout();
  //     link.attr("d", path);
  //   }


var status=null;
function nodemouseover(d){
  d3.selectAll(".link")
      .attr("id", function(i){
        if (i.source.node == d.node || i.target.node == d.node){
          status="clicked";
          console.log(status);
        } else {
          status=null;
        }
        return status;
        console.log(i.source.node,status);
    });
    }

function nodemouseout(d){
  d3.selectAll(".link")
      .attr("id", "unclicked");
    }
function linkmouseover(d){
  d3.select(this)
      .attr("stroke-opacity",.5);
    }
function linkmouseout(d){
  d3.select(this)
      .attr("stroke-opacity",.05);
    }

//select all of our links and set a new stroke color on the conditioan that the value is =.01. 
d3.selectAll(".link")
      .style("stroke-opacity", function(d){ 
              if(d.value == 0.01) return 0;
              });

//y axis
  svg.append("g")
      .call(yAxis)
      .attr("class", "axis")
      .attr("transform", 
        "translate(" + -45 + "," + 0 + ") scale(1,-1) translate(" + 0 + "," + -(height) + ")");
});
