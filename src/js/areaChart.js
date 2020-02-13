const svg = d3.select('svg')
	.attr('width', 900)
	.attr('height', 500);

let width = +svg.attr('width'),
	height = +svg.attr('height');

const render = data => {
	const xValue = d => d.year,
		yValue = d => d.population,
		margin = { top: 20, right: 20, bottom: 50, left: 80 },
		innerWidth = width - margin.left - margin.right,
		innerHeight = height - margin.top - margin.bottom,
		circleRadius = 6;

	const xScale = d3.scaleTime()
		.domain(d3.extent(data, xValue))
		.range([0, innerWidth])
		.nice();

	const yScale = d3.scaleLinear()
		.domain([0, d3.max(data, yValue)])
		.range([innerHeight, 0])
		.nice();

	const xAxis = d3.axisBottom(xScale)
		.ticks(6)
		.tickSize(-innerHeight)
		.tickPadding(15);

	const yAxisTickFormat = number => 
		d3.format('.1s')(number)
			.replace("G", "B");

	const yAxis = d3.axisLeft(yScale)
		.tickFormat(yAxisTickFormat)
		.tickSize(-innerWidth)
		.tickPadding(15);

	const g = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

	// Drawing
	const areaGenerator = d3.area()		
	    .x(d => xScale(xValue(d)))
	    .y0(innerHeight)
	    .y1(d => yScale(yValue(d)))
	    .curve(d3.curveBasis);

	g.append('path')
		.attr('class', 'area-path')
		.attr('d', areaGenerator(data))

	const yAxisG = g.append('g').call(yAxis);
	yAxisG.selectAll('.domain').remove();

	yAxisG.append('text')
		.attr('fill', 'black')
		.attr('y', -60)
		.attr('x', -innerHeight / 2)
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
		.text('Population')

	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`);

	xAxisG.select('.domain').remove();

	xAxisG.append('text')
		.attr('fill', 'black')
		.attr('y', 50)
		.attr('x', innerWidth / 2)
		.text('Time')

	svg.append('text')
		.attr('y', 10)
		.attr('x', width / 2)
		.text('World population')

}

d3.csv('population.csv').then(data => {
	data.forEach(d => {
      d.population = +d.population;
      d.year = new Date(d.year);
	})
	render(data);
})