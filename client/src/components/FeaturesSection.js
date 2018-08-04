import React, { Component } from 'react';
import storage from '../images/designs/storage.png';
import shipping from '../images/designs/parachute.png';
import computer from '../images/designs/computer.png';
import {  Container, Grid, Header, Image, Responsive } from 'semantic-ui-react';

class FeaturesSection extends Component {
  state = { activeItem: 'inventory' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state;
    return(
      <Container id="features" className="section" fluid>
        <Container>
          <Header textAlign='center' as='h1' className="dosis large">Core Features</Header>
          <hr className='large teal-bg' />
          <div style={{margin: '60px 0px'}}>
            <Grid verticalAlign="middle" container columns={2} stackable>
              <Grid.Column width="6"  textAlign='center'>
                <img src={computer} width="200px" />
              </Grid.Column>
              <Grid.Column textAlign='left' width="10">
                <Header className="features-header" as='h3'>Multi-Channel Inventory Managment</Header>
                <p className="features-text">
                  Let stocktd handle your inventory and automatically sync product quantities across multiple marketplaces, shopping carts, channels, etc.
                </p>
              </Grid.Column>

                <Grid.Column textAlign='left' width="10">
                  <Responsive maxWidth={767} style={{textAlign: 'center'}}>
                  <Grid.Column width="6"  textAlign='center'>
                    <img src={shipping} width="200px" />
                  </Grid.Column>
                  </Responsive>
                  <Header className="features-header" as='h3'>Order & Shipping Automation</Header>
                  <p className="features-text">
                    With stocktd you can easily manage all your orders in one central dashboard. We automatically save product weights and shipping preferences to make order fulfillment a breeze.
                  </p>
                </Grid.Column>
                <Responsive minWidth={768}>
                <Grid.Column width="6"  textAlign='center'>
                  <img src={shipping} width="200px" />
                </Grid.Column>
                </Responsive>

              <Grid.Column width="6"  textAlign='center'>
                <img src={storage} width="200px" />
              </Grid.Column>
              <Grid.Column textAlign='left' width="10">
                <Header className="features-header" as='h3'>Virtual Warehouse & Inventory Scanner</Header>
                <p className="features-text">
                  Our inventory scanner lets you quickly process inbound or outbound purchase orders and using our smart locations will make order picking that much easier.
                </p>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
      </Container>
    )
  }
}


export default FeaturesSection
