import React, { Component } from 'react';
import { verifyUserEmail } from '../store/actions/account';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InventoryProductTable from './InventoryProductTable';
import { Container, Grid, Button, Label, Header } from 'semantic-ui-react';
import { importProducts } from '../store/actions/products';
import { resendUserVerificationEmail } from '../store/actions/account';
import { parseCSV } from '../services/parseCSV';

class InventoryProducts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFile: '',
      update: true,
    }
  }

  handleFileUpload = async (e) => {
    let json = await this.props.parseCSV(e)
    this.props.importProducts(json, this.props.currentUser, this.state.update)
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
          <p>{activeItem}</p>
          <Button onClick={this.handleResendVerEmail}>
            resend verifcation email
          </Button>
          <Label
            as="label"
            style={{border: '0px'}}
            basic
            htmlFor="upload"
          >
            <Button
              icon="upload"
              label={{
                basic: true,
                content: 'Select file'
              }}
              labelPosition="right"
            />
            <input
              hidden
              id="upload"
              type="file"
              onChange={(event)=> {
                this.handleFileUpload(event)
              }}
              onClick={(event)=> {
                event.target.value = null
              }}
            />
          </Label>
          <h5>{this.state.activeFile}</h5>
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

 export default connect(mapStateToProps, {importProducts, resendUserVerificationEmail, parseCSV})(InventoryProducts);
