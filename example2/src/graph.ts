import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { debugObject } from ".";
// import Utils from "Utils";
// import Utils from "Utils";
// Register the required components
export class DebugGraph {
  public static chart: Chart;
  public static ctx: HTMLCanvasElement;
  static {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      Title,
      CategoryScale,
    );
  }

  public static initialiseGraph() {
    this.ctx = document.getElementById("debugGraphRef") as HTMLCanvasElement;
    this.chart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: [], // Time or frame number
        datasets: [
          {
            label: "Distance between Index Tip and MCP",
            data: [], // Distance values
            borderColor: "blue",
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            title: { display: true, text: "Time (s)" },
          },
          y: {
            title: { display: true, text: "Distance (px)" },
          },
        },
      },
    });
  }

  public static updateChart(time: number, distance: number) {
    if (this.chart && debugObject.showGraph) {
      this.chart.data.labels?.push(time);
      this.chart.data.datasets[0].data.push(distance);
      this.chart.update();
    }
  }

  public static updateData(index: number, data: number, color: string) {
    const dataset = this.chart.data.datasets;
    if (!dataset[index]) {
      dataset[index] = {
        label: "Distance between Index Tip and MCP",
        data: [], // Distance values
        borderColor: color,
        fill: true,
      };
    }
    dataset[index].data.push(data);
    this.chart.update();
  }

  public static resetChart = () => {
    if (this.chart.data && this.chart.data.datasets) {
      this.chart.data.labels = []; // Clear all labels
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data = []; // Clear the dataset data
      });

      this.chart.update(); // Update the chart to reflect the changes
    }
  };
}
