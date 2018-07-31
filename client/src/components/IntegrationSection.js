import React, { Component } from 'react';
import {  Container, Grid, Segment, Header, Image, Menu, Transition } from 'semantic-ui-react';
import uspsImg from '../images/integrations/usps.png';
import upsImg from '../images/integrations/ups.png';
import fedexImg from '../images/integrations/fedex.png';
import amazonImg from '../images/integrations/amazon.png';
import wooImg from '../images/integrations/woo.png';
import shopifyImg from '../images/integrations/shopify.png';
import walmartImg from '../images/integrations/walmart.png';

class IntegrationSection extends Component {
  state = {
    activeItem: 'all',
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state;
    return(
      <Container id="integrations" className="section grey-bg no-margin" fluid >
        <Container className="pad">
          <Header textAlign='center' as='h1' className="dosis large" >Integrations</Header>
          <hr className='large teal-bg' />
            <div style={{display: 'flex', justifyContent: 'center', margin: '40px 0px'}}>
              <Menu compact icon='labeled'>
                <Menu.Item
                  name="marketplaces"
                  active={activeItem === 'marketplaces'}
                  onClick={this.handleItemClick}
                >
                  Marketplaces
                </Menu.Item>
                <Menu.Item
                  name="shipping"
                  active={activeItem === 'shipping'}
                  onClick={this.handleItemClick}
                >
                  Shipping
                </Menu.Item>
                <Menu.Item
                  name="all"
                  active={activeItem === 'all'}
                  onClick={this.handleItemClick}
                >
                  All
                </Menu.Item>
              </Menu>
            </div>
            <Transition animation='scale' duration={200} visible={this.state.activeItem === 'marketplaces' || this.state.activeItem === 'all'}>
              <Grid columns={4} doubling stackable>
                <Grid.Column>
                  <Segment>
                    <Image src={amazonImg} />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Image src={walmartImg} />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Image src={shopifyImg} />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Image src={wooImg} />
                  </Segment>
                </Grid.Column>
              </Grid>
            </Transition>
              <Transition animation='scale' duration={200} visible={this.state.activeItem === 'shipping' || this.state.activeItem === 'all'}>
              <Grid columns={3} doubling stackable>
                <Grid.Column>
                  <Segment>
                    <Image src={uspsImg} />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Image src={upsImg} />
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Image src={fedexImg} />
                  </Segment>
                </Grid.Column>
              </Grid>
            </Transition>
        </Container>
      </Container>
    )
  }
}


export default IntegrationSection
