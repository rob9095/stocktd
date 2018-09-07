import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Label, Header, Segment, Form, Menu, Message, Icon, Transition } from 'semantic-ui-react';
import { parseCSV } from '../services/parseCSV';
import { importPurchaseOrder } from '../store/actions/purchaseOrders';
import { addError, removeError } from '../store/actions/errors';

const poHeaders = [{value:'po name', required: true},{value:'po type', required: true},{value: 'sku', required: true},{value:'quantity', required: true},{value:'scan po'},{value:'price'},{value:'scanned quantity'}]

class PurchaseOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFile: '',
      json: [],
      update: true,
      showImport: false,
      showCompleteImportButton: false,
      errorType: '',
      errorHeader: '',
      showActionsMenu: false,
    }
  }

  checkHeaders = (json) => {
    let inputHeaders = Object.keys(json[0]).map(iH=>iH.toLowerCase()).filter(iH=> !iH.startsWith('field'))
    let reqHeaders = poHeaders.filter(h => h.required === true)
    let warnings = [];
    reqHeaders.filter(rh => rh.required !== true)
    for (let inputHeader of inputHeaders) {
      if (!poHeaders.some(poH=>poH.value === inputHeader)) {
        warnings.push(`Invalid Header: "${inputHeader}" will be ignored`)
      }
      poHeaders.forEach(h => {
        if (h.required === true && h.value === inputHeader) {
          reqHeaders = reqHeaders.filter(rh=>rh.value !== inputHeader)
        }
      })
    }
    if (reqHeaders.length > 0) {
      console.log('the missing headers are')
      console.log(reqHeaders)
      let errorList = reqHeaders.map(h => (
        `Missing Required Header: ${h.value}`
      ))
      this.setState({
        showCompleteImportButton: false,
        errorType: 'error',
        errorHeader: 'Please fix the errors and upload the file again'
      })
      this.props.addError(errorList)
      return false
    }
    if (warnings.length > 0) {
      this.setState({
        errorType: 'warning',
        errorHeader: 'The following headers will be ignored',
      })
      this.props.addError(warnings)
      console.log(warnings)
      return true
    }
    return true
  }

  handleFileUpload = async (e) => {
    this.setState({
      activeFile: e.target.files[0].name,
    })
    this.props.removeError();
    let json = await this.props.parseCSV(e)
    .then(json => {
      console.log(json)
      let headerCheck = this.checkHeaders(json)
      if (headerCheck) {
        this.setState({
          showCompleteImportButton: true,
          json,
        })
      }
    })
    .catch(err => {
      this.setState({
        errorType: 'error',
        errorHeader: 'Please fix the errors and upload the file again',
      })
    })
  }

  handleCompleteImportClick = () => {
    this.props.importPurchaseOrder(this.state.json, this.props.currentUser)
  }

  handleShowImport = () => {
    this.setState({
      showImport: !this.state.showImport,
      activeFile: this.state.showImport ? '' : this.state.activeFile,
      poType: this.state.poType !== '' ? '' : this.state.poType,
      scanType: this.state.scanType !== '' ? '' : this.state.scanType,
    })
  }

  handlewActionsMenuToggle = () => {
    this.setState({
      showActionsMenu: !this.state.showActionsMenu,
    })
  }

  render() {
    const { showImport, activeFile, update,  errorType, errorHeader, showCompleteImportButton, showActionsMenu } = this.state;
    const { currentUser, errors } = this.props
    return(
      <div>
        <Grid container columns={2} verticalAlign="middle" stackable>
          <Grid.Column>
            <Header size='huge'>Purchase Orders</Header>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Button color={showImport ? 'red' : null} content={showImport ? 'Cancel Import' : 'Import PO'} icon={showImport ? 'cancel' : 'add'} labelPosition='right' onClick={this.handleShowImport} />
          </Grid.Column>
        </Grid>
        {showImport && (
          <Grid textAlign="center" columns={1} verticalAlign="middle" stackable>
            <Grid.Column>
            <Segment raised>
              <Grid container columns={1} verticalAlign="middle" centered stackable>
                <Form style={{minWidth: '300px',padding: '30px 10px'}}>
                  <Header size="medium">Import New Purchase Order</Header>
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
                  >
                    <Button
                      icon="cloud upload"
                      label={{
                        basic: true,
                        content: 'Select file to upload',
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
                  {activeFile && (
                    <div style={{marginTop: '10px'}}>
                      <Header size="tiny">File: {activeFile}</Header>
                    </div>
                  )}
                  {showCompleteImportButton && (
                    <div style={{padding: '10px'}}>
                      <Button size="large" color="teal" content="Submit" onClick={this.handleCompleteImportClick} />
                    </div>
                  )}
                </Form>
              </Grid>
            </Segment>
          </Grid.Column>
          </Grid>
        )}
        <Segment raised className="po-item-container">
          <div className="po-item">
            <div className="po-details">
              <div style={{marginTop: "-5px", marginRight: "5px"}}>
                <Icon name="circle" color="teal" />
              </div>
              <div>
                <Header size="medium" className="po-title">First Purchase Order</Header>
                <Header disabled size="small" style={{margin: "10px 5px"}}>9/6/2018</Header>
                <Label className="po-status" size="large" color='teal'>SCANNING</Label>
                <Label className="po-type" size="large" color='olive'>OUTBOUND</Label>
              </div>
            </div>
            <div className="po-actions">
              <Transition visible={showActionsMenu} animation='fade left' duration={200}>
                <div>
                  <div className="actions-menu">
                    <Label as="a" size="large" pointing='right'>Scan PO</Label>
                    <Label as="a" size="large" pointing='right'>Mark Complete</Label>
                    <Label as="a" size="large" pointing='right'>Delete PO</Label>
                  </div>
                </div>
              </Transition>
              <Transition animation='fade' duration={200}>
                {showActionsMenu ?
                  <Icon
                    className="actions-menu-icon"
                    onClick={this.handlewActionsMenuToggle}
                    size="large"
                    color="teal"
                    name='close'
                  />
                  :
                  <Icon
                    className="actions-menu-icon"
                    onClick={this.handlewActionsMenuToggle}
                    size="large"
                    color="teal"
                    name='ellipsis vertical'
                  />
                }
              </Transition>
            </div>
          </div>
        </Segment>
      </div>
    )
  }
}

 function mapStateToProps(state) {
 	return {
 		currentUser: state.currentUser,
    errors: state.errors,
 	};
 }

 export default connect(mapStateToProps, {parseCSV, importPurchaseOrder, addError, removeError})(PurchaseOrders);
