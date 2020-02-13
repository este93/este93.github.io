const svg = d3.select('.verticalBar')
	.attr('width', 900)
	.attr('height', 500);

let width = +svg.attr('width'),
	height = +svg.attr('height');

const render = data => {
	const xValue = d => d.population;
	const yValue = d => d.country;
	const margin = { top: 20, right: 20, bottom: 50, left: 80 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const xScale = d3.scaleLinear()
		.domain([0, d3.max(data, xValue)])
		.range([0, innerWidth]);

	const xAxisTickFormat = number => 
		d3.format('.3s')(number)
			.replace("G", "B");

	const xAxis = d3.axisBottom(xScale)
		.tickFormat(xAxisTickFormat)
		.ticks(15)
		.tickSize(-innerHeight);

	const yScale = d3.scaleBand()
		.domain(data.map(yValue))
		.range([0, innerHeight])
		.paddingInner(0.05);

	const yAxis = d3.axisLeft(yScale);

	const g = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

	g.append('g').call(yAxis) //  yAxis(g.append('g'));
		.selectAll('.domain, g>line')
			.remove();

	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`);

	xAxisG.select('.domain').remove();

	xAxisG.append('text')
		.attr('fill', 'black')
		.attr('y', 50)
		.attr('x', innerWidth / 2)
		.text('Population')

	g.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
			.attr('y', d => yScale(yValue(d)))
			// .attr('width', d => xScale(xValue(d)))
			.attr('height', yScale.bandwidth())
		.transition()
			.duration(2000)
			.attr('width', d => xScale(xValue(d)))

	g.append('text')
		.attr('y', -10)
		.text('Top 10 Most Populous Countries')

}

d3.csv('countries.csv').then(data => {
	data.forEach(d => {
		d.population = +d.population * 1000;
	})
	render(data);
})