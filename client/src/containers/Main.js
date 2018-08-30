import React from 'react';
import { Switch, Route, withRouter, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { authUser } from '../store/actions/auth';
import { removeError } from '../store/actions/errors';
import Homepage from '../components/Homepage';
import AuthForm from '../components/AuthForm';
import NotFound from '../components/NotFound';
import VerifyEmail from '../components/VerifyEmail';

const Main = props => {
	const {authUser, errors, removeError, currentUser } = props;
	return(
		<div>
			<Switch>
				<Route path="/verify-email/:token_id" render={props => <VerifyEmail currentUser={currentUser} {...props} />} />
				<Route exact path="/" render={props => <Homepage currentUser={currentUser} {...props} />} />
				<Route
					exact
					path="/signin"
					render={props => {
						return (
							<AuthForm
								removeError={removeError}
								errors={errors}
								onAuth={authUser}
								buttonText="Log in"
								heading="Welcome Back"
								{...props}
							/>
						);
					}}
				/>
				<Route
					exact
					path="/signup"
					render={props => {
						return (
							<AuthForm
								removeError={removeError}
								errors={errors}
								onAuth={authUser}
								signUp
								buttonText="Sign up"
								heading="Create an Account"
								{...props}
							/>
						);
					}}
				/>
				<Route render={props => <NotFound currentUser={currentUser} {...props} />} />
			</Switch>
		</div>
	);
};

function mapStateToProps(state) {
	return {
		currentUser: state.currentUser,
		errors: state.errors
	};
}

export default withRouter(connect(mapStateToProps, { authUser, removeError })(Main));
