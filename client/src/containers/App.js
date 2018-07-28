import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import jwtDecode from 'jwt-decode';
import { render } from 'react-dom';
import { Button, Container, Header, Icon, Image, Menu, Segment, Sidebar, Grid } from 'semantic-ui-react';

class App extends Component {
  state = {
    visible: false,
  }

  toggleVisibility = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  render() {
    const { visible } = this.state;
    return (
      <div className="App">
        <div>
          <Sidebar.Pushable className="sidebar-container" as={Segment}>
            <Sidebar
              as={Menu}
              animation='slide along'
              icon='labeled'
              inverted
              onHide={this.toggleVisibility}
              vertical
              visible={visible}
              width='thin'
            >
              <Menu.Item as='a'>
                <Icon name='home' />
                Home
              </Menu.Item>
              <Menu.Item as='a'>
                <Icon name='gamepad' />
                Games
              </Menu.Item>
              <Menu.Item as='a'>
                <Icon name='camera' />
                Channels
              </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher dimmed={visible}>
              <Navbar onSidebarToggle={this.toggleVisibility} />
                <Container text style={{ marginTop: '7em' }}>
                  <Header textAlign='center' as='h1'>Request a Demo Today</Header>
                  <hr className='large teal-bg' />
                  <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <p>
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                      Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
                      ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                      consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                      In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
                      link mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                      vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac,
                      enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla
                      ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
                      Curabitur ullamcorper ultricies nisi.
                    </p>
                    <Button primary>Click Here</Button>
                  </Grid>
                </Container>
              <Footer />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </div>
    );
  }
}

export default App;
