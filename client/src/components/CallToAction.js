import React, { Component } from 'react';
import { Button, Container, Segment, Header } from 'semantic-ui-react';

class CallToAction extends Component {
  render() {
    return(
      <Container id="cta" className="section no-margin end-section cta teal-bg" fluid>
        <Container className="pad">
          <Button size="huge" color="teal">sign up for free!</Button>
        </Container>
      </Container>
    )
  }
}


export default CallToAction
