const svg = d3.select('svg')
	.attr('width', 900)
	.attr('height', 900);

let   svgWidth = svg.attr('width'),
	  svgHeight = svg.attr('height'),
	  eyeSize = 30,
	  eyeSpacing = 100,
	  eyeOffsetY = -70;

const eyesSizeInput = document.getElementById('eyesSize');

const g = svg.append('g')
	.attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);

const circle = g
	.append('circle')
		.attr('r', 200)
		.attr('stroke', 'black')
		.attr('fill', 'yellow');

const leftEye = g
	.append('circle')
		.attr('r', eyeSize)
		.attr('cx', -eyeSpacing)
		.attr('cy', eyeOffsetY)
		.attr('fill', 'black');

const rightEye = g
	.append('circle')
		.attr('r', eyeSize)
		.attr('cx', eyeSpacing)
		.attr('cy', eyeOffsetY)
		.attr('fill', 'black')
	.transition()
		.duration(2000)
		.attr('cy', eyeOffsetY - 30)
	.transition()
		.duration(2000)
		.attr('cy', eyeOffsetY);

const mouth = g
	.append('path')
		.attr('d', d3.arc()({
		  innerRadius: 150,
		  outerRadius: 170,
		  startAngle: Math.PI / 2,
		  endAngle: Math.PI * 3 / 2
		}));

eyesSize.addEventListener('input', function (evt) {
    leftEye.attr('r', this.value)
    rightEye.attr('r', this.value)
});