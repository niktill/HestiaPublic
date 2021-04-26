import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Button, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';
import { deleteAthlete } from '../actions/index';

class Athlete extends Component {
  constructor(props) {
    super(props);
    this.state = { openDeleteAthlete: false };
  }

  componentDidUpdate() {
    // accessibility focus on modal if opened
    const modal = document.querySelector('#deleteAthleteModal .actions button');
    if (modal) {
      modal.focus();
    }
  }

  openDeleteAthlete = () => this.setState({ openDeleteAthlete: true });

  closeDeleteAthlete = () => this.setState({ openDeleteAthlete: false });

  deleteAthlete = () => {
    this.props.deleteAthlete(this.props.id);
  };

  render() {
    return (
      <Segment style={{ display: 'flex', alignItems: 'center' }}>
        <Link to={`/athletes/${this.props.id}`}>
          <Avatar
            name={this.props.name}
            round
            size='40px'
            style={{ marginRight: '10px' }}
          />
          <span style={{ fontSize: '1.25em' }}>{this.props.name}</span>
        </Link>
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
            open={this.state.openDeleteAthlete}
            onCancel={this.closeDeleteAthlete}
            onConfirm={() => {
              this.deleteAthlete();
            }}
          />
        </span>
      </Segment>
    );
  }
}

export default connect(null, { deleteAthlete })(Athlete);
