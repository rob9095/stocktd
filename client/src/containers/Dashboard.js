import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { Menu, Segment, Container, Grid, Dropdown, Button, } from 'semantic-ui-react';
import InventoryProducts from '../components/InventoryProducts';
import InventoryImport from '../components/InventoryImport';
import PurchaseOrders from '../components/PurchaseOrders';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      this.setPathname(this.props.location.pathname)
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.pathname != this.props.location.pathname) {
      this.setPathname(newProps.location.pathname)
    }
  }

  render() {
    const { } = this.state

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
            <Dropdown item text='Inventory' name="inventory" icon={{name: 'chevron down', size: 'small', color: 'teal', className: 'dropdown-icon'}} className={this.isMenuActive('inventory') ? 'dropdown-active' : ''}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/app/inventory/products" name="products" active={this.isMenuActive('products')}>Products</Dropdown.Item>
                <Dropdown.Item as={Link} to="/app/inventory/scanner" name="export" active={this.isMenuActive('scanner')}>Scanner</Dropdown.Item>
                <Dropdown.Item as={Link} to="/app/inventory/import" name="import" active={this.isMenuActive('import')}>Import</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              as={Link}
              to="/app/purchase-orders"
              name='Purchase Orders'
              active={this.isMenuActive('purchase-orders')}
            />
            <Menu.Menu position='right'>
              <Dropdown item text='Account' name="account" icon={{name: 'chevron down', size: 'small', color: 'teal', className: 'dropdown-icon'}} className={this.isMenuActive('account') ? 'dropdown-active' : ''}>
                <Dropdown.Menu name='account'>
                  <Dropdown.Item as={Link} to="/app/account/profile" name="account" active={this.isMenuActive('profile')}>Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/billing" name="account" active={this.isMenuActive('billing')}>Billing</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/notifications" name="account" active={this.isMenuActive('notifications')}>Notifications</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/app/account/permissions" name="account" active={this.isMenuActive('permissions')}>Permissions</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu>
            <Switch>
              <Route path="/app/inventory/products" render={props => <InventoryProducts {...props} />} />
              <Route path="/app/inventory/import" render={props => <InventoryImport {...props} />} />
              <Route path="/app/purchase-orders" render={props => <PurchaseOrders {...props} />} />
            </Switch>
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
