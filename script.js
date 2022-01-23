const bar_chart = document.querySelector('.bar-chart');
const bar_chart_context = bar_chart.getContext('2d');
const names_canvas = document.querySelector('.people-names');
const names_canvas_context = names_canvas.getContext('2d');
const chart_title = document.querySelector('.chart-title');
const filter_btn = document.querySelector('.dropdown-btn');
const filter_age_btn = document.getElementById('filter-age-btn');
const filter_salary_btn = document.getElementById('filter-salary-btn');
const dropdown_content = document.querySelector('.dropdown-content');

class App {
	async getData(cb) {
		const request = await fetch('data.json');
		const data = await request.json();
		if (request.ok) {
			console.log('ok');
			cb(data);
		}
	}
}

class UI {
	constructor(data) {
		this.people = data;

		this.updateChartTitle('Age');
		filter_btn.addEventListener('click', this.showFilterContents);
		filter_age_btn.addEventListener('click', (e) => {
			this.setupCanvas();
			this.displayPeopleData(data, e.target.innerText.toLowerCase());
			this.updateChartTitle(e.target.innerText);
		});
		filter_salary_btn.addEventListener('click', (e) => {
			this.setupCanvas();
			this.displayPeopleData(data, e.target.innerText.toLowerCase());
			this.updateChartTitle(e.target.innerText);
		});
		window.addEventListener('click', this.hideFilterContents);
		window.addEventListener('resize', () => {
			this.setupCanvas();
			this.displayPeopleData(data);
		});
	}

	displayPeopleData(data, selected_metric = 'age') {
		// Sort data, then Filter data
		data = data.sort((person1, person2) => person2[selected_metric] - person1[selected_metric]);

		// Display rectangles for each person
		// Bar heights can be fixed
		// Spacing between bar heights can be fixed
		const bar_height = bar_chart.height / (data.length * 2);
		const y_offset = bar_height * 1.75;

		const metric = data.map((person) => person[selected_metric]);
		const max_value = Math.max(...metric);
		const x_scale = bar_chart.width / (max_value * 1.2);
		const top_margin = y_offset / 2;

		for (let i = 0; i < data.length; i++) {
			// Draw Bars (age / salary)
			bar_chart_context.moveTo(0, y_offset * i);
			bar_chart_context.fillStyle = '#4267B2';
			bar_chart_context.fillRect(0, y_offset * i + top_margin, data[i][selected_metric] * x_scale, bar_height);

			// Draw Values
			bar_chart_context.fillStyle = 'green';
			bar_chart_context.font = '1rem serif';
			bar_chart_context.fillText(
				data[i][selected_metric],
				data[i][selected_metric] * x_scale + 5,
				y_offset * i + top_margin * 1.75
			);

			// Draw Names
			names_canvas_context.fillStyle = 'black';
			names_canvas_context.font = '1rem serif';
			names_canvas_context.fillText(data[i].name, 0, y_offset * i + top_margin / 0.55);
		}
	}

	setupCanvas() {
		// Setup dimensions
		bar_chart.height = window.innerHeight / 2;
		bar_chart.width = window.innerWidth / 2;
		names_canvas.height = bar_chart.height;
		names_canvas.width = bar_chart.width / 15;
		// Clear canvas
		bar_chart_context.clearRect(0, 0, bar_chart.width, bar_chart.height);
		names_canvas_context.clearRect(0, 0, names_canvas.width, names_canvas.height);
	}

	showFilterContents() {
		dropdown_content.style.display = 'block';
	}

	hideFilterContents(e) {
		if (!e.target.matches('.dropdown-btn')) {
			dropdown_content.style.display = 'none';
		}
	}

	updateChartTitle(title) {
		chart_title.innerText = title;
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	app.getData((data) => {
		const ui = new UI(data);
		ui.setupCanvas();
		ui.displayPeopleData(data);
	});
});
