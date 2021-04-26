import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Header,
  Container,
  Segment,
  Icon,
  Button,
  Form,
} from 'semantic-ui-react';
import Athlete from './Athlete';
import { fetchAthletes, addAthlete } from '../actions/index';

class Athletes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newAthleteName: '',
    };
  }

  componentDidMount() {
    this.props.fetchAthletes();
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    return (
      <Container>
        <Segment>
          <Header as='h2'>
            <Icon name='users' />
            Athletes
          </Header>
          <Segment.Group>
            <Segment textAlign='right'>
              <Form
                id='add-athlete-form'
                onSubmit={() => {
                  this.props.addAthlete(this.state.newAthleteName);
                }}
              >
                <Form.Group inline>
                  <Form.Field>
                    <label
                      style={{ fontSize: '1.15em' }}
                      htmlFor='newAthleteName'
                    >
                      Add Athlete
                    </label>
                    <Form.Input
                      onChange={this.handleChange}
                      placeholder='Name'
                      name='newAthleteName'
                      required
                      type='text'
                      id='newAthleteName'
                      value={this.state.newAthleteName}
                    />
                  </Form.Field>
                  <Button
                    primary
                    icon='add'
                    type='submit'
                    circular
                    style={{ marginLeft: '10px' }}
                    aria-label='add athlete button'
                  />
                </Form.Group>
              </Form>
            </Segment>
            {this.props.athletes.map((athlete) => (
              <Athlete key={athlete._id} name={athlete.name} id={athlete._id} />
            ))}
          </Segment.Group>
        </Segment>
      </Container>
    );
  }
}

function mapStateToProps({ athletes }) {
  return { athletes };
}

export default connect(mapStateToProps, { addAthlete, fetchAthletes })(
  Athletes
);
