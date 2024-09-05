import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { StatsService } from '../../services/stats/stats.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  stats: any;
  expenses: any;
  incomes: any;

  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };

  @ViewChild('incomeLineChartRef') incomeLineChartRef!: ElementRef;
  @ViewChild('expenseLineChartRef') expenseLineChartRef!: ElementRef;
  @ViewChild('circularChartRef') circularChartRef!: ElementRef;

  constructor(private statsService: StatsService) {}

  ngAfterViewInit() {
    // Fetch data after the view is initialized to ensure element refs are available
    this.getStats();
    this.getChartData();
  }

  createLineChart(): void {
    if (this.incomeLineChartRef && this.incomes && this.incomes.length > 0) {
      const incomeCtx = this.incomeLineChartRef.nativeElement;
      console.log('Initializing chart with context:', incomeCtx);

      const myChart = echarts.init(incomeCtx);

      const chartOptions = {
        backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#f0f5ff' }, // Light blue
          { offset: 1, color: '#ffffff' }  // White
        ]),
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(50, 50, 50, 0.7)', // Semi-transparent dark background
          borderColor: '#ccc', // Light border
          textStyle: {
            color: '#fff' // White text
          },
          formatter: (params) => {
            const income = this.incomes[params[0].dataIndex];
            return `${income.date}<br/>${income.title}: $${income.amount}`;
          }
        },
        xAxis: {
          type: 'category',
          data: this.incomes.map(income => income.date),
          axisLine: {
            lineStyle: {
              color: '#666' // Darker gray axis line
            }
          },
          axisLabel: {
            color: '#333' // Darker text color for axis labels
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#666' // Darker gray axis line
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ddd' // Light gray grid lines
            }
          },
          axisLabel: {
            color: '#333' // Darker text color for axis labels
          }
        },
        grid: {
          top: '10%',
          bottom: '15%',
          left: '10%',
          right: '10%'
        },
        series: [
          {
            name: 'Income',
            type: 'line',
            data: this.incomes.map(income => income.amount),
            smooth: true, // Makes the line smooth
            lineStyle: {
              color: '#4a90e2', // Blue line color
              width: 2
            },
            itemStyle: {
              color: '#4a90e2' // Blue color for data points
            },
            areaStyle: {
              color: 'rgba(74, 144, 226, 0.2)' // Light blue area under the line
            }
          }
        ]
      };

      myChart.setOption(chartOptions);
    } else {
      console.error('Chart container or income data is not available');
    }
  }

  createExpenseChart(): void {
    if (this.expenseLineChartRef && this.expenses && this.expenses.length > 0) {
      const expenseCtx = this.expenseLineChartRef.nativeElement;
      console.log('Initializing chart with context:', expenseCtx);

      const myChart = echarts.init(expenseCtx);

      const chartOptions = {
        backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: '#fff0f0' }, // Light red
          { offset: 1, color: '#ffffff' }  // White
        ]),
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(50, 50, 50, 0.7)', // Semi-transparent dark background
          borderColor: '#ccc', // Light border
          textStyle: {
            color: '#fff' // White text
          },
          formatter: (params) => {
            const expense = this.expenses[params[0].dataIndex];
            return `${expense.date}<br/>${expense.title}: $${expense.amount}`;
          }
        },
        xAxis: {
          type: 'category',
          data: this.expenses.map(expense => expense.date),
          axisLine: {
            lineStyle: {
              color: '#666' // Darker gray axis line
            }
          },
          axisLabel: {
            color: '#333' // Darker text color for axis labels
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#666' // Darker gray axis line
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ddd' // Light gray grid lines
            }
          },
          axisLabel: {
            color: '#333' // Darker text color for axis labels
          }
        },
        grid: {
          top: '10%',
          bottom: '15%',
          left: '10%',
          right: '10%'
        },
        series: [
          {
            name: 'Expense',
            type: 'line',
            data: this.expenses.map(expense => expense.amount),
            smooth: true, // Makes the line smooth
            lineStyle: {
              color: '#e24a4a', // Red line color
              width: 2
            },
            itemStyle: {
              color: '#e24a4a' // Red color for data points
            },
            areaStyle: {
              color: 'rgba(226, 74, 74, 0.2)' // Light red area under the line
            }
          }
        ]
      };

      myChart.setOption(chartOptions);
    } else {
      console.error('Chart container or expense data is not available');
    }
  }

  createCircularChart(): void {
    if (this.circularChartRef && this.expenses && this.incomes) {
      const chartCtx = this.circularChartRef.nativeElement;
      console.log('Initializing circular chart with context:', chartCtx);

      const myChart = echarts.init(chartCtx);

      const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalIncomes = this.incomes.reduce((sum, income) => sum + income.amount, 0);

      const chartOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: ${c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Expenses', 'Incomes']
        },
        series: [
          {
            name: 'Financial Summary',
            type: 'pie',
            radius: ['50%', '70%'], // Doughnut chart style
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: totalExpenses, name: 'Expenses', itemStyle: { color: '#e24a4a' } }, // Red for expenses
              { value: totalIncomes, name: 'Incomes', itemStyle: { color: '#4a90e2' } }   // Blue for incomes
            ]
          }
        ]
      };

      myChart.setOption(chartOptions);
    } else {
      console.error('Chart container or financial data is not available');
    }
  }


  getStats() {
    this.statsService.getStats().subscribe(res => {
      this.stats = res;
    });
  }

  getChartData() {
    this.statsService.getChart().subscribe(res => {
      if (res.expenseList != null && res.incomeList != null) {
        this.incomes = res.incomeList;
        this.expenses = res.expenseList;

        console.log('Incomes:', this.incomes);  // Log incomes to check structure
        console.log('Expenses:', this.expenses);  // Log expenses to check structure

        // Ensure this is called after the data is fetched and view is initialized
        this.createLineChart();
        this.createExpenseChart();
        this.createCircularChart();
      } else {
        console.error('No chart data available');
      }
    });
  }


}
