import React from 'react';
import { Container, Header, Icon, Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const buttonGroup = {
  maxWidth: '400px',
  margin: '0px auto',
  marginTop: '30px',
}

const NotFound = ({ location, currentUser }) => (
  <Container className="section" textAlign="center" fluid>
    <Container className="pad">
      <Header as='h1' className="dosis large" >404</Header>
      <Icon name='warning sign' color="yellow" size='huge' />
      <h3>Something went wrong</h3>
      <h5>We didn't find the page you were looking for.</h5>
      <div style={buttonGroup}>
        <Grid container columns={2} textAlign="center" verticalAlign="middle" stackable>
          <Grid.Column>
            <Button as={Link} to="/" size="large" color="teal">Go Home</Button>
          </Grid.Column>
          <Grid.Column>
            <Button size="large" color="teal">Contact Us</Button>
          </Grid.Column>
        </Grid>
      </div>
    </Container>
  </Container>
)

export default NotFound;
