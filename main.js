import './style.css';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(...registerables);

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Backtest & Line Chart App</h1>

    <label for="token">Alege token:</label>
    <select id="token">
      <option value="GBP/USD">GBP/USD</option>
      <option value="EUR/USD">EUR/USD</option>
      <option value="BTC/USD">BTC/USD</option>
      <option value="XAU/USD">GOLD</option>
      <option value="BTC/USD">BTC/USD</option>
    </select>

    <label for="start">Data de început:</label>
    <input type="date" id="start" value="2023-01-01"/>
    <input type="text" id="timeframe" value="1day"/>

    <button id="load">Încarcă grafic</button>

    <canvas id="chart" width="900" height="500"></canvas>
  </div>
`;

const API_KEY = "1e292684eb4d48aea57dc3f66ad2efa5"; // pune cheia ta reală
let myChart = null;

async function loadChart(token,timeframe,startDate) {
  const url = `https://api.twelvedata.com/time_series?symbol=${token}&interval=${timeframe}&apikey=${API_KEY}&start_date=${startDate}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.values || data.values.length === 0) {
    alert("Date lipsă sau simbol invalid!");
    console.log(data);
    return;
  }

  // Extragem doar data și prețul de închidere
  const lineData = data.values
    .map(v => ({
      x: new Date(v.datetime),
      y: parseFloat(v.close)
    }))
    .reverse();

  if (myChart) {
    myChart.destroy();
    myChart = null;
  }

  myChart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      datasets: [{
        label: token,
        data: lineData,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        tension: 0.2, // curbură linie
        pointRadius: 0 // fără puncte mari
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day' }
        },
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: { display: true }
      }
    }
  });
}

// Buton load
document.getElementById('load').addEventListener('click', () => {
  const token = document.getElementById('token').value;
  const startDate = document.getElementById('start').value;
  const timeframe = document.getElementById('timeframe').value;
  console.log(`Încărcare grafic pentru ${token} de la ${startDate} cu timeframe ${timeframe}`);
  loadChart(token,timeframe,startDate);
});
