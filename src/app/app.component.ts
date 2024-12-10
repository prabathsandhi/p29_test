import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import * as d3 from 'd3';

// Define a type for the chart data
interface ChartData {
  year: number;
  value: number;
}

@Component({
  selector: 'app-root',
  standalone: true, // Declare this as a standalone component
  imports: [FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public loggedIn = false;
  public username = '';
  public password = '';
  public summary: any;
  public techStack: any;
  public chartData: ChartData[] = [];

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Check if we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        this.loggedIn = true;
        this.getDashboardData();
      }
    }
  }

  login() {
    if (this.username === 'John' && this.password === 'John') {
      // Mock a JWT token for demonstration
      const token = 'mockJwtToken';
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      this.loggedIn = true;
      this.getDashboardData();
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials');
    }
  }

  getDashboardData() {
    // Mocked data from the backend
    this.summary = {
      text: (
        "Generative AI refers to a class of algorithms that can generate new content such as images, music, and text. "
        + "This innovative technology has been particularly revolutionary in recent years, with remarkable advances made in "
        + "areas like natural language processing and computer vision. Models like OpenAI's GPT and DALL·E can now generate "
        + "human-like text or create photorealistic images from text prompts. This opens up possibilities in various sectors "
        + "such as entertainment, healthcare, and education. For instance, AI is already being used to generate new artwork in "
        + "the gaming industry, and in healthcare, it can assist in the creation of novel molecules for drug development. "
        + "However, with all these exciting advancements, generative AI also poses significant ethical challenges, such as "
        + "concerns about misinformation, deepfakes, and intellectual property. As this technology continues to evolve, it "
        + "will be important to navigate these issues carefully and responsibly."
      ),
      source: 'https://www.techtarget.com/searchenterpriseai/definition/generative-AI'
    };

    this.techStack = {
      frontend: 'Angular',
      backend: 'Mocked Backend',
      database: 'Mocked Database',
      authentication: 'JWT (Mocked)',
      infrastructure: 'Standalone Angular Application'
    };

    this.getChartData();
  }

  getChartData() {
    // Mocked chart data
    this.chartData = [
      { year: 2020, value: 30 },
      { year: 2021, value: 40 },
      { year: 2022, value: 50 },
      { year: 2023, value: 70 },
    ];

    // Now render the chart after the data is available
    setTimeout(() => this.renderChart(), 0);
  }

  renderChart() {
    const data: ChartData[] = this.chartData;
    console.log('Rendering chart with data:', data);

    // Set up chart dimensions and margin
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart if it exists
    d3.select('#chartContainer').selectAll('*').remove();

    // Create the chart
    const svg = d3.select('#chartContainer')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.year.toString()))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.value)!])
      .nice()
      .range([height, 0]);

    // Append bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: ChartData) => x(d.year.toString())!)
      .attr('y', (d: ChartData) => y(d.value!)!)
      .attr('width', x.bandwidth())
      .attr('height', (d: ChartData) => height - y(d.value!)!)
      .attr('fill', 'steelblue');

    // Add axes
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }
}
