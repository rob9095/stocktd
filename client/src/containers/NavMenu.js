import React, { Component } from 'react'
import { Dropdown, Icon, Input, Menu, Transition, Form } from 'semantic-ui-react'

class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
      accountOpen: false,
    }
    this.toggleAccountOptions = this.toggleAccountOptions.bind(this)
  }
  handleItemClick = name => this.setState({ activeItem: name })

  toggleAccountOptions = () => {
    this.setState({
      accountOpen: !this.state.accountOpen,
    })
  }

  render() {
    const { activeItem } = this.state || {}

    return (
      <Menu vertical className="nav-menu">
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        >
          Home
        </Menu.Item>
        <Menu.Item
          name='features'
          active={activeItem === 'features'}
          onClick={this.handleItemClick}
        >
          Features
        </Menu.Item>
        <Menu.Item
          name='pricing'
          active={activeItem === 'pricing'}
          onClick={this.handleItemClick}
        >
          Pricing
        </Menu.Item>
        <Menu.Item
          name='integrations'
          active={activeItem === 'integrations'}
          onClick={this.handleItemClick}
        >
          Integrations
        </Menu.Item>
        <Menu.Item
          name='account'
          active={activeItem === 'account'}
          onClick={this.toggleAccountOptions}
        >
          {this.state.accountOpen ? <Icon name='chevron up' color='teal' /> : <Icon name='chevron down' color='teal' />}
          My Account
        </Menu.Item>
        <Transition animation='slide down' duration={200} visible={this.state.accountOpen}>
          <Menu.Menu className="sub-menu">
            <Menu.Item
              name='login'
              active={activeItem === 'login'}
              onClick={this.handleItemClick}
              >
              Log in
            </Menu.Item>
            <Menu.Item
              name='signup'
              active={activeItem === 'signup'}
              onClick={this.handleItemClick}
              >
              Sign up
            </Menu.Item>
          </Menu.Menu>
        </Transition>
        <Menu.Item
          name='more'
          active={activeItem === 'more'}
          onClick={this.handleItemClick}
        >
          <Icon name='chevron down' color='teal' />
          More
        </Menu.Item>
      </Menu>
    )
  }
}

export default NavMenu;
