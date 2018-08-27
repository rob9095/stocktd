import React, { Component } from 'react';
import { Container, Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { goToTop } from 'react-scrollable-anchor';

class AuthForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			company: '',
			firstName: '',
			lastName: '',
			referredBy: '',
		};
	}

  componentDidMount() {
		goToTop();
		if(this.props.history.location.formValues) {
			Object.entries(this.props.history.location.formValues).forEach((val)=>{
				if (val[1]) {
					this.setState({
						[val[0]]: val[1]
					})
				}
			})
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
		const { email, password, company, firstName, lastName, referredBy } = this.state;
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
							<Message
								error
								content={errors.message}
							/>
            )}
            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment raised>
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
								{signUp && (
									<Form.Input
										fluid
										icon='building'
										iconPosition='left'
										placeholder='Company Name'
										autoComplete="off"
										id="company"
										name="company"
										value={company}
										onChange={this.handleChange}
										className='stps-input required'
									/>
								)}
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder={signUp ? 'Password (at least 6 characters)' : 'Password'}
                  type='password'
                  autoComplete="off"
                  id="password"
                  name="password"
									value={password}
                  onChange={this.handleChange}
                  className='stps-input required'
                />
                <Button color='teal' fluid size='huge'>
                  {buttonText}
                </Button>
              </Segment>
            </Form>
            {signUp ?
              <Message size="large">
                Already have an account? <Link to="/signin">Log in</Link>
              </Message>
              :
              <Message size="large">
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
