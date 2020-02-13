const svg = d3.select('svg')
	.attr('width', 900)
	.attr('height', 500);

let width = +svg.attr('width'),
	height = +svg.attr('height');

const render = data => {
	const xValue = d => d.timestamp,
		yValue = d => d.temperature,
		margin = { top: 20, right: 20, bottom: 50, left: 80 },
		innerWidth = width - margin.left - margin.right,
		innerHeight = height - margin.top - margin.bottom,
		circleRadius = 6;

	const xScale = d3.scaleTime()
		.domain(d3.extent(data, xValue))
		.range([0, innerWidth])
		.nice();

	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, yValue))
		.range([innerHeight, 0])
		.nice();

	const xAxis = d3.axisBottom(xScale)
		.tickSize(-innerHeight)
		.ticks(d3.timeDay.every(2))
		.tickFormat(d3.timeFormat("%a"))
		.tickPadding(15);

	const yAxis = d3.axisLeft(yScale)
		.tickSize(-innerWidth)
		.tickPadding(15);

	const g = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

	const yAxisG = g.append('g').call(yAxis);
	yAxisG.selectAll('.domain').remove();

	yAxisG.append('text')
		.attr('fill', 'black')
		.attr('y', -margin.left)
		.attr('x', -innerHeight / 2)
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
		.attr("dy", "1em")
		.text('Temperature')

	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`);

	xAxisG.select('.domain').remove();

	xAxisG.append('text')
		.attr('fill', 'black')
		.attr('y', 50)
		.attr('x', innerWidth / 2)
		.text('Time')

	// Drawing
	const lineGenerator = d3.line()		
	    // .x(d => xScale(xValue(d)))
	    // .y(d => yScale(yValue(d)))
	    .x(d => xScale(d.timestamp))
	    .y(d => yScale(d.temperature))
	    .curve(d3.curveBasis);

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
        .duration(2000)
        .ease(d3.easeQuadInOut)
        .attr("stroke-dashoffset", 0);

	g.append('text')
		.attr('y', -10)
		.attr("x", (innerWidth / 2))
		.attr("text-anchor", "middle")
		.text('A week in San Francisco')

}

d3.csv('temperatures.csv').then(data => {
	data.forEach(d => {
      d.temperature = +d.temperature;
      d.timestamp = new Date(d.timestamp);
	})
	render(data);
})