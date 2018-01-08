import { Observer } from '../../observer';
import $ from 'jquery';

const reportsTemplate = require('./reports.hbs');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);


const chartConfigObject = {
  chart: {
    type: 'column',
    backgroundColor: 'transparent'
  },

  title: {
    text: ''
  },
  credits: {
    text: ''
  },

  exporting: {
    enabled: false
  },

  yAxis: {
    allowDecimals: false,
    min: 0,
    title: {
      text: ''
    },
    gridLineColor: '#2380B5',
    lineWidth: 1.5,
    gridLineWidth: 0.3,
    labels: {
      style: {
        color: '#fff'
      }
    }
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
  legend: {
    itemStyle: {
      color: '#8DA5B8',
      fontWeight: 'normal'
    },
    symbolRadius: 0,
    itemHoverStyle: {
      color: 'white'
    }
  },

  tooltip: {
    formatter: function () {
      return '<b>' + this.series.name.toUpperCase() + '</b><br/>'
        + '<br/>Tasks:' + this.y;
    }
  },

  colors: ['#F75C4C', '#FFA841', '#FDDC43', '#1ABC9C', '#C8C8C8'],

  plotOptions: {
    column: {
      stacking: 'normal'
    }
  },
  series: [{
    name: 'Urgent',
    borderWidth: 0,
    cursor: 'pointer'
  }, {
    name: 'High',
    borderWidth: 0,
    cursor: 'pointer'
  }, {
    name: 'Middle',
    borderWidth: 0,
    cursor: 'pointer'
  }, {
    name: 'Low',
    borderWidth: 0,
    cursor: 'pointer'
  }, {
    name: 'Failed',
    borderWidth: 0,
    cursor: 'pointer',
    color: '#8DA5B8'
  }]
};

export class ReportsView {
  constructor(element, router) {
    this.element = element;
    this.router = router;
    this.router.add('#reports', this.render.bind(this));

    this.renderDailyReportEvent = new Observer(this);
    this.renderWeeklyReportEvent = new Observer(this);
    this.renderMonthlyReportEvent = new Observer(this);
  }

  render() {
    this.element.innerHTML = reportsTemplate();
    $('.go-back').tooltip();
    this.renderSelectedReport('pomodoros');
    this.addListeners();
  }

  addListeners() {
    const dailyReportBtn = document.getElementById('dailyReport');
    const weeklyReportBtn = document.getElementById('weeklyReport');
    const monthlyReportBtn = document.getElementById('monthlyReport');
    const pomodorosReportBtn = document.getElementById('pomodorosReport');
    const tasksReportBtn = document.getElementById('tasksReport');
    const goToGlobalListBtn = document.getElementsByClassName('go-back')[0];

    goToGlobalListBtn.addEventListener('click', (event) => {
      event.preventDefault();

      this.router.navigate('#tasks-list');
    });

    dailyReportBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const type = pomodorosReportBtn.classList.contains('active') ? 'pomodoros' : 'tasks';

      this.removeClassName([weeklyReportBtn, monthlyReportBtn], 'active');
      dailyReportBtn.classList.add('active');

      this.renderDailyReportEvent.notify(type);
    });

    weeklyReportBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const type = pomodorosReportBtn.classList.contains('active') ? 'pomodoros' : 'tasks';

      this.removeClassName([dailyReportBtn, monthlyReportBtn], 'active');
      weeklyReportBtn.classList.add('active');

      this.renderWeeklyReportEvent.notify(type);
    });

    monthlyReportBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const type = pomodorosReportBtn.classList.contains('active') ? 'pomodoros' : 'tasks';

      this.removeClassName([dailyReportBtn, weeklyReportBtn], 'active');
      monthlyReportBtn.classList.add('active');

      this.renderMonthlyReportEvent.notify(type);
    });

    pomodorosReportBtn.addEventListener('click', (event) => {
      event.preventDefault();

      pomodorosReportBtn.classList.add('active');
      tasksReportBtn.classList.remove('active');

      this.renderSelectedReport('pomodoros');
    });

    tasksReportBtn.addEventListener('click', (event) => {
      event.preventDefault();

      tasksReportBtn.classList.add('active');
      pomodorosReportBtn.classList.remove('active');

      this.renderSelectedReport('tasks');
    });
  }

  removeClassName(elements, className) {
    elements.forEach((elem) => elem.classList.remove(className));
  }

  renderSelectedReport(type) {
    const dailyReportBtn = document.getElementById('dailyReport');
    const weeklyReportBtn = document.getElementById('weeklyReport');
    const monthlyReportBtn = document.getElementById('monthlyReport');

    if (dailyReportBtn.classList.contains('active')) {
      this.renderDailyReportEvent.notify(type);
      return;
    }

    if (weeklyReportBtn.classList.contains('active')) {
      this.renderWeeklyReportEvent.notify(type);
      return;
    }

    if (monthlyReportBtn.classList.contains('active')) {
      this.renderMonthlyReportEvent.notify(type);
      return;
    }
  }



  getDailyChart(allData, type) {
    chartConfigObject.xAxis.categories = ['Urgent', 'High', 'Middle', 'Low', 'Failed'];
    chartConfigObject.xAxis.labels.formatter = function () { return this.value.toUpperCase(); };

    this.setTooltip(type);

    chartConfigObject.series.forEach((series, index) => {
      series.data = allData[index];
      series.stack = '';
    });


    Highcharts.chart('containerChart', chartConfigObject);
  }

  setTooltip(type) {
    if (type === 'pomodoros') {
      chartConfigObject.tooltip.formatter = function () {
        return '<b>' + this.series.name.toUpperCase() + '</b><br/>'
          + '<br/>Pomodoros:' + this.y;
      };
    } else {
      chartConfigObject.tooltip.formatter = function () {
        return '<b>' + this.series.name.toUpperCase() + '</b><br/>'
          + '<br/>Tasks:' + this.y;
      };
    }
  }

  getWeeklyChart(allData, type) {
    this.setTooltip(type);

    chartConfigObject.xAxis.categories = ['Mon', 'Tue', 'Wed', 'Thi', 'Fri', 'Sat', 'Sun'];
    chartConfigObject.xAxis.labels.formatter = function () { return this.value.toUpperCase(); };

    chartConfigObject.series.forEach((series, index) => {
      if (index < allData.length - 1) {
        series.stack = 'success';
      } else {
        series.stack = 'failed';
      }
      series.data = allData[index];
    });

    Highcharts.chart('containerChart', chartConfigObject);
  }

  getMonthlyChart(allData, type) {

    this.setTooltip(type);
    
    const currentDate = new Date();
    const monthDayCount = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    const days = (new Array(monthDayCount)).fill(0).map((elem, index) => index + 1);
    
    chartConfigObject.xAxis.categories = days;
    chartConfigObject.xAxis.labels.formatter = null;
    
    chartConfigObject.series.forEach((series, index) => {
      series.data = allData[index];
      series.stack = '';
    });
    Highcharts.chart('containerChart', chartConfigObject);
  }
}
