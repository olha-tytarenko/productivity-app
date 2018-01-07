const reportsTemplate = require('./reports.hbs');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

export class Reports {
  constructor(element, router) {
    this.element = element;
    this.router = router;
    this.router.add('#reports', this.render.bind(this));
  }

  render() {
    this.element.innerHTML = reportsTemplate();
    const myChart = Highcharts.chart('containerChart', {
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['Urgent', 'High', 'Middle', 'Low', 'Failed'],
        labels: {
          style: {
            color: '#fff'
          },
          formatter: function () { return this.value.toUpperCase(); }
        },
        tickWidth: 0,
        lineWidth: 1.5,
        showEmpty: false
      },
      yAxis: {
        title: {
          text: ''
        },
        allowDecimals: false,
        gridLineColor: '#2380B5',
        lineWidth: 1.5,
        gridLineWidth: 0.3,
        labels: {
          style: {
            color: '#fff'
          }
        }
      },
      colors: ['#F75C4C', '#FFA841', '#FDDC43', '#1ABC9C', '#C8C8C8'],
      series: 
      [{
        borderColor: 'transparent',
        name: 'Urgent',
        data: [2, null, null, null, null]
      }, {
        borderColor: 'transparent',
        name: 'High',
        data: [0, 1, 0, 0, 0]
      }, {
        borderColor: 'transparent',
        name: 'Middle',
        data: [0, 0, 2, 0, 0]
      }, {
        borderColor: 'transparent',
        name: 'Low',
        data: [0, 0, 0, 3, 0]
      }, {
        borderColor: 'transparent',
        name: 'Failed',
        data: [0, 0, 0, 0, 1]
      }]
    });
  }

  addListeners() {

  }
}
