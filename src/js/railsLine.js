const svg = d3.select('svg')
	.attr('width', 900)
	.attr('height', 300);

let width = +svg.attr('width'),
	height = +svg.attr('height');

const render = data => {
	const xValue = d => d.month,
		yValue = d => d.percent,
		margin = { top: 20, right: 20, bottom: 50, left: 80 },
		innerWidth = width - margin.left - margin.right,
		innerHeight = height - margin.top - margin.bottom,
		circleRadius = 6;

	const xScale = d3.scaleBand()
		.domain(data.map(xValue))
		.range([0, innerWidth]);

	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, yValue))
		// .domain([80, d3.max(data, yValue)])
		.range([innerHeight, 0])
		.nice();

	const xAxis = d3.axisBottom(xScale)
		.tickSize(-innerHeight)
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
		.attr('y', -60)
		.attr('x', -innerHeight / 2)
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
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
	    .x(d => xScale(xValue(d)))
	    .y(d => yScale(yValue(d)))
	    .curve(d3.curveCardinal);

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

    g.selectAll("dot")
		.data(data)
		.enter().append("circle")
		.attr("r", 5)
		.attr('cy', d => yScale(yValue(d)))
		.attr('cx', d => xScale(xValue(d)))

	g.append('text')
		.attr('y', -10)
		.text('A week in San Francisco')

}

d3.csv('rails.csv').then(data => {
	data.forEach(d => {
      d.percent = +d.percent;
      // d.timestamp = new Date(d.timestamp);
	})
	render(data);
})