import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function WeightChart({ measures }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);//Reference to the Chart instance

  useEffect(() => {
    if (!chartRef.current || !measures || measures.length === 0) return;

    const labels = measures.map((measure) => new Date(measure.date).toLocaleDateString()).reverse();//Reverse the labels array
    const weights = measures.map((measure) => measure.weight).reverse();//Reverse the weights array

    if (chartInstance.current) {
      chartInstance.current.destroy();//Destroy the existing chart instance
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Weight',
          data: weights,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        }],
      },
      options: {
        scales: {
          x: {
            type: 'category',
            labels: labels,
          },
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value) {
                return value + ' Kg';//Add 'Kg' to the tick label
              }
            }
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();//Cleanup: destroy the chart when the component unmounts
      }
    };
  });//Empty dependency array

  return <canvas className='' ref={chartRef} />;
}

export default WeightChart;
