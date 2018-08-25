import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeroSection from './HeroSection';
import IntegrationSection from './IntegrationSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';


class Homepage extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return(
      <div>
        <HeroSection />
        <IntegrationSection />
        <FeaturesSection />
        <PricingSection />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
		currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps, { })(Homepage);
