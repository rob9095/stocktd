import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import jwtDecode from 'jwt-decode';
import { render } from 'react-dom';
import HeroSection from '../components/HeroSection';
import IntegrationSection from '../components/IntegrationSection';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';
import { Button, Container, Header, Icon, List, Image, Menu, Segment, Grid, Form, Input, TextArea } from 'semantic-ui-react';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div>
          <Navbar />
          <HeroSection />
          <IntegrationSection />
          <FeaturesSection />
          <PricingSection />
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
