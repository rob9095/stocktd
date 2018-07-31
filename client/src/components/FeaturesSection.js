import React, { Component } from 'react';
import storage from '../images/designs/storage.png';
import {  Container, Grid, Header, Image, Menu, Transition, Icon, Segment } from 'semantic-ui-react';

class FeaturesSection extends Component {
  state = { activeItem: 'inventory' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state;
    return(
      <Container id="features" className="section" fluid>
        <Container>
          <Header textAlign='center' as='h1' className="dosis large" >Core Features</Header>
          <hr className='large teal-bg' />
          <div style={{margin: '60px 0px'}}>
            <Grid columns={2} doubling stackable>
              <Grid.Column>
                <Menu size="massive" color="teal" pointing secondary vertical>
                  <Menu.Item name="inventory" active={activeItem === 'inventory'} onClick={this.handleItemClick} >
                    <Icon style={{float:'left', marginRight:'10px'}} name="check" color="teal"/>
                    Inventory Sync
                  </Menu.Item>
                  <Menu.Item name="order" active={activeItem === 'order'} onClick={this.handleItemClick} >
                    <Icon style={{float:'left', marginRight:'10px'}} name="check" color="teal"/>
                    Order Managment
                  </Menu.Item>
                  <Menu.Item name="shipping" active={activeItem === 'shipping'} onClick={this.handleItemClick} >
                    <Icon style={{float:'left', marginRight:'10px'}} name="check" color="teal"/>
                    Shipping Automation
                  </Menu.Item>
                  <Menu.Item name="warehouse" active={activeItem === 'warehouse'} onClick={this.handleItemClick} >
                    <Icon style={{float:'left', marginRight:'10px'}} name="check" color="teal"/>
                    Virtual Warehouse
                  </Menu.Item>
                  <Menu.Item name="barcode" active={activeItem === 'barcode'} onClick={this.handleItemClick} >
                    <Icon style={{float:'left', marginRight:'10px'}} name="check" color="teal"/>
                    Barcode Scanner
                  </Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column>
                <img src={storage} width="200px" />
              </Grid.Column>
            </Grid>
          </div>
        </Container>
      </Container>
    )
  }
}


export default FeaturesSection
