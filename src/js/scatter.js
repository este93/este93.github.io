const svg = d3.select('svg')
	.attr('width', 900)
	.attr('height', 500);

let width = +svg.attr('width'),
	height = +svg.attr('height');

const render = data => {
	const xValue = d => d.horsepower,
		yValue = d => d.weight,
		margin = { top: 20, right: 20, bottom: 50, left: 80 },
		innerWidth = width - margin.left - margin.right,
		innerHeight = height - margin.top - margin.bottom,
		circleRadius = 10;

	const xScale = d3.scaleLinear()
		.domain(d3.extent(data, xValue))
		.range([0, innerWidth])
		.nice();

	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, yValue))
		.range([0, innerHeight])
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
		.text('Weight')

	const xAxisG = g.append('g').call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`);

	xAxisG.select('.domain').remove();

	xAxisG.append('text')
		.attr('fill', 'black')
		.attr('y', 50)
		.attr('x', innerWidth / 2)
		.text('Horsepower')

	g.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
			.attr('cy', d => yScale(yValue(d)))
			.attr('cx', d => xScale(xValue(d)))
			.style('opacity', 0)
			.attr('r', circleRadius)
		.transition()
			.duration(2000)
			.style('opacity', .5)

	g.append('text')
		.attr('y', -10)
		.text('Cars: Horsepower vs. Weight')

}

d3.csv('cars.csv').then(data => {
	data.forEach(d => {
      d.mpg = +d.mpg;
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight;
      d.acceleration = +d.acceleration;
      d.year = +d.year;  
	})
	render(data);
})