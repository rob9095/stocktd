import React, { Component } from 'react';
import { verifyUserEmail } from '../store/actions/account';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Button, Label, Header } from 'semantic-ui-react';
import { resendUserVerificationEmail } from '../store/actions/account';
import InventoryProductTable from './InventoryProductTable';

class InventoryProducts extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleResendVerEmail = () => {
    this.props.resendUserVerificationEmail(this.props.currentUser.user.email)
  }

  render() {
    const { currentUser, activeItem } = this.props
    return(
      <Grid container columns={1} verticalAlign="middle" stackable>
        <Grid.Column>
          <Header size='medium'>Products</Header>
          <Button onClick={this.handleResendVerEmail}>
            resend verifcation email
          </Button>
          <InventoryProductTable />
        </Grid.Column>
      </Grid>
    )
  }
}

 function mapStateToProps(state) {
 	return {
 		currentUser: state.currentUser,
    errors: state.errors,
 	};
 }

 export default connect(mapStateToProps, {resendUserVerificationEmail})(InventoryProducts);
