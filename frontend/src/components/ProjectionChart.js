import React from 'react';
import { Line } from 'react-chartjs-2';

function ProjectionChart({ data }) {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Cumulative Cash Flow',
        data: data.map(item => item.cumulative_cash),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <div>
      <h2>Liquidity Projection</h2>
      <Line data={chartData} />
    </div>
  );
}

export default ProjectionChart;
