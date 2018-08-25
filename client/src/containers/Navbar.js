import React, { Component } from 'react';
import {  Container, Dropdown, Image, Grid, Menu, Icon, Transition, Segment, Reveal, Header } from 'semantic-ui-react';
import NavMenu from './NavMenu';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navOpen: false,
    }
  }

  handleMenuClick = () => {
    this.setState({
      navOpen: !this.state.navOpen,
    })
  }

  render() {
    return (
      <div>
        <Menu fixed='top' borderless>
          <Container>
            <Menu.Item as='a' className="nav-logo">
              <Link to="/">
                <Header as='h1' className="dosis">stocktd</Header>
              </Link>
            </Menu.Item>
            <Menu.Item as='a' className="no-hover" position="right" onClick={this.handleMenuClick}>
            <div className="nav-menu-icon" >
              <div id="nav-icon" className={this.state.navOpen ? 'open' : ''}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            </Menu.Item>
          </Container>
        </Menu>
          <Grid container columns={1} stackable className="nav-menu-parent">
            <Transition animation='slide down' duration={100} visible={this.state.navOpen}>
            <Segment className="menu-container">
              <NavMenu />
            </Segment>
            </Transition>
          </Grid>
      </div>
    )
  }
}

export default Navbar;
