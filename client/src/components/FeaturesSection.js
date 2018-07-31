import React, { Component } from 'react';
import {  Container, Grid, Segment, Header, Image, Menu, Transition } from 'semantic-ui-react';

class FeaturesSection extends Component {
  state = {}

  render() {
    const { activeItem } = this.state;
    return(
      <Container id="integrations" className="section" fluid>
        <Container className="pad">
          <Header textAlign='center' as='h1' className="dosis large" >Features</Header>
          <hr className='large teal-bg' />
          <div style={{margin: '40px 0px'}}>
            <Grid columns={4} doubling stackable>
              <Grid.Column>
                <Segment></Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment></Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment></Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment></Segment>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
      </Container>
    )
  }
}


export default FeaturesSection
