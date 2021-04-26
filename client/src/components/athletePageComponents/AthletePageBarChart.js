import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Message, Container } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import ChartForm from './ChartForm';

const percentToHex = require('percent-to-hex');

const getPrevMonday = () => {
  const prevMonday = new Date();
  if (prevMonday.getDay() === 1) {
    prevMonday.setDate(prevMonday.getDate() - 7);
  } else {
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  }
  return prevMonday;
};

class AthletePageBarChart extends Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.yAxisUnits = this.props.yAxisUnits;

    this.state = {
      startDate: getPrevMonday(),
      gameRange: 6,
    };
  }

  render() {
    const filteredBars = this.props.bars
      .filter(
        (bar) => new Date(bar.label.split(';')[1]) >= this.state.startDate
      )
      .slice(0, this.state.gameRange);
    const labels = filteredBars.map((bar) => bar.label);
    const data = filteredBars.map((bar) => bar.data);
    return (
      <Segment>
        <h3 style={{ marginTop: '0' }}>{this.title}</h3>
        <ChartForm // chart form
          startDate={this.state.startDate}
          gameRange={this.state.gameRange}
          setStartDate={(date) => this.setState({ startDate: date })}
          setGameRange={(gameRange) => this.setState({ gameRange })}
        />
        {filteredBars.length === 0 ? ( // message if no data exists given from input
          <Container textAlign='center'>
            <Message warning compact>
              No data exists with given parameters!
            </Message>
          </Container>
        ) : (
          <Bar // Bar chart
            height={150}
            data={{
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: data.map((dataPoint) =>
                    this.title === 'Number of Impacts' &&
                    this.props.athlete.impactLimit
                      ? percentToHex(dataPoint / this.props.athlete.impactLimit)
                      : this.props.color
                  ),
                },
              ],
            }}
            options={{
              scales: {
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: this.props.yAxisUnits
                        ? `${this.title} (${this.props.yAxisUnits})`
                        : this.title,
                    },
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
                xAxes: [
                  {
                    id: 'xAxis1',
                    type: 'category',
                    offset: true,
                    ticks: {
                      callback(label) {
                        const name = label.split(';')[0];
                        return name;
                      },
                    },
                  },
                  {
                    id: 'xAxis2',
                    offset: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'IMU Upload Name / Date',
                    },
                    gridLines: {
                      drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                    ticks: {
                      callback(label, index, values) {
                        if (
                          index === 0 ||
                          label.split(';')[1] !==
                            values[index - 1].split(';')[1]
                        ) {
                          return label.split(';')[1];
                        }
                        return null;
                      },
                    },
                  },
                ],
              },
              legend: {
                display: false,
              },
              //
              annotation:
                this.title === 'Number of Impacts' &&
                this.props.athlete.impactLimit
                  ? {
                      annotations: [
                        {
                          type: 'line',
                          mode: 'horizontal',
                          scaleID: 'y-axis-0',
                          value: this.props.athlete.impactLimit,
                          borderColor: 'rgba(0,0,0,0.6)',
                          borderWidth: 4,
                          borderDash: [10],
                          label: {
                            enabled: true,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            content: 'Impact Limit',
                            yAdjust: 15,
                          },
                        },
                      ],
                    }
                  : null,
            }}
          />
        )}
      </Segment>
    );
  }
}

function mapStateToProps({ athlete }) {
  return { athlete };
}

export default connect(mapStateToProps, {})(AthletePageBarChart);
