import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Container, Form, Message } from 'semantic-ui-react';
import IMUEntry from './IMUEntry';
import MessageBlock from '../MessageBlock';
import { uploadIMU } from '../../actions/index';

class IMUTable extends Component {
  constructor(props) {
    super(props);
    this.athleteId = this.props.athleteId;
    this.state = {
      imuUploading: false,
      imuUploadMessage: '',
      imuUploadError: false,
    };
  }

  onIMUUpload = async () => {
    try {
      this.setState({ imuUploading: true });
      const imuFile = document.querySelector('#imuFile').files[0];
      const res = await this.props.uploadIMU(this.athleteId, imuFile);
      if (res.status === 200) {
        this.setState({
          imuUploadMessage: 'IMU file uploaded successfully!',
          imuUploading: false,
        });
      }
    } catch (error) {
      this.setState({
        imuUploadMessage: error.message,
        imuUploadError: true,
        imuUploading: false,
      });
    }
  };

  render() {
    function sortImuEntries(array) {
      const newArray = array.sort(
        (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
      );
      return newArray;
    }
    return (
      <Segment>
        {/* Upload IMU heading and input form */}
        <Container style={{ display: 'flex', alignItems: 'baseline' }}>
          <h3 style={{ margin: '0' }}>Uploaded IMU Data</h3>
          <span style={{ marginLeft: 'auto' }}>
            <Form
              unstackable
              onSubmit={() => this.onIMUUpload()}
              loading={this.state.imuUploading}
            >
              <Form.Group style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Input
                  required
                  aria-label='IMU csv file input'
                  id='imuFile'
                  type='file'
                  name='upload'
                  accept='.csv'
                />
                <Form.Button primary icon='upload' aria-label='upload file'/>
              </Form.Group>
            </Form>
          </span>
        </Container>
        {/* Upload Message */}
        {this.state.imuUploadMessage ? (
          <MessageBlock
            clearMessage={() => {
              this.setState({ imuUploadMessage: '' });
            }}
            error={this.state.imuUploadError}
            positive={!this.state.imuUploadError}
            message={this.state.imuUploadMessage}
          />
        ) : null}
        {/* IMU entries */}

        <Segment.Group style={{ maxHeight: '188px', overflowY: 'scroll' }}>
          {this.props.athlete.imuData.length > 0 ? (
            sortImuEntries(this.props.athlete.imuData).map((imu) => (
              <IMUEntry
                name={imu.name}
                date={new Date(imu.date)}
                uploadDate={new Date(imu.uploadDate)}
                processed={imu.processed}
                key={imu._id}
              />
            ))
          ) : (
            <Container textAlign='center'>
              <Message>No IMU Data Uploaded</Message>
            </Container>
          )}
        </Segment.Group>
      </Segment>
    );
  }
}

function mapStateToProps({ athlete }) {
  return { athlete };
}

export default connect(mapStateToProps, { uploadIMU })(IMUTable);
