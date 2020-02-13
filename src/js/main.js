const svg = d3.select('.oneYearGraph')
	.attr('width', 900)
	.attr('height', 200);

let width = +svg.attr('width'),
	height = +svg.attr('height'),
	margin = { top: 20, right: 0, bottom: 50, left: 30 },
	innerWidth = width - margin.left - margin.right,
	innerHeight = height - margin.top - margin.bottom,
	mainValue = d => d.month,
	dashValue = d => d.dashed,
	yValue = d => d.percent;

const xScale = d3.scaleTime()
	.range([0, innerWidth - 30]);

const yScale = d3.scaleLinear()
	.range([innerHeight, 0])
	.nice();

const lineGenerator = d3.line()		
    .x(d => xScale(mainValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(d3.curveCardinal);

const lineGeneratorDashed = d3.line()		
    .x(d => xScale(mainValue(d)))
    .y(d => yScale(dashValue(d)))
    .curve(d3.curveCardinal);

var parseDate = d3.timeParse("%m/%d/%Y");

const render = data => {
	xScale
		.domain(d3.extent(data, mainValue))
		.nice(data.length);

	yScale.domain([
		d3.min(data, function(d) {
			return Math.min(yValue(d), dashValue(d)) - 10; }), 
		d3.max(data, function(d) {
			return Math.max(yValue(d), dashValue(d)); })
	]);


	const g = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
	const xAxis = d3.axisBottom(xScale)
		.tickSize(-innerHeight)
        .tickFormat(d3.timeFormat("%B"))
		.tickPadding(15);
	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`)
		.attr('class', 'xAxis');

	const yAxis = d3.axisLeft(yScale)
		.tickSize(-innerWidth)
		.tickPadding(15);
	const yAxisG = g.append('g').call(yAxis);
	yAxisG.selectAll('.domain').remove();

	var path = g.append('path')
		.attr('class', 'line-path')
	    .attr("stroke", "steelblue")
	    .attr("stroke-width", "2")
	    .attr("fill", "none")
		.attr('d', lineGenerator(data));

	var totalLength = path.node().getTotalLength();

	path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(5000)
        .ease(d3.easeQuadInOut)
        .attr("stroke-dashoffset", 0);

    g.selectAll("rect")
		.data(data)
		.enter().append("rect")
		.attr('width', 2)
		.attr('y', d => yScale(yValue(d)))
		.attr('x', d => xScale(mainValue(d)))
	    .transition()
	    	.delay(function(d, i) { return i * 400; })
	    	.duration(1000)
        	.ease(d3.easeSin)
			.attr('height', 500)

    g.selectAll("dot")
		.data(data)
		.enter().append("circle")
		.attr("r", 5)
		.attr('cy', height - 25)
		.attr('opacity', 0)
		.attr('cx', d => xScale(mainValue(d)))
	    .transition()
	    	.delay(function(d, i) { return i * 400; })
	    	.duration(1000)
        	.ease(d3.easeSin)
			.attr('opacity', 1)

	if(data[0].dashed){
		var path = g.append('path')
			.attr('class', 'line-path')
		    .attr("stroke", "steelblue")
		    .attr("stroke-width", "2")
		    .attr("fill", "none")
			.attr('d', lineGeneratorDashed(data));

		var totalLength = path.node().getTotalLength();
		var dashing = "10, 10"

		var dashLength =
		    dashing
		        .split(/[\s,]/)
		        .map(function (a) { return parseFloat(a) || 0 })
		        .reduce(function (a, b) { return a + b });

		var dashCount = Math.ceil( totalLength / dashLength );

		var newDashes = new Array(dashCount).join( dashing + " " );

		var dashArray = newDashes + " 0, " + totalLength;

		path
		    .attr("stroke-dashoffset", totalLength)
	        .attr("stroke-dasharray", dashArray)
		    .transition()
	    	.duration(3000)
	    	.attr("stroke-dashoffset", 0);
	}

}

d3.csv('rails.csv').then(data => {
	data.forEach(d => {
      d.percent = +d.percent;
      d.dashed = +d.dashed;
      d.month = parseDate(d.month);

      // d.month = new Date(d.month);
	})
	render(data);
})