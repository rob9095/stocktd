import React, { Component } from 'react';
import { Button, Container, Header, List, Form, Grid, Image, Input } from 'semantic-ui-react';
import heroImg from '../images/designs/chip.png';
import { HashLink as AnchorLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

const options =
[
  {
    key: 'google',
    text: 'Google/Search Engine',
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

class HeroSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      referredBy: '',
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSelect = (e, { value }) => this.setState({ referredBy: value })


  render() {
    const { firstName, lastName, company, email, referredBy } = this.state;
    return(
      <Container className="section hero">
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
                        Just import your inventory from one of our <AnchorLink scroll={el => el.scrollIntoView({ behavior: 'smooth'})} to="#integrations">integrated partners</AnchorLink> or upload a <a href="">.csv file</a> with your product data to get started.
                      </p>
                    </List.Content>
                  </List.Item>
                  <List.Content>
                    <p>
                      <strong className="teal-color">Easy to Use: </strong>
                      Stocktd seemlessly integrates into any warehouse workflow and lets you focus on growing your business.
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
                      id="firstName"
                      name="firstName"
                      onChange={this.handleChange}
                      value={firstName}
                      control={Input}
                      label='First Name'
                      placeholder='First Name'
                      className='stps-input'
                      size='large'
                    />
                    <Form.Field
                      id="lastName"
                      name="lastName"
                      onChange={this.handleChange}
                      value={lastName}
                      control={Input}
                      label='Last Name'
                      placeholder='Last Name'
                      className='stps-input'
                      size='large'
                    />
                  </Form.Group>
                  <Form.Field
                    id="email"
                    name="email"
                    onChange={this.handleChange}
                    value={email}
                    control={Input}
                    label='Email Address'
                    placeholder='email@website.com'
                    className='stps-input required'
                    size='large'
                  />
                  <Form.Field
                    id="company"
                    name="company"
                    onChange={this.handleChange}
                    value={company}
                    control={Input}
                    label='Company Name'
                    placeholder='Company Name'
                    className='stps-input required'
                    size='large'
                  />
                  <Form.Select
                    onChange={this.handleSelect}
                    value={referredBy}
                    className="stps-select"
                    fluid
                    label='How did you find us?'
                    options={options}
                    placeholder='Choose an Option'
                  />
                  <Link to={{
                    pathname: "/signup",
                    formValues: this.state,
                  }}>
                  <Form.Field
                    id='form-button-control-public'
                    size="huge"
                    color="teal"
                    control={Button}
                    content='Get Started'
                  />
                  </Link>
                </Form>
            </Grid.Column>
        </Grid>
      </Container>
    )
  }
}


export default HeroSection
