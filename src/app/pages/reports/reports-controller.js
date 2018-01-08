import { getStringMonth, getMonthFromString } from '../../helpers/date-formatting';

export class ReportsController {
  constructor(view, model) {
    this.view = view;
    this.model = model;

    this.view.renderDailyReportEvent.attach((sender, data) => {
      this.showDailyTasksReport(data);
    });

    this.view.renderWeeklyReportEvent.attach((sender, data) => {
      this.showWeeklyTasksReport(data);
    });

    this.view.renderMonthlyReportEvent.attach((sender, data) => {
      this.showMonthlyTasksReport(data);
    });
  }

  showDailyTasksReport(type) {
    this.model.getAllTasks().then((data) => {
      const doneTodayTasks = [];
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = getStringMonth(currentDate.getMonth());
      const day = currentDate.getUTCDate();

      for (const key in data) {
        if(data[key].done && data[key].doneDate.year === year  && 
          data[key].doneDate.month === month && data[key].doneDate.day === day) {
          doneTodayTasks.push(data[key]);
        }
      }

      let formattedData = [];
      if (type === 'pomodoros') {
        formattedData = this.getPomodorosQuantity(doneTodayTasks);
      } else {
        formattedData = this.getTasksQuantity(doneTodayTasks);
      }

      this.view.getDailyChart(formattedData, type);
    });
  }

  getTasksQuantity(tasks) {
    const urgent = [0, 0, 0, 0, 0];
    const high = [0, 0, 0, 0, 0];
    const middle = [0, 0, 0, 0, 0];
    const low = [0, 0, 0, 0, 0];
    const failed = [0, 0, 0, 0, 0];

    tasks.forEach((task) => {
      if (task.failedAttempQuantity > task.successfulAttemptQuantity) {
        failed[4]++;
      } else {
        switch (task.priority) {
        case 'urgent': urgent[0]++; break;
        case 'high': high[1]++; break;
        case 'middle': middle[2]++; break;
        case 'low': low[3]++; break;
        }
      }
    });

    return [urgent, high, middle, low, failed];
  }

  getPomodorosQuantity(tasks) {
    const urgent = [0, 0, 0, 0, 0];
    const high = [0, 0, 0, 0, 0];
    const middle = [0, 0, 0, 0, 0];
    const low = [0, 0, 0, 0, 0];
    const failed = [0, 0, 0, 0, 0];

    tasks.forEach((task) => {
      if (task.failedAttempQuantity > task.successfulAttemptQuantity) {
        failed[4] += task.failedAttempQuantity;
      } else {
        switch (task.priority) {
        case 'urgent': urgent[0] += task.successfulAttemptQuantity; break;
        case 'high': high[1] += task.successfulAttemptQuantity; break;
        case 'middle': middle[2] += task.successfulAttemptQuantity; break;
        case 'low': low[3] += task.successfulAttemptQuantity; break;
        }
      }
    });

    return [urgent, high, middle, low, failed];
  }

  showWeeklyTasksReport(type) {
    this.model.getAllTasks().then((data) => {
      const allDoneTasks = [];

      for (const key in data) {
        if(data[key].done) {
          allDoneTasks.push(data[key]);
        }
      }
      
      const endDate = new Date();
      endDate.setHours(0, 0, 0, 0);
      const currentWeekTasks = [];
      allDoneTasks.forEach((task) => {
        const monthDay = getMonthFromString(task.doneDate.month);
        const taskDate = new Date(`${task.doneDate.year}-${monthDay}-${task.doneDate.day}`);

        const dayQuantity = ((new Date).getDay() - 1) === -1 ? 6 : ((new Date).getDay() - 1);

        const msecInDays = 24 * dayQuantity * 60 * 60 * 1000;
        const startDate = new Date(endDate.getTime() - msecInDays);
        if (taskDate <= endDate && taskDate >= startDate) {
          task.dayInWeek = (taskDate.getDay() - 1) === -1 ? 6 : (taskDate.getDay() - 1);
          currentWeekTasks.push(task);
        }

      });

      let formattedData = [];
      if (type === 'pomodoros') {
        formattedData = this.getPomodoros(currentWeekTasks);
      } else {
        formattedData = this.getTask(currentWeekTasks);
      }

      this.view.getWeeklyChart(formattedData, type);
    });
  }

  showMonthlyTasksReport(type) {
    this.model.getAllTasks().then((data) => {
      const doneThisMonth = [];
      const currentDate = new Date();
      const month = getStringMonth(currentDate.getMonth());

      for (const key in data) {
        if(data[key].done && data[key].doneDate.month === month) {
          doneThisMonth.push(data[key]);
        }
      }

      let formattedData = [];
      if (type === 'pomodoros') {
        formattedData = this.getPomodorosQuantityInMonth(doneThisMonth);
      } else {
        formattedData = this.getTasksQuantityInMonth(doneThisMonth);
      }

      this.view.getMonthlyChart(formattedData, type);
    });
  }


  getPomodoros(tasks) {
    const urgent = [0, 0, 0, 0, 0, 0, 0];
    const high = [0, 0, 0, 0, 0, 0, 0];
    const middle = [0, 0, 0, 0, 0, 0, 0];
    const low = [0, 0, 0, 0, 0, 0, 0];
    const failed = [0, 0, 0, 0, 0, 0, 0];

    tasks.forEach((task) => {
      if (task.failedAttempQuantity > task.successfulAttemptQuantity) {
        failed[task.dayInWeek] += task.failedAttempQuantity;
      } else {
        switch (task.priority) {
        case 'urgent': urgent[task.dayInWeek] += task.successfulAttemptQuantity; break;
        case 'high': high[task.dayInWeek] += task.successfulAttemptQuantity; break;
        case 'middle': middle[task.dayInWeek] += task.successfulAttemptQuantity; break;
        case 'low': low[task.dayInWeek] += task.successfulAttemptQuantity; break;
        }
      }
    });

    return [urgent, high, middle, low, failed];
  }

  getTask(tasks) {
    const urgent = [0, 0, 0, 0, 0, 0, 0];
    const high = [0, 0, 0, 0, 0, 0, 0];
    const middle = [0, 0, 0, 0, 0, 0, 0];
    const low = [0, 0, 0, 0, 0, 0, 0];
    const failed = [0, 0, 0, 0, 0, 0, 0];

    tasks.forEach((task) => {
      if (task.failedAttempQuantity > task.successfulAttemptQuantity) {
        failed[task.dayInWeek]++;
      } else {
        switch (task.priority) {
        case 'urgent': urgent[task.dayInWeek]++; break;
        case 'high': high[task.dayInWeek]++; break;
        case 'middle': middle[task.dayInWeek]++; break;
        case 'low': low[task.dayInWeek]++; break;
        }
      }
    });

    return [urgent, high, middle, low, failed];
  }

  getPomodorosQuantityInMonth(tasks) {
    const currentDate = new Date();
    const monthDayCount = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    const urgent = (new Array(monthDayCount)).fill(0);
    const high = (new Array(monthDayCount)).fill(0);
    const middle = (new Array(monthDayCount)).fill(0);
    const low = (new Array(monthDayCount)).fill(0);
    const failed = (new Array(monthDayCount)).fill(0);

    tasks.forEach((task) => {
      const day = task.doneDate.day - 1;
      if (task.failedAttempQuantity > task.successfulAttemptQuantity) {
        failed[day] += task.failedAttempQuantity;
      } else {
        switch (task.priority) {
        case 'urgent': urgent[day] += task.successfulAttemptQuantity; break;
        case 'high': high[day] += task.successfulAttemptQuantity; break;
        case 'middle': middle[day] += task.successfulAttemptQuantity; break;
        case 'low': low[day] += task.successfulAttemptQuantity; break;
        }
      }
    });

    return [urgent, high, middle, low, failed];
  }

  getTasksQuantityInMonth(tasks) {
    const currentDate = new Date();
    const monthDayCount = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    const urgent = (new Array(monthDayCount)).fill(0);
    const high = (new Array(monthDayCount)).fill(0);
    const middle = (new Array(monthDayCount)).fill(0);
    const low = (new Array(monthDayCount)).fill(0);
    const failed = (new Array(monthDayCount)).fill(0);

    tasks.forEach((task) => {
      const day = task.doneDate.day - 1;
      if (task.failedAttempQuantity > task.successfulAttemptQuantity) {
        failed[day]++;
      } else {
        switch (task.priority) {
        case 'urgent': urgent[day]++; break;
        case 'high': high[day]++; break;
        case 'middle': middle[day]++; break;
        case 'low': low[day]++; break;
        }
      }
    });

    return [urgent, high, middle, low, failed];
  }
}