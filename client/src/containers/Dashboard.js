import React, { Component } from 'react'
import { Menu, Segment, Container, Grid, Dropdown, Button } from 'semantic-ui-react'

export default class Dashboard extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Container className="section" fluid>
        <Container className="pad app-container">
          <Menu stackable secondary size="huge" className="app-menu">
            <Menu.Item
              name='home'
              active={activeItem === 'home'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='orders'
              active={activeItem === 'orders'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='inventory'
              active={activeItem === 'inventory'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='setup'
              active={activeItem === 'setup'}
              onClick={this.handleItemClick}
            />
            <Menu.Menu position='right'>
              <Dropdown item text='Account'>
                <Dropdown.Menu>
                  <Dropdown.Item>Profile</Dropdown.Item>
                  <Dropdown.Item>Billing</Dropdown.Item>
                  <Dropdown.Item>Notifications</Dropdown.Item>
                  <Dropdown.Item>Permissions</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Menu.Item>
                <Button color="teal">Sign Up</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Segment raised>
            <Grid container columns={1} verticalAlign="middle" stackable>
              <Grid.Column style={{minHeight: '200px'}}>
                <p>{activeItem}</p>
                <form ref='uploadForm'
                  id='uploadForm'
                  action='http://localhost:8080/api/products/import-csv'
                  method='post'
                  encType="multipart/form-data">
                    <input type="file" name="uploadFile" />
                    <input type='submit' value='Upload!' />
                </form>
              </Grid.Column>
            </Grid>
          </Segment>
        </Container>
      </Container>
    )
  }
}
