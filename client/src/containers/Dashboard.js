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
      activeSubItem: '',
      pathname: '',
    }
  }

  isMenuActive = (arg) => {
    let pathArr = this.state.pathname.split('/');
    if (pathArr.length !== 2 && arg === 'app') {
      return false
    } else if (pathArr.includes(arg)) {
      return true
    }
    return false;
  }

  setPathname = (pathname) => {
    this.setState({
      pathname,
    })
  }

  componentDidMount() {
    if (this.props.history.location.pathname){
      this.setPathname(this.props.history.location.pathname)
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.history.location.pathname != this.state.pathname) {
      this.setPathname(this.props.history.location.pathname)
    }
  }

  render() {
    const { activeItem, activeSubItem } = this.state

    return (
      <Container className="section" fluid>
        <Container className="pad app-container">
          <Menu stackable secondary size="huge" className="app-menu">
            <Menu.Item
              as={Link}
              to="/app"
              name="home"
              active={this.isMenuActive('app')}
            />
            <Menu.Item
              as={Link}
              to="/app/orders"
              name='orders'
              active={this.isMenuActive('orders')}
            />
            <Dropdown
              item
              text='Inventory'
              name="inventory"
              className={this.isMenuActive('inventory') ? 'dropdown-active' : ''}
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to="/app/inventory/products"
                  name="products"
                  active={this.isMenuActive('products')}
                >
                  Products
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/app/inventory/import-export"
                  name="import-export"
                  active={this.isMenuActive('import-export')}
                >
                  Import/Export
                </Dropdown.Item>
                <Dropdown.Item
                  value="sales"
                  as={Link}
                  to="/app/inventory/sales"
                  name="sales"
                  active={this.isMenuActive('sales')}
                >
                  Sales
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              as={Link}
              to="/app/setup"
              name='setup'
              active={this.isMenuActive('setup')}
            />
            <Menu.Menu position='right'>
              <Dropdown item text='Account' name="account" className={this.isMenuActive('account') ? 'dropdown-active' : ''}>
                <Dropdown.Menu name='account'>
                  <Dropdown.Item as={Link} to="/app/account/profile" name="account" active={this.isMenuActive('profile')}>Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/billing" name="account" active={this.isMenuActive('billing')}>Billing</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/notifications" name="account" active={this.isMenuActive('notifications')}>Notifications</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/permissions" name="account" active={this.isMenuActive('permissions')}>Permissions</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Menu.Item>
                <Button color="teal">Sign Up</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Segment raised style={{minHeight: '200px'}}>
            <Switch>
              <Route path="/app/inventory/products" render={props => <InventoryDash {...props} />} />
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
