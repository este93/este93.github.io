var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var parse = d3.timeFormat("%b %Y").parse;

// Scales and axes. Note the inverted domain for the y-scale: bigger is up!
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    xAxis = d3.axisBottom(x).tickSize(-height);
    // xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);

// An area generator, for the light fill.
var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

// A line generator, for the dark stroke.
var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

d3.csv("readme.csv")
  .then(function(data) {
    // Filter to one symbol; the S&P 500.
    var values = data.filter(function(d) {
      return d.symbol == "AMZN";;
    });

    var msft = data.filter(function(d) {
      return d.symbol == "MSFT";
    });

    var ibm = data.filter(function(d) {
      return d.symbol == 'IBM';
    });

    // Compute the minimum and maximum date, and the maximum price.
    x.domain([values[0].date, values[values.length - 1].date]);
    y.domain([80, d3.max(values, function(d) { return d.price; })]).nice();

    // Add an SVG element with the desired dimensions and margin.
    var svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Add the clip path.
    svg.append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    var colors = d3.scale.category10();
    svg.selectAll('.line')
      .data([values, msft, ibm])
      .enter()
        .append('path')
          .attr('class', 'line')
          .style('stroke', function(d) {
            return colors(Math.random() * 50);
          })
          .attr('clip-path', 'url(#clip)')
          .attr('d', function(d) {
            return line(d);
          })

    /* Add 'curtain' rectangle to hide entire graph */
    var curtain = svg.append('rect')
      .attr('x', -1 * width)
      .attr('y', -1 * height)
      .attr('height', height)
      .attr('width', width)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#ffffff')

    /* Create a shared transition for anything we're animating */
    var t = svg.transition()
      .delay(0)
      .duration(2000)
      .ease('ease in')
      .each('end', function() {
        d3.select('line.guide')
          .transition()
          .style('opacity', 0)
          .remove()
      });

    t.select('rect.curtain')
      .attr('width', 0);
    t.select('line.guide')
      .attr('transform', 'translate(' + width + ', 0)')
  })
  .catch(function(error){
     // handle error   
  })

// Parse dates and numbers. We assume values are sorted by date.
function type(d) {
  d.date = parse(d.date);
  d.price = +d.price;
  return d;
}
