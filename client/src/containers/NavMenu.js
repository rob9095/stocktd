import React, { Component } from 'react';
import { Dropdown, Icon, Input, Menu, Transition, Form } from 'semantic-ui-react';
import { HashLink as Link } from 'react-router-hash-link';
import { connect } from 'react-redux';
import { logout } from '../store/actions/auth';

class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
      accountOpen: false,
    }
  }

  logout = e => {
    this.props.handleMenuClose();
    this.props.logout();
  }

  handleItemClick = (name) => {
    this.setState({ activeItem: name })
    this.props.handleMenuClose();
  }

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
          as={Link}
          to="/"
          name='home'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        >
          Home
        </Menu.Item>
        <Menu.Item
          scroll={el => el.scrollIntoView({ behavior: 'smooth'})}
          as={Link}
          to="/#features"
          name='features'
          active={activeItem === 'features'}
          onClick={this.handleItemClick}
        >
          Features
        </Menu.Item>
        <Menu.Item
          as={Link}
          scroll={el => el.scrollIntoView({ behavior: 'smooth'})}
          to="/#pricing"
          name='pricing'
          active={activeItem === 'pricing'}
          onClick={this.handleItemClick}
        >
          Pricing
        </Menu.Item>
        <Menu.Item
          as={Link}
          scroll={el => el.scrollIntoView({ behavior: 'smooth'})}
          to="/#integrations"
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

          {!this.props.currentUser.isAuthenticated && (
            <Transition animation='fade' duration={200} visible={this.state.accountOpen}>
              <Menu.Menu className="sub-menu">
                <Menu.Item
                  as={Link}
                  to="/signin"
                  name='login'
                  active={activeItem === 'login'}
                  onClick={this.handleItemClick}
                  >
                  Log in
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/signup"
                  name='signup'
                  active={activeItem === 'signup'}
                  onClick={this.handleItemClick}
                  >
                  Sign up
                </Menu.Item>
              </Menu.Menu>
            </Transition>
          )}
          {this.props.currentUser.isAuthenticated && (
            <Transition animation='fade' duration={200} visible={this.state.accountOpen}>
              <Menu.Menu className="sub-menu">
                <Menu.Item
                  as={Link}
                  to="/dashboard"
                  name='dashboard'
                  active={activeItem === 'dashboard'}
                  onClick={this.handleItemClick}
                  >
                  Dashboard
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/acount"
                  name='account'
                  active={activeItem === 'account'}
                  onClick={this.handleItemClick}
                  >
                  Account Details
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  to="/signin"
                  name='logout'
                  active={activeItem === 'logout'}
                  onClick={this.logout}
                  >
                  Log out
                </Menu.Item>
              </Menu.Menu>
            </Transition>
          )}
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

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
	};
}

export default connect(mapStateToProps, {logout})(NavMenu);
