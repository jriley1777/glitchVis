  
var units = "People";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(70)
    .nodePadding(13)
    .size([width, height]);

var path = sankey.link();

// load the data
d3.json("data/clusterdata.json", function(error, graph) {

  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
  link.append("title")
        .text(function(d) {
        return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value); });

// add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; });
    //.call(d3.behavior.drag()
      //.origin(function(d) { return d; })
      /*.on("dragstart", function() { 
      this.parentNode.appendChild(this); })
      .on("drag", dragmove));
*/  
// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { 
      return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke",function(d) { 
      return d3.rgb(d.color).darker(2); })
      .on("mouseover", onmouseover)
      .on("mouseout", onmouseout)
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
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

// the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform", 
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
});

  function onmouseover(d) {
    d3.selectAll(".link")
      .style("stroke-opacity",function(i){
        if (i.source.node == d.node || i.target.node == d.node) return 0.5;
      });
  };

  function onmouseout(d) {
        d3.selectAll(".link")
          .style("stroke-opacity", 0.1);
      };

crab = d3.select("#crabland")
         .append("svg")
          .attr("width", 1600)
          .attr("height", 800)
          .style("pointer-events", "all")
          .on("mousemove", particle);

function particle(d){
    var m = d3.mouse(this)
    crab.append("image")
      .attr("xlink:href","assets/graphics/musiccrab2.gif")
      .attr("x", m[0])
      .attr("y", m[1])
      .attr("width", Math.random()*400)
      .attr("height", Math.random()*400)
      .transition()
      .delay(500)
      .duration(5000)
      .ease("elastic")
      .remove();
    }