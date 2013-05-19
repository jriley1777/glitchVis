
var units = "People";

//this is the svg canvas attributes: (not buidlign abything just seeting up varaibels)
var margin = {top: 10, right: 10, bottom: 10, left: 10}, //comma is the equivalent of var : 
    width = 2000 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;


var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20b();//CHANGE


// append the svg canvas to the page
var svg = d3.select("#chart").append("svg") //will select the id of cahrt from index.html ln:135 --> # looks for the id= from html
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g") //group everything on the vancas together.  will edit down on ln38 below
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#bar1").append("svg")
    .attr("width", 450)
    .attr("height", 200);

// Set the sankey diagram properties
var sankey = d3.sankey() //calling the function
    .nodeWidth(10)
    .nodePadding(20)
    .size([width, height]);

var path = sankey.link(); //sankey.link() is something happening in sankey.js 

// load the data
d3.json("data/clusterdata.json", function(error, graph) { //this is in the data folder

  sankey.nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

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
      .sort(function(a, b) { return b.dy - a.dy; });  

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
      .on("mouseover", nodemouseover)
      .on("mouseout", nodemouseout)
    .append("title")
      .text(function(d) { 
      return d.name + "\n" + format(d.value); });

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name.replace(/-.*/, ""); })
      //.style("font-size", 5)
    .filter(function(d) { return d.x < width / 2; })//positioning left or right of node
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  // // the function for moving the nodes
  //   function dragmove(d) {
  //     d3.select(this).attr("transform", 
  //         "translate(" + d.x + "," + (
  //                 d.y = Math.max(0, Math.min(height/2 - d.dy, d3.event.y))
  //             ) + ")");
  //     sankey.relayout();
  //     link.attr("d", path);
  //   }

  //CREATING A BARCHART
  svg2.selectAll("rect")
      .data(graph.links)
      .enter().append("rect")
      .attr("width",10)
      .attr("height",function(d){return d.value})
      .attr("x",function(d,i){return i*11})
      .attr("y",function(d){return 200-d.value})
      .style("fill","steelblue");



  function onmouseover(d) {
  };

  function onmouseout(d) {
  };

// crab = d3.select("#crabland")
//          .append("svg")
//           .attr("width", 1600)
//           .attr("height", 800)
//           .style("pointer-events", "all")
//           .on("mousemove", particle);

// function particle(d){
//     var m = d3.mouse(this) // this = whatever you are are selecting "this", you are controlling this by only calling the function on links (not nodes)
//       console.log(m);
//       crab.append("image")
//       .attr("xlink:href","assets/graphics/happycrab2.gif")
//       .attr("x", m[0])
//       .attr("y", m[1])
//       .attr("width", Math.random()*700)
//       .attr("height", Math.random()*700)
//       .transition()
//       .ease("elastic")
//       .attr("x", m[0]+(Math.random()*2-1)*400)
//       .attr("y", m[1]+(Math.random()*2-1)*400)
//       .delay(500)
//       .duration(15000)
//       .remove();
//     }

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

//select all of our links and set a new stroke color on the conditioan that the value is =.01. 
d3.selectAll(".link")
      .style("stroke-opacity", function(d){ 
              console.log(d);
              if(d.value == 0.01) return 0;
              });


});
