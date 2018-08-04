import React, { Component } from 'react';
import { Button, Container, Grid, Segment, Header, List } from 'semantic-ui-react';

class PricingSection extends Component {

  render() {
    return(
      <Container id="pricing" className="section grey-bg no-margin end-section" fluid>
        <Container className="pad">
          <Header textAlign='center' as='h1' className="dosis large" >Pricing</Header>
          <hr className='large teal-bg' />
          <div style={{margin: '60px 0px'}}>
            <Grid container columns={2} doubling stackable textAlign="center" verticalAlign="middle">
              <Grid.Column>
                <Segment>
                  <Header as="h2" className="plan-title">Starter</Header>
                  <Header as="h1"  className="plan-price">FREE</Header>
                  <div className="plan-list">
                    <List>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right' color="teal" size="small"/>
                        50 Product SKUs
                      </List.Item>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right' color="teal" size="small"/>
                        1 User
                      </List.Item>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right' color="teal" size="small"/>
                        Simple Locations
                      </List.Item>
                    </List>
                    <Button className="plan-button" size="large" color="teal">Sign Up</Button>
                  </div>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment inverted color="teal" className="featured-plan">
                  <Header as="h2" className="plan-title">Standard</Header>
                  <Header as="h1" className="plan-price">$20</Header>
                  <div style={{display: 'inline-block'}}>/month</div>
                  <div className="plan-list">
                    <List>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right' size="small"/>
                        Unlimited Product SKUs
                      </List.Item>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right'size="small"/>
                        Unlimited Users
                      </List.Item>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right' size="small"/>
                        Enhanced Locations
                      </List.Item>
                    </List>
                    <Button size="large" className="plan-button featured-button">Sign Up</Button>
                  </div>
                </Segment>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
      </Container>
    )
  }
}


export default PricingSection
