import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Segment, Container, Grid, Dropdown, Button, Form, Label } from 'semantic-ui-react';
import { uploadLocalFile } from '../store/actions/fileUpload';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'home',
      activeFile: '',
    }
  }

  handleFileUpload = (e) => {
    this.setState({
      activeFile: e.target.files[0].name
    })
    this.props.uploadLocalFile('post','/api/products/import-csv',e.target.files[0])
  }

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
                <Label
                  as="label"
                  style={{border: '0px'}}
                  basic
                  htmlFor="upload"
                >
                  <Button
                    icon="upload"
                    label={{
                      basic: true,
                      content: 'Select file'
                    }}
                    labelPosition="right"
                  />
                  <input
                    hidden
                    id="upload"
                    type="file"
                    onChange={(event)=> {
                      this.handleFileUpload(event) 
                    }}
                    onClick={(event)=> {
                      event.target.value = null
                    }}
                  />
                </Label>
                <h5>{this.state.activeFile}</h5>
              </Grid.Column>
            </Grid>
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

export default connect(mapStateToProps, { uploadLocalFile })(Dashboard);
