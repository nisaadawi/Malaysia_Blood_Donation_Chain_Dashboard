// Load CSV and initialize dashboard
window.addEventListener('DOMContentLoaded', () => {
  Papa.parse('data_darah_2020_2025.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      setupDashboard(data);
    }
  });
});

function setupDashboard(data) {
  // Extract unique filter values
  const dates = [...new Set(data.map(row => row.Date))].sort();
  const states = [...new Set(data.map(row => row.State))].sort();
  const hospitals = [...new Set(data.map(row => row.Hospital))].sort();

  populateFilter('dateFilter', dates);
  populateFilter('stateFilter', states);
  populateFilter('hospitalFilter', hospitals);

  // Initial filter state
  let filter = {
    date: '',
    state: '',
    hospital: ''
  };

  // Event listeners
  document.getElementById('dateFilter').addEventListener('change', e => {
    filter.date = e.target.value;
    updateCharts();
  });
  document.getElementById('stateFilter').addEventListener('change', e => {
    filter.state = e.target.value;
    updateCharts();
  });
  document.getElementById('hospitalFilter').addEventListener('change', e => {
    filter.hospital = e.target.value;
    updateCharts();
  });

  // Chart instances
  let charts = {};

  function updateCharts() {
    // Filter data
    let filtered = data.filter(row =>
      (!filter.date || row.Date === filter.date) &&
      (!filter.state || row.State === filter.state) &&
      (!filter.hospital || row.Hospital === filter.hospital)
    );
    if (filtered.length === 0) filtered = data; // fallback

    // Prepare chart data
    const sum = (key) => filtered.reduce((a, b) => a + (parseInt(b[key]) || 0), 0);

    // Blood Type
    const bloodTypeData = ['Blood_a','Blood_b','Blood_o','Blood_ab'].map(sum);
    // Location
    const locationData = ['Location_centre','Location_mobile'].map(sum);
    // Donation Type
    const donationTypeData = ['Type_wholeblood','Type_apheresis_platelet','Type_apheresis_plasma','Type_other'].map(sum);
    // Social Group
    const socialGroupData = ['Social_civilian','Social_student','Social_policearmy'].map(sum);
    // Donor Type
    const donorTypeData = ['Donations_new','Donations_regular','Donations_irregular'].map(sum);

    // Update or create charts
    charts.bloodType = updateChart(
      charts.bloodType,
      'bloodTypeChart',
      ['A', 'B', 'O', 'AB'],
      bloodTypeData,
      'Blood Type Distribution',
      ['#e74c3c','#f1c40f','#3498db','#9b59b6']
    );
    charts.location = updateChart(
      charts.location,
      'locationChart',
      ['Centre', 'Mobile'],
      locationData,
      'Donation Location',
      ['#2ecc71','#e67e22']
    );
    charts.donationType = updateChart(
      charts.donationType,
      'donationTypeChart',
      ['Whole Blood','Apheresis Platelet','Apheresis Plasma','Other'],
      donationTypeData,
      'Donation Type',
      ['#1abc9c','#34495e','#e67e22','#95a5a6']
    );
    charts.socialGroup = updateChart(
      charts.socialGroup,
      'socialGroupChart',
      ['Civilian','Student','Police/Army'],
      socialGroupData,
      'Social Group',
      ['#16a085','#2980b9','#c0392b']
    );
    charts.donorType = updateChart(
      charts.donorType,
      'donorTypeChart',
      ['New','Regular','Irregular'],
      donorTypeData,
      'Donor Type',
      ['#8e44ad','#27ae60','#f39c12']
    );
  }

  // Initial chart render
  updateCharts();
}

function populateFilter(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">All</option>' +
    values.map(v => `<option value="${v}">${v}</option>`).join('');
}

function updateChart(chart, canvasId, labels, data, label, colors) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
    return chart;
  }
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: colors,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

// Add PapaParse CDN
const papaScript = document.createElement('script');
papaScript.src = 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js';
document.head.appendChild(papaScript); 