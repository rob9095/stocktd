import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Button, Label, Header, Form, Message, Icon, Transition } from 'semantic-ui-react';
import { importProducts } from '../store/actions/products';
import { parseCSV, validateInputs, validateHeaders } from '../services/parseCSV';
import { removeError, addError } from '../store/actions/errors';

const headers = [
  {value:'sku', required: true},
  {value:'title'},
  {value: 'barcode'},
  {value:'quantity'},
  {value:'price'},
  {value:'supplier'},
  {value:'brand'},
  {value:'weight'}
]
const validInputs = [
  {value:'sku', required: true},
  {value:'title'},
  {value: 'barcode'},
  {value:'quantity', type: 'number'},
  {value:'price', type: 'number'},
  {value:'supplier'},
  {value:'brand'},
  {value:'weight', type: 'number'}
];

class ProductUploadForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFile: '',
      update: true,
      showCompleteImportButton: false,
      errorType: '',
      errorHeader: '',
      submitButtonText: '',
      showReSubmitHint: false,
      submitLoading: false,
    }
  }
  
  handleFileUpload = async (e) => {
    this.setState({
      activeFile: e.target.files[0].name,
      showReSubmitHint: false,
    })
    this.props.removeError();
    this.props.parseCSV(e)
    .then(async ({json, jsonLowerCase}) => {
      console.log(jsonLowerCase)
      let headerCheck = await this.props.validateHeaders(jsonLowerCase, headers)
      console.log(headerCheck)
      if (headerCheck.errorType === 'warning') {
        //display warnings
        this.props.addError(headerCheck.errorList)
        this.setState({
          errorType: headerCheck.errorType,
          errorHeader: headerCheck.errorHeader,
          submitButtonText: 'Submit File with Warnings',
        })
      }
      let inputCheck = await this.props.validateInputs(jsonLowerCase, validInputs)
      if (inputCheck.isValid) {
        this.setState({
          showCompleteImportButton: true,
          json,
          submitButtonText: 'Submit File',
        })
      }
    })
    .catch(err => {
      this.props.addError(err.errorList)
      this.setState({
        errorType: err.errorType,
        errorHeader: err.errorHeader,
        showCompleteImportButton: false,
      })
    })
  }

  handleCompleteImportClick = () => {
    if (this.state.submitButtonText.startsWith('Import')) {
      this.handleSubmitHintToggle()
      return
    }
    this.setState({
      submitLoading: true,
    })
    this.props.importPurchaseOrder(this.state.json, this.props.currentUser)
    .then(res=>{
      this.setState({
        submitLoading: false,
        purchaseOrders: [...this.state.purchaseOrders,...res.addedPOs],
        filteredPurchaseOrders: [...this.state.filteredPurchaseOrders,...res.addedPOs],
        submitButtonText: 'Import Success'
      })
    })
    .catch(err=>{
      this.setState({
        submitLoading: false,
        submitButtonText: 'Import Failed',
      })
    })
  }

  render() {
    const { currentUser, errors } = this.props;
    const { errorType, errorHeader, activeFile, showCompleteImportButton, submitButtonText, showReSubmitHint, submitLoading } = this.state;
    return(
      <Grid textAlign="center" columns={1} verticalAlign="middle">
        <Grid.Column>
          <Grid container columns={1} verticalAlign="middle" centered>
            <Form style={{padding: '30px 10px'}}>
              <Header size="medium">Import or Update Products</Header>
              {errors.message && (
                <Message
                  error={errorType === 'error'}
                  warning={errorType === 'warning'}
                  header={errorHeader}
                  list={errors.message}
                  className="import-errors message-box"
                  style={{display: 'block'}}
                />
              )}
              <Label
                as="label"
                style={{border: '0px'}}
                basic
                htmlFor="upload"
                size="huge"
              >
                <Button
                  icon="cloud upload"
                  label={{
                    basic: true,
                    content: 'Select file to upload',
                    size: "huge"
                  }}
                  labelPosition="right"
                  size="huge"
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
              {activeFile && (
                <div style={{marginTop: '10px'}}>
                  <Header size="tiny">File: {activeFile}</Header>
                </div>
              )}
                <div className="submit-button-container">
                  {showReSubmitHint && (
                    <Label pointing='below'>
                      Please submit another file
                      <Icon onClick={this.handleSubmitHintToggle} name='delete'/>
                    </Label>
                  )}
                  <Transition visible={showCompleteImportButton} animation='fade down' duration={200} unmountOnHide transitionOnMount>
                    <div>
                      <Button
                        size="huge"
                        color="teal"
                        content={submitButtonText}
                        positive={submitButtonText === 'Import Success'}
                        negative={submitButtonText === 'Import Failed'}
                        icon={submitButtonText === 'Import Success' ? 'check' : submitButtonText === 'Import Failed' ? 'delete' : null}
                        loading={submitLoading}
                        onClick={this.handleCompleteImportClick}
                      />
                    </div>
                  </Transition>
                </div>
            </Form>
          </Grid>
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

 export default connect(mapStateToProps, {importProducts, parseCSV, validateHeaders, validateInputs, removeError, addError})(ProductUploadForm);
