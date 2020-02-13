const svg = d3.select('svg')
	.attr('width', 900)
	.attr('height', 500);

let width = svg.attr('width'),
	height = svg.attr('height');

const colorScale = d3.scaleOrdinal()
	.domain(['apple', 'lemon'])
	.range(['red', 'yellow']);

const radiusScale = d3.scaleOrdinal()
	.domain(['apple', 'lemon'])
	.range([50, 30]);

const render = (selection, props) => {	
	const { fruits } = props;

	const bowl = selection.selectAll('rect')
		.data([null])
		.enter().append('rect')
			.attr('y', 110)
			.attr('width', 600)
			.attr('height', 300)
			.attr('fill', 'grey')
			.attr('rx', 300 / 2);

	const groups = selection.selectAll('g')
		.data(fruits);

	const groupsEnter = groups.enter().append('g');

	groupsEnter
		.merge(groups)		
			.attr('transform', (d, i) => 
				`translate(${i * 120 + 60}, ${height / 2})`
			);
	groups.exit().remove()

	const circles = groups.select('circle');

	groupsEnter.append('circle')
		.merge(circles)
			.attr('r', d => radiusScale(d.type))
			.attr('fill', d => colorScale(d.type))

	const text = groups.select('text');

	groupsEnter.append('text')
		.merge(text)		
			.text(d => d.type)
			.attr('y', 80)
}

const makeFruit = type => ({ type, id: Math.random() });

let fruits = d3.range(5)
	.map(() => makeFruit('apple'));

render(svg, { fruits })

const eatButton = document.getElementById('eat');
const updateButton = document.getElementById('update');

eatButton.addEventListener('click', () => {
	// fruits.pop()
	fruits = fruits.filter((d, i) => i !== 1);
	render(svg, { fruits })
});

updateButton.addEventListener('click', () => {
	fruits[2].type = "lemon";
	render(svg, { fruits })
});