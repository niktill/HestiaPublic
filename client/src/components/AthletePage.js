import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Avatar from 'react-avatar';
import {
  Container,
  Button,
  Confirm,
  Message,
  Segment,
} from 'semantic-ui-react';
import { deleteAthlete, fetchAthlete } from '../actions/index';
import AppLoader from './AppLoader';
import IMUTable from './athletePageComponents/IMUTable';
import ImpactLimit from './athletePageComponents/ImpactLimit';
import AthletePageBarChart from './athletePageComponents/AthletePageBarChart';

const formatDate = (date) =>
  `${(
    date.getMonth() + 1
  ).toString()}/${date.getDate().toString()}/${date.getFullYear().toString()}`;

class AthletePage extends Component {
  constructor(props) {
    super(props);
    this.athleteId = this.props.match.params.id;
    this.state = {
      athleteLoaded: false,
      athleteLoadError: false,
      deleteAthleteOpen: false,
    };
  }

  async componentDidMount() {
    try {
      await this.props.fetchAthlete(this.athleteId);
      this.setState({ athleteLoaded: true });
    } catch (error) {
      this.setState({ athleteLoaded: true, athleteLoadError: true });
    }
  }

  componentDidUpdate() {
    // accessibility focus on modal if opened
    const modal = document.querySelector('#deleteAthleteModal .actions button');
    if (modal) {
      modal.focus();
    }
  }

  openDeleteAthlete = () => {
    this.setState({ deleteAthleteOpen: true });
  };

  closeDeleteAthlete = () => this.setState({ deleteAthleteOpen: false });

  deleteAthlete = async () => {
    try {
      const res = await this.props.deleteAthlete(this.athleteId);
      if (res.status === 200) {
        window.location.href = '/athletes';
        document.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderAthleteProfile() {
    let component;
    if (!this.state.athleteLoaded) {
      // still loading athlete data
      component = <AppLoader message='Loading Athlete' />;
    } else if (this.state.athleteLoaded && this.state.athleteLoadError) {
      component = ( // No ahlete data found after loaded
        <Container textAlign='center'>
          <Message error compact>
            Athlete not found!
          </Message>
        </Container>
      );
    } else {
      component = ( // athlete data found
        <Container>
          <Segment>
            <Container style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                name={this.props.athlete.athleteName}
                round
                size='40px'
                style={{ marginRight: '10px' }}
              />
              <h1 style={{ display: 'inline-block', margin: '0' }}>
                {this.props.athlete.athleteName}
              </h1>
              <span style={{ marginLeft: 'auto' }}>
                <Button
                  negative
                  icon='remove'
                  circular
                  aria-label='delete athlete'
                  onClick={this.openDeleteAthlete}
                />
                <Confirm
                  id='deleteAthleteModal'
                  content='Are you sure you want to delete this athlete?'
                  open={this.state.deleteAthleteOpen}
                  onCancel={this.closeDeleteAthlete}
                  onConfirm={() => {
                    this.deleteAthlete();
                  }}
                />
              </span>
            </Container>

            <IMUTable athleteId={this.athleteId} />
            <ImpactLimit impactLimit={this.props.athlete.impactLimit} />
            <AthletePageBarChart
              title='Number of Impacts'
              color='orange'
              bars={this.props.athlete.imuData
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((imu) => ({
                  data: imu.impacts,
                  label: `${imu.name.replace('.csv', '')};${formatDate(
                    new Date(imu.date)
                  )}`,
                }))}
            />
            <AthletePageBarChart
              title='Max Acceleration'
              color='blue'
              yAxisUnits='m/s^2'
              bars={this.props.athlete.imuData
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((imu) => ({
                  data: imu.maxAcceleration,
                  label: `${imu.name.replace('.csv', '')};${formatDate(
                    new Date(imu.date)
                  )}`,
                }))}
            />
          </Segment>
        </Container>
      );
    }
    return component;
  }

  render() {
    return this.renderAthleteProfile();
  }
}

function mapStateToProps({ athlete }) {
  return { athlete };
}

const AthletePageWithRouter = withRouter(AthletePage);

export default connect(mapStateToProps, { deleteAthlete, fetchAthlete })(
  AthletePageWithRouter
);
