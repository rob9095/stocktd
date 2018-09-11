import React, { Component } from 'react';
import { Button, Header, Segment, Icon } from 'semantic-ui-react';

class NoResultsMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    }

    handleButtonClick = () => {
      this.props.handleButtonClick();
    }

    render() {
      let { showMessage, messageText, messageHeader, buttonText } = this.props;
      if (showMessage) {
        return(
          <Segment basic className="no-results-container">
            <Icon name="exclamation triangle" color="yellow" size="large" />
            <Header as="h3" content={messageHeader} />
            <p>
              {messageText}
            </p>
            <Button color="teal" content={buttonText} onClick={this.handleButtonClick} />
          </Segment>
        )
      }
      return(
        <Segment basic className="no-results-container">
          <Icon name="exclamation triangle" color="yellow" size="large" />
          <Header size="medium" content="No results found" />
        </Segment>
      )
    }
  }

export default NoResultsMessage;
