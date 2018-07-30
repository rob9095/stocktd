import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import jwtDecode from 'jwt-decode';
import { render } from 'react-dom';
import IntegrationSection from '../components/IntegrationSection';
import { Button, Container, Header, Icon, List, Image, Menu, Segment, Grid, Form, Input, TextArea } from 'semantic-ui-react';
import heroImg from '../images/designs/chip.png';

class App extends Component {
  state = {
    visible: false,
    open: false,
    options: [
    {
      key: 'google',
      text: 'Google',
      value: 'google'
    },
    {
      key: 'friendFamily',
      text: 'Friend/Family',
      value: 'friendFamily'
    },
    {
      key: 'other',
      text: 'Other',
      value: 'other'
    },
    ]
  }

  toggleVisibility = () => {
    if (this.state.visible) {
      this.setState({
        visible: !this.state.visible,
      })
      setTimeout(()=>{
        this.setState({
          open: !this.state.open,
        })
      },500)
    } else {
      this.setState({
        visible: !this.state.visible,
        open: true,
      })
    }
  }

  render() {
    const { visible, options, open } = this.state;
    return (
      <div className="App">
        <div>
          <Navbar />
          <Container className="section hero" >
            <Header textAlign='center' as='h1' className="dosis large" >Smarter Inventory Management</Header>
            <hr className='large teal-bg' />
            <Grid container columns={2} stackable style={{ marginTop: '1em'}}>
                <Grid.Column verticalAlign="middle" >
                  <Image src={heroImg} className="hero-img" />
                  <List className="hero-features">
                    <List.Item>
                      <List.Item>
                        <List.Content>
                          <p>
                            <strong className="teal-color">Quick Setup: </strong>
                            Just import your inventory from one of our <a href="">integrated partners</a> or upload a <a href="">.csv file</a> with your product data to get started.
                          </p>
                        </List.Content>
                      </List.Item>
                      <List.Content>
                        <p>
                          <strong className="teal-color">Easy to Use: </strong>
                          Stoctopus is a complete warehouse management solution that actually makes sense to implement. Our software seemlessly integrates into any warehouse workflow and lets you focus on growing your business.
                        </p>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <p>
                          <strong className="teal-color">Inventory Scanner: </strong>
                          Quickly scan and process inbound or outbound purchase orders on the fly.
                        </p>
                      </List.Content>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column verticalAlign="middle" >
                  <Header textAlign='center' as='h1' className="dosis" >Create an Account</Header>
                  <Form>
                      <Form.Group widths='equal'>
                        <Form.Field
                          id='form-input-control-first-name'
                          control={Input}
                          label='First Name'
                          placeholder='First Name'
                          className='stps-input required'
                          size='large'
                        />
                        <Form.Field
                          id='form-input-control-last-name'
                          control={Input}
                          label='Last Name'
                          placeholder='Last Name'
                          className='stps-input required'
                          size='large'
                        />
                      </Form.Group>
                      <Form.Field
                        id='form-input-control-email'
                        control={Input}
                        label='Email Address'
                        placeholder='email@website.com'
                        className='stps-input required'
                        size='large'
                      />
                      <Form.Field
                        id='form-input-control-email'
                        control={Input}
                        label='Company Name'
                        placeholder='Company Name'
                        className='stps-input required'
                        size='large'
                      />
                      <Form.Select
                        className="stps-select"
                        fluid label='Choose an Option'
                        options={options}
                        placeholder='Choose an Option'
                      />
                      <Form.Field
                        id='form-button-control-public'
                        size="huge"
                        color="teal"
                        control={Button}
                        content='Get Started'
                      />
                    </Form>
                </Grid.Column>
            </Grid>
          </Container>
          <IntegrationSection />
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
