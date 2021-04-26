import React from 'react';
import {
  Container,
  Icon,
  Message,
  Segment,
  Statistic,
} from 'semantic-ui-react';

export default (props) => (
  <Segment>
    <h3>
      Calculated Impact Limit{' '}
      <a
        href='https://github.com/dcsil/Hestia/blob/master/product_research/impact_limit.md'
        target='_blank'
        rel='noreferrer'
        aria-label='Read more about impact limit on another page'
      >
        <Icon link name='help circle' />
      </a>
    </h3>
    <Container textAlign='center'>
      {props.impactLimit ? (
        <Statistic>
          <Statistic.Value>{props.impactLimit}</Statistic.Value>
        </Statistic>
      ) : (
        <Message warning compact>
          Impact limit not determined! Please upload more IMU data.
        </Message>
      )}
    </Container>
  </Segment>
);
