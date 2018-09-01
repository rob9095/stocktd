import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { Menu, Segment, Container, Grid, Dropdown, Button, } from 'semantic-ui-react';
import InventoryDash from '../components/InventoryDash';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '',
    }
  }

  componentDidMount() {
    if (this.props.history.location.pathname){
      let activeItem = this.props.history.location.pathname.split('/')[2]
      this.setState({
        activeItem: activeItem === undefined ? 'home' : activeItem
      })
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Container className="section" fluid>
        <Container className="pad app-container">
          <Menu stackable secondary size="huge" className="app-menu">
            <Menu.Item
              as={Link}
              to="/app"
              name='home'
              active={activeItem === 'home'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to="/app/orders"
              name='orders'
              active={activeItem === 'orders'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to="/app/inventory"
              name='inventory'
              active={activeItem === 'inventory'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to="/app/setup"
              name='setup'
              active={activeItem === 'setup'}
              onClick={this.handleItemClick}
            />
            <Menu.Menu position='right'>
              <Dropdown item text='Account' className={activeItem === 'account' ? 'dropdown-active': ''}>
                <Dropdown.Menu name='account'>
                  <Dropdown.Item as={Link} to="/app/account/profile" name="account" onClick={this.handleItemClick}>Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/billing" name="account" onClick={this.handleItemClick}>Billing</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/notifications" name="account" onClick={this.handleItemClick}>Notifications</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/permissions" name="account" onClick={this.handleItemClick}>Permissions</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Menu.Item>
                <Button color="teal">Sign Up</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Segment raised style={{minHeight: '200px'}}>
            <Switch>
              <Route path="/app/inventory" render={props => <InventoryDash {...props} />} />
            </Switch>
          </Segment>
        </Container>
      </Container>
    )
  }
}

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
    errors: state.errors,
	};
}

export default withRouter(connect(mapStateToProps, {})(Dashboard));
