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
            <Grid container className="pricing-grid no-margin" columns={2} textAlign="center" verticalAlign="middle">
              <Grid.Column>
                <Segment className="plan">
                  <Header as="h2" className="plan-title">Starter</Header>
                  <Header as="h1"  className="plan-price">FREE</Header>
                  <div className="plan-list">
                    <List>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right' color="teal" size="small"/>
                        50 SKUs
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
                  </div>
                  <Button size="large" className="plan-button" color="teal">Sign Up</Button>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment inverted color="teal" className="plan featured-plan">
                  <Header as="h2" className="plan-title">Standard</Header>
                  <Header as="h1" className="plan-price">$20<span className="price-per">/month</span></Header>
                  <div className="plan-list">
                    <List>
                      <List.Item>
                        <List.Icon verticalAlign="middle" name='caret right' size="small"/>
                        Unlimited SKUs
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
                  </div>
                  <Button size="large" className="plan-button featured-button">Sign Up</Button>
                </Segment>
              </Grid.Column>
            </Grid>
          </div>
          <Grid container columns={1} textAlign="center" verticalAlign="middle">
            <Grid.Column>
              <div className="questions">Still have some questions?</div>
              <Button size="large" color="teal">Contact Us</Button>
            </Grid.Column>
          </Grid>
        </Container>
      </Container>
    )
  }
}


export default PricingSection
