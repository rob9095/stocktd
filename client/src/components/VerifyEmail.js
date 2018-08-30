import React, { Component } from 'react';
import { verifyUserEmail } from '../store/actions/account';
import { connect } from 'react-redux';
import { Container, Header, Icon, Grid, Button, Loader, Dimmer } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const iconStyles = {
  maxWidth: '500px',
  margin: '30px auto',
  textAlign: 'center',
}

class VerifyEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      response: '',
    }
  }
    componentDidMount() {
      this.props.verifyUserEmail(this.props.match.params.token_id)
      .then((res)=>{
        this.setState({
          response: res.message,
          isLoading: false,
        })
      })
      .catch(()=>{
        this.setState({
          isLoading: false,
        })
      })
    }
    render() {
      const { currentUser, location, errors } = this.props
      return(
        <Container className="section" textAlign="center" fluid>
          <Container className="pad">
            <Header as='h1' className="dosis large">Email Verification</Header>
            <hr className='large teal-bg' />
            <div style={iconStyles}>
            {this.state.isLoading ?
              <Loader active inline>Verifying Email...</Loader>
              :
              errors.message ?
                <div>
                  <Icon name='warning circle' color="red" size='huge' />
                  <h3>{errors.message}</h3>
                </div>
                :
                <div>
                  <Icon name='check' color="teal" size='huge' />
                  <h3>{this.state.response}</h3>
                </div>
            }
            </div>
            <div>
              <Grid container columns={1} textAlign="center" verticalAlign="middle" stackable>
                <Grid.Column>
                  <Button as={Link} to="/" size="large" color="teal">Go Home</Button>
                </Grid.Column>
                <p>Need help? <a href="/contact">Contact Us</a></p>
              </Grid>
            </div>
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

 export default connect(mapStateToProps, {verifyUserEmail})(VerifyEmail);
