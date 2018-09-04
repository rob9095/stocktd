import React, { Component } from 'react';
import { verifyUserEmail } from '../store/actions/account';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import InventoryTable from './InventoryTable';
import { Container, Grid, Button, Label } from 'semantic-ui-react';
import { importProducts } from '../store/actions/products';
import { resendUserVerificationEmail } from '../store/actions/account';

class InventoryDash extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFile: '',
      update: true,
    }
  }

  handleFileUpload = (e) => {
    // Check for File API support.
    if (window.FileReader) {
      // FileReader is supported.
      if (!e.target.files[0].name.endsWith('.csv')) {
        alert('not a csv')
        return
      }
      this.setState({activeFile: e.target.files[0].name})
      const reader = new FileReader();
      reader.readAsText(e.target.files[0]);
      reader.onload = this.parseCSV;
      reader.onerror = this.errorHandler;
    } else {
      alert('Filereader not supported in this browser.');
    }
  }

  parseCSV = (event) => {
    const csv = event.target.result.split(/\r\n|\n/);
    let json = [];
    let headers = csv[0].split(',').map(r=>r)
    for (let row = 0; row<csv.length-1; row++) {
      if (row != 0) {
        let obj = {};
        csv[row].split(',').forEach((cell,index)=>{
          obj = {
            ...obj,
            [headers[index]]: cell,
          }
        })
        json.push(obj)
      }
    }
    console.log(json)
    this.props.importProducts(json, this.props.currentUser, this.state.update)
  }

  errorHandler = (event) => {
    if(event.target.error.name == "NotReadableError") {
        alert("Unable to read file");
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
          <InventoryTable />
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

 export default connect(mapStateToProps, {importProducts, resendUserVerificationEmail})(InventoryDash);
