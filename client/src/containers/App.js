import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { BrowserRouter as Router } from 'react-router-dom';
import { setCurrentUser, setAuthorizationToken } from '../store/actions/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import Main from './Main';
import jwtDecode from 'jwt-decode';
import { render } from 'react-dom';

const store = configureStore();

if(localStorage.jwtToken) {
	setAuthorizationToken(localStorage.jwtToken);
	// prevent someone from manually tampering with the key of jwtToken in localStorage
	try {
		store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
	} catch(e) {
		store.dispatch(setCurrentUser({}));
	}
}

const App = () => (
	<Provider store={store}>
		<Router>
			<div className="App">
				<Navbar />
        <div className="main-container">
          <Main />
        </div>
				<Footer />
			</div>
		</Router>
	</Provider>
);

export default App;
