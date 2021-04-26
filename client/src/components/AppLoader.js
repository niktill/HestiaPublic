import React from 'react';
import { Container, Loader, Image } from 'semantic-ui-react';

export default (props) => (
  <Container style={{ marginTop: '15vh' }}>
    {props.image ? (
      <Image src='/images/logo.png' size='small' centered />
    ) : null}
    <Loader
      active
      inline='centered'
      size='massive'
      style={{ marginTop: '20px' }}
      inverted
    >
      {props.message}
    </Loader>
  </Container>
);
