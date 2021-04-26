import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Form } from 'semantic-ui-react';

class ChartForm extends Component {
  constructor(props) {
    super(props);

    this.setStartDate = this.props.setStartDate;
    this.setGameRange = this.props.setGameRange;
    this.startMonthString = `0${this.props.startDate.getMonth() + 1}`.slice(-2);
    this.startDateString = `0${this.props.startDate.getDate()}`.slice(-2);
    this.state = {
      startDateInput: `${this.props.startDate.getFullYear()}-${
        this.startMonthString
      }-${this.startDateString}`,
      gameRangeInput: this.props.gameRange,
    };
  }

  handleStartDateChange = (e, { value }) => {
    this.setState({ startDateInput: value });
    const year = parseInt(value.slice(0, 4), 10);
    const month = parseInt(value.slice(5, 7), 10);
    const date = parseInt(value.slice(8), 10);
    this.setStartDate(new Date(year, month - 1, date));
  };

  handleGameRangeChange = (e, { value }) => {
    let input = parseInt(value, 10);
    if (!input || input < 1) {
      input = 1;
    }
    this.setState({ gameRangeInput: input });
    this.setGameRange(input);
  };

  render() {
    return (
      <Container>
        <Form>
          <Form.Group inline>
            <label htmlFor='startDate'>Start Date:</label>
            <Form.Input
              onChange={this.handleStartDateChange}
              type='date'
              name='startDate'
              id='startDate'
              value={this.state.startDateInput}
            />
            <label htmlFor='gameRange'>Number of IMU Uploads Displayed:</label>
            <Form.Input
              onChange={this.handleGameRangeChange}
              type='number'
              step='1'
              min='1'
              max='30'
              name='gameRange'
              id='gameRange'
              value={this.state.gameRangeInput}
            />
            (Max 30)
          </Form.Group>
        </Form>
      </Container>
    );
  }
}

function mapStateToProps({ athlete }) {
  return { athlete };
}

export default connect(mapStateToProps, {})(ChartForm);
