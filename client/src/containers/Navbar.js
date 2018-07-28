import React, { Component } from 'react';
import {  Container, Dropdown, Image, Menu, Icon } from 'semantic-ui-react';
import logo from '../images/stoctopus-char.png';

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
    }
  }

  handleMenuClick = () => {
    this.props.onSidebarToggle();
  }

  render() {
    return (
      <div>
        <Menu fixed='top' borderless>
          <Container>
            <Menu.Item as='a' className="nav-logo">
              <Image size='mini' src={logo} style={{ marginRight: '1.5em' }} />
              stoctopus
            </Menu.Item>
            <Menu.Item as="a" position="right" >
              <Icon name='sidebar' size='large' onClick={this.handleMenuClick} />
            </Menu.Item>
          </Container>
        </Menu>
      </div>
    )
  }
}

export default Navbar;
