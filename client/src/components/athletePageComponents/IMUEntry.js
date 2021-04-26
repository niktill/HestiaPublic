import React from 'react';
import { Container, Loader, Message, Segment } from 'semantic-ui-react';

export default (props) => (
  <Segment>
    {props.name}
    <span style={{ float: 'right' }}>
      {props.processed ? (
        <span style={{ marginRight: '10px' }}>
          <b>IMU Date: </b>
          {`${(
            props.date.getMonth() + 1
          ).toString()}/${props.date
            .getDate()
            .toString()}/${props.date.getFullYear().toString()}`}
        </span>
      ) : null}
      <b>Upload Date: </b>
      {`${(
        props.uploadDate.getMonth() + 1
      ).toString()}/${props.uploadDate
        .getDate()
        .toString()}/${props.uploadDate.getFullYear().toString()}`}
    </span>
    {!props.processed ? (
      <Container textAlign='center'>
        <Message warning compact size='small' style={{ marginTop: '10px' }}>
          Processing... please check back later!{' '}
          <Loader active inline style={{ marginLeft: '5px' }} />
        </Message>
      </Container>
    ) : null}
  </Segment>
);
