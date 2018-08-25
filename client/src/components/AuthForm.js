import React, { Component } from 'react';
import { Container, Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class AuthForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			username: '',
			password: '',
			company: '',
		};
	}

  componentDidMount() {
    if (this.props.history.formValues) {
      console.log(this.props.history.formValues)
    }
  }

	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};


	handleSubmit = e => {
		e.preventDefault();
		const authType = this.props.signUp ? 'signup' : 'signin';
		this.props.onAuth(authType, this.state).then(() => {
			this.props.history.push('/');
		})
		.catch(() => {
			return;
		});
	};

	render() {
		const { email, username, password, profileImageUrl } = this.state;
		const { signUp, heading, buttonText, errors, history, removeError } = this.props;

		history.listen(() => {
			removeError();
		});

		return(
		<Container className="section">
      <div className='login-form'>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' className="dosis" textAlign='center'>
              {heading}
            </Header>
            {errors.message && (
              <div className="alert alert-danger">{errors.message}</div>
            )}
            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='E-mail address'
                  autoComplete="off"
                  id="email"
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                  className='stps-input required'
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  autoComplete="off"
                  id="password"
                  name="password"
                  onChange={this.handleChange}
                  className='stps-input required'
                />
                {signUp && (
                  <div>
                    <label htmlFor="username">Username:</label>
                    <input
                      autoComplete="off"
                      className="form-control"
                      id="username"
                      name="username"
                      onChange={this.handleChange}
                      value={username}
                      type="text"
                    />
                    <label htmlFor="image-url">Image Url:</label>
                    <input
                      autoComplete="off"
                      className="form-control"
                      id="image-url"
                      name="profileImageUrl"
                      onChange={this.handleChange}
                      type="text"
                      value={profileImageUrl}
                    />
                  </div>
                )}
                <Button color='teal' fluid size='large'>
                  {buttonText}
                </Button>
              </Segment>
            </Form>
            {signUp ?
              <Message>
                Already have an account? <Link to="/signin">Log in</Link>
              </Message>
              :
              <Message>
                New to stocktd? <Link to="/signup">Sign up</Link>
              </Message>
            }
          </Grid.Column>
        </Grid>
      </div>
		</Container>
		)
	}
}

export default AuthForm;
