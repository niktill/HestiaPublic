import React, { Component } from 'react';
import { Message, Container } from 'semantic-ui-react';

class MessageBlock extends Component {
  handleDismiss = () => {
    this.props.clearMessage();
  };

  render() {
    return this.props.message ? (
      <Container textAlign='center'>
        <Message
          positive={this.props.positive}
          error={this.props.error}
          onDismiss={this.handleDismiss}
          content={this.props.message}
          style={this.props.style}
        />
      </Container>
    ) : null;
  }
}

export default MessageBlock;
