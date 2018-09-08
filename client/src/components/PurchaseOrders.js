import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Label, Header, Segment, Form, Menu, Message, Icon, Transition } from 'semantic-ui-react';
import { parseCSV } from '../services/parseCSV';
import { importPurchaseOrder, fetchPurchaseOrders } from '../store/actions/purchaseOrders';
import PurchaseOrderListItem from './PurchaseOrderListItem';
import { addError, removeError } from '../store/actions/errors';

const poHeaders = [{value:'po name', required: true},{value:'po type', required: true},{value: 'sku', required: true},{value:'quantity', required: true},{value:'po status'},{value:'price'},{value:'scanned quantity'}]
let validPoStatus = ['processing','complete']
let validPoType = ['inbound','outbound']

class PurchaseOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      purchaseOrders: [],
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

  componentDidMount() {
    this.props.fetchPurchaseOrders(this.props.currentUser)
    .then(res=>{
      this.setState({
        isLoading: false,
        purchaseOrders: res,
      })
    })
    .catch(err=>{
      this.setState({
        isLoading: false,
      })
    })
  }

  checkRequiredInputs = (json) => {
    let errors = [];
    json.forEach((poLine,i) => {
      if (!validPoType.includes(poLine['po type'])) {
        errors.push(`PO Type on line ${i+1} "${poLine['po type']}" is not valid`)
      }
      if (poLine['po status']) {
        if (!validPoStatus.includes(poLine['po status'])) {
          errors.push(`PO Status on line ${i+1} "${poLine['po status']}" is not valid`)
        }
      }
      if (!Number.isInteger(parseInt(poLine['quantity']))) {
        errors.push(`Quantity on line ${i+1} "${poLine['quantity']}" is not a valid number`)
      }
    })
    if (errors.length === 0) {
      return true;
    }
    this.setState({
      errorType: 'error',
      errorHeader: 'Please fix the errors and upload the file again',
      showCompleteImportButton: false,
      isLoading: false,
    })
    this.props.addError(errors)
    return false
  }

  checkHeaders = (json) => {
    return new Promise((resolve,reject) => {
      let inputHeaders = Object.keys(json[0]).filter(iH=> !iH.startsWith('field'))
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
          errorType: 'error',
          errorHeader: 'Please fix the errors and upload the file again',
          showCompleteImportButton: false,
          isLoading: false,
        })
        this.props.addError(errorList)
        reject(false)
        return
      }
      if (warnings.length > 0) {
        this.setState({
          errorType: 'warning',
          errorHeader: 'The following headers will be ignored',
          isLoading: false,
        })
        this.props.addError(warnings)
        console.log(warnings)
        resolve(true)
        return
      }
      if (!inputHeaders.includes('po status')){
        this.setState({
          errorType: 'warning',
          errorHeader: 'PO Status header missing',
          isLoading: false,
        })
        this.props.addError(['PO will be marked as complete on import'])
      }
      resolve(true)
    })
  }

  handleFileUpload = async (e) => {
    this.setState({
      activeFile: e.target.files[0].name,
      isLoading: true,
    })
    this.props.removeError();
    this.props.parseCSV(e)
    .then(({json, jsonLowerCase}) => {
      console.log(jsonLowerCase)
      this.checkHeaders(jsonLowerCase)
      .then(()=>{
        let inputCheck = this.checkRequiredInputs(jsonLowerCase)
        if (inputCheck) {
          this.setState({
            showCompleteImportButton: true,
            json,
            isLoading: false,
          })
        }
      })
    })
    .catch(err => {
      this.setState({
        errorType: 'error',
        errorHeader: 'Please fix the errors and upload the file again',
        isLoading: false,
      })
    })
  }

  handleCompleteImportClick = () => {
    this.props.importPurchaseOrder(this.state.json, this.props.currentUser)
    .then(res=>{
      this.setState({
        isLoading: false,
        purchaseOrders: [...this.state.purchaseOrders,...res.addedPOs],
      })
    })
  }

  handleShowImport = () => {
    this.setState({
      showImport: !this.state.showImport,
      showCompleteImportButton: false,
      activeFile: this.state.showImport ? '' : this.state.activeFile,
      poType: this.state.poType !== '' ? '' : this.state.poType,
      scanType: this.state.scanType !== '' ? '' : this.state.scanType,
    })
  }

  handlewActionsMenuToggle = (e) => {
    this.setState({
      showActionsMenu: !this.state.showActionsMenu,
    })
  }

  render() {
    const { showImport, activeFile, update,  errorType, errorHeader, showCompleteImportButton, showActionsMenu } = this.state;
    const { currentUser, errors } = this.props
    if (this.state.isLoading) {
      return(
        <div>loading...</div>
      )
    }
    let purchaseOrdersList = this.state.purchaseOrders.map((po)=>{
      let status = po.isComplete === true ? 'Complete' : 'Processing'
      let type = po.type === 'inbound' ? 'Inbound' : 'Outbound'
      let statusColor = po.isComplete === true ? 'green' : 'teal'
      let statusIcon = po.isComplete === true ? 'check' : 'sync'
      let typeColor = po.type === 'inbound' ? 'orange' : 'yellow'
      let typeIcon = po.type === 'inbound' ? 'warehouse' : 'dolly'
      return(
        <PurchaseOrderListItem
          key={po._id}
          name={po.name}
          createdOn={po.createdOn}
          type={type}
          status={status}
          statusColor={statusColor}
          statusIcon={statusIcon}
          typeColor={typeColor}
          typeIcon={typeIcon}
        />
      )
    })
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
        <Transition visible={showImport} animation='fade' duration={200} unmountOnHide transitionOnMount>
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
                    <Transition visible={showCompleteImportButton} animation='fade down' duration={200} unmountOnHide transitionOnMount>
                      <div style={{padding: '10px'}}>
                        {errors.message ?
                        <Button size="large" color="teal" content="Submit File with Warnings" onClick={this.handleCompleteImportClick} />
                          :
                        <Button size="large" color="teal" content="Submit File" onClick={this.handleCompleteImportClick} />
                        }
                      </div>
                    </Transition>
                  </Form>
                </Grid>
              </Segment>
            </Grid.Column>
          </Grid>
        </Transition>
        {purchaseOrdersList}
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

 export default connect(mapStateToProps, {parseCSV, importPurchaseOrder, fetchPurchaseOrders, addError, removeError})(PurchaseOrders);
