import React, { Component } from 'react';
import { verifyUserEmail } from '../store/actions/account';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InventoryProductTable from './InventoryProductTable';
import { Container, Grid, Button, Label, Header, Tab } from 'semantic-ui-react';
import { importProducts } from '../store/actions/products';
import { resendUserVerificationEmail } from '../store/actions/account';
import { parseCSV } from '../services/parseCSV';

class InventoryImport extends Component {
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

  render() {
    const { currentUser } = this.props
    return(
      <Grid textAlign="center" container columns={1} verticalAlign="middle" stackable>
        <Grid.Column>
          <Header size='medium'>Inventory Import</Header>
          <Label
            as="label"
            style={{border: '0px'}}
            basic
            htmlFor="upload"
          >
            <Button
              icon="upload"
              size="huge"
              label={{
                basic: true,
                content: 'Select a file to start import'
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

 export default connect(mapStateToProps, {importProducts, parseCSV})(InventoryImport);
