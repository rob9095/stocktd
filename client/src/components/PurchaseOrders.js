import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Label, Header, Segment, Form, Menu, Message, Icon, Transition, Input, Checkbox, Dropdown, Pagination } from 'semantic-ui-react';
import { parseCSV, validatePOInputs, validatePOHeaders } from '../services/parseCSV';
import { importPurchaseOrder, fetchPurchaseOrders, updatePurchaseOrders, fetchCompanyPoProducts } from '../store/actions/purchaseOrders';
import PurchaseOrderListItem from './PurchaseOrderListItem';
import PurchaseOrderFilterForm from './PurchaseOrderFilterForm';
import NoResultsMessage from './NoResultsMessage';
import { addError, removeError } from '../store/actions/errors';

const poHeaders = [{value:'po name', required: true},{value:'po type', required: true},{value: 'sku', required: true},{value:'quantity', required: true},{value:'po status'},{value:'price'},{value:'scanned quantity'}]
const validInputs = {
  status: ['processing','complete'],
  type: ['inbound','outbound'],
  quantity: ['number'],
}

class PurchaseOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      purchaseOrders: [],
      filteredPurchaseOrders: [],
      poProducts: [],
      filteredPoProducts: [],
      activeFile: '',
      json: [],
      selected: [],
      selectAll: false,
      update: true,
      showImport: false,
      showCompleteImportButton: false,
      errorType: '',
      errorHeader: '',
      showActionsMenu: false,
      submitLoading: false,
      submitButtonText: 'Submit File',
      showReSubmitHint: false,
      showFilters: false,
      labelFilter: '',
      showBulkMenu: false,
      showSortMenu: false,
      sortBy: '',
      sortDirection: '',
      rowsPerPage: 10,
      activePage: 1,
    }
  }

  componentDidMount() {
    this.props.removeError()
    this.props.fetchPurchaseOrders(this.props.currentUser)
    .then(async res=>{
      let purchaseOrders = res.map(po=>{
        let status = po.isComplete === true ? 'complete' : 'processing'
        // todo add po skus to po
        return {
          ...po,
          status,
        }
      }).sort((a,b)=> (a.createdOn < b.createdOn ? -1 : 1 ))
      this.setState({
        isLoading: false,
        purchaseOrders,
        filteredPurchaseOrders: purchaseOrders,
      })
      let response = await this.props.fetchCompanyPoProducts(this.props.currentUser)
      this.setState({
        poProducts: response.poProducts,
        filteredPoProducts: response.poProducts,
      })
    })
    .catch(err=>{
      this.setState({
        isLoading: false,
      })
    })
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
      let headerCheck = await this.props.validatePOHeaders(jsonLowerCase, poHeaders)
      if (headerCheck.errorType === 'warning') {
        //display warnings
        this.props.addError(headerCheck.errorList)
        this.setState({
          errorType: headerCheck.errorType,
          errorHeader: headerCheck.errorHeader,
          submitButtonText: 'Submit File with Warnings',
        })
      }
      let inputCheck = await this.props.validatePOInputs(jsonLowerCase, validInputs)
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

  handleShowImport = () => {
    this.props.removeError()
    this.setState({
      showImport: !this.state.showImport,
      showCompleteImportButton: false,
      activeFile: this.state.showImport ? '' : this.state.activeFile,
    })
  }

  handleToggleFilters = () => {
    this.props.removeError()
    this.setState({
      showFilters: !this.state.showFilters,
    })
  }

  handleSubmitHintToggle = () => {
    this.setState({
      showReSubmitHint: !this.state.showReSubmitHint,
    })
  }

  handleRowCheck = (id) => {
    this.updateArraySelection(id,'selected')
  }

  isSelected = val => this.state.selected.indexOf(val) != -1;

  handleSelectAllClick = () => {
    if (!this.state.selectAll) {
      this.setState({ selected: this.state.filteredPurchaseOrders.map(po => po._id), selectAll: true, });
      return
    }
    this.setState({ selected: [], selectAll: false, });
  };

  updateArraySelection = (value,arrName) => {
    let selected = this.state[arrName];
    if (this.state[arrName].indexOf(value) !== -1) {
      selected = this.state[arrName].filter(s => s !== value)
    } else {
      selected.push(value)
    }
    this.setState({ [arrName]: selected });
    return selected;
  }

  handleLabelToggle = (e,clicked) => {
    let pos = clicked.name === 'status' ?
      this.state.purchaseOrders.filter(po=>po.status === clicked.value)
      :
      this.state.purchaseOrders.filter(po=>po.type === clicked.value)
    this.setState({
      filteredPurchaseOrders: pos,
      labelFilter: clicked.value,
    })
    // old code is ugly!
    // const labels = ['po-type','po-status']
    // const classes = e.target.classList;
    // let labelFilter = '';
    // let i = 0;
    // for (let c of classes) {
    //   if (labels.includes(c)) {
    //     labelFilter = `${c}-${classes[i+1]}`
    //   }
    //   i++
    // }
    // let filteredPurchaseOrders = this.state.purchaseOrders.filter(po=>{
    //   let status = po.isComplete === true ? 'complete' : 'processing'
    //   if (labelFilter === `po-type-${po.type}` || labelFilter === `po-status-${status}`) {
    //     return {...po}
    //   }
    // })
    // this.setState({
    //   filteredPurchaseOrders,
    //   labelFilter,
    // })
    // console.log(labelFilter)
  }

  handleClearLabelFilter = () => {
    this.setState({
      labelFilter: '',
      filteredPurchaseOrders: this.state.purchaseOrders,
    })
  }

  handleBulkMenuToggle = (e) => {
    this.setState({
      showBulkMenu: !this.state.showBulkMenu,
    })
  }

  handleFilterSearch = (query,dates) => {
    this.setState({
      labelFilter: '',
    })
    let results = [];
    let pos = this.state.purchaseOrders
    if (dates.length === 1) {
      console.log(dates[0][1])
      pos = pos.filter(po=>po.createdOn >= dates[0][1])
    } else if (dates.length === 2){
      pos = pos.filter(po=>po.createdOn >= dates[0][1] && po.createdOn <= dates[0][1])
    }
    for (let val of query) {
      pos = pos.filter(po=>po[val[0]].toLowerCase().includes(val[1]) === true)
    }
    this.setState({
      filteredPurchaseOrders: pos,
    })
  }

  handleShowSortMenu = () => {
    this.setState({
      showSortMenu: !this.state.showSortMenu,
    })
  }

  sortArray = (array,sortDirection,sortBy) => {
    return sortDirection === 'ascending' ?
      array.sort((a,b)=> (a[sortBy] < b[sortBy] ? -1 : 1))
      :
      array.sort((a,b)=> (b[sortBy] < a[sortBy] ? -1 : 1 ))
  }

  handleSort = (e, clicked) => {
    this.setState({
      showSortMenu: false,
    })
    let { sortBy, purchaseOrders, filteredPurchaseOrders, sortDirection } = this.state

    if (sortBy !== clicked.value) {
      this.setState({
        sortBy: clicked.value,
        purchaseOrders: this.sortArray(purchaseOrders,'ascending',clicked.value),
        filteredPurchaseOrders: this.sortArray(filteredPurchaseOrders,'ascending',clicked.value),
        sortDirection: 'ascending',
      })
      return
    }
    sortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending'
    this.setState({
      purchaseOrders: this.sortArray(purchaseOrders,sortDirection,clicked.value),
      filteredPurchaseOrders: this.sortArray(purchaseOrders,sortDirection,clicked.value),
      sortDirection,
    })
  }

  handleRowsPerPageChange = (e, { value }) => this.setState({ rowsPerPage: parseInt(value), activePage: 1 })

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

  handleBulkComplete = () => {
    let selected = this.state.selected;
    //make updates, adding update flag
    let purchaseOrders = this.state.purchaseOrders.map(po=>{
      if (selected.indexOf(po._id) !== -1) {
        return {
          ...po,
          isComplete: true,
          update: true,
        }
      } else {
        return {
          ...po,
        }
      }
    })
    // do same for filtered pos but leave out update flag
    let filteredPurchaseOrders = this.state.filteredPurchaseOrders.map(po=>{
      if (selected.indexOf(po._id) !== -1) {
        return {
          ...po,
          isComplete: true,
        }
      } else {
        return {
          ...po
        }
      }
    })
    let poProducts = this.state.poProducts.map(p=>({
      ...p,
      isComplete: false,
    })).filter(p=>selected.indexOf(p.poId) !== -1)
    this.props.updatePurchaseOrders(purchaseOrders.filter(po=>po.update === true),poProducts,this.props.currentUser)
    .then(res=>{
      console.log(res)
      //update state
      this.setState({
        filteredPurchaseOrders,
        purchaseOrders: filteredPurchaseOrders,
      })
    })
    .catch(err=>{
      console.log(err)
    })
  }

  render() {
    const { showImport, activeFile, update,  errorType, errorHeader, showCompleteImportButton, showActionsMenu, submitButtonText, showFilters, labelFilter, showBulkMenu, selectAll, showSortMenu, rowsPerPage, activePage } = this.state;
    const { currentUser, errors } = this.props
    if (this.state.isLoading) {
      return(
        <div>loading...</div>
      )
    }
    let purchaseOrdersList = this.state.filteredPurchaseOrders.slice(rowsPerPage*(activePage-1), rowsPerPage*activePage).map((po)=>{
      let status = po.isComplete === true ? 'Complete' : 'Processing'
      let type = po.type === 'inbound' ? 'Inbound' : 'Outbound'
      let statusColor = po.isComplete === true ? 'green' : 'teal'
      let statusIcon = po.isComplete === true ? 'check' : 'sync'
      let typeColor = po.type === 'inbound' ? 'orange' : 'yellow'
      let typeIcon = po.type === 'inbound' ? 'warehouse' : 'dolly'
      let isSelected = this.isSelected(po._id);
      return(
        <PurchaseOrderListItem
          key={po._id}
          id={po._id}
          isSelected={isSelected}
          isComplete={po.isComplete}
          name={po.name}
          createdOn={po.createdOn}
          type={type}
          status={status}
          statusColor={statusColor}
          statusIcon={statusIcon}
          typeColor={typeColor}
          typeIcon={typeIcon}
          handleRowCheck={this.handleRowCheck}
        />
      )
    })
    return(
      <div className="po-dash">
        <Grid container columns={2} verticalAlign="middle">
          <Grid.Column>
            <Header size='huge'>Purchase Orders</Header>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Menu stackable secondary>
              <Menu.Menu position='right'>
                <Dropdown item text={`${rowsPerPage} rows/page`}>
                  <Dropdown.Menu>
                    <Dropdown.Item value="10" onClick={this.handleRowsPerPageChange}>10</Dropdown.Item>
                    <Dropdown.Item value="25" onClick={this.handleRowsPerPageChange}>25</Dropdown.Item>
                    <Dropdown.Item value="100" onClick={this.handleRowsPerPageChange}>100</Dropdown.Item>
                    <Dropdown.Item value="250" onClick={this.handleRowsPerPageChange}>250</Dropdown.Item>
                    <Dropdown.Item value="500" onClick={this.handleRowsPerPageChange}>500</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid>
        <Grid columns={2} verticalAlign="middle" stackable>
          <Grid.Column className="header col">
            <Label
              as="a"
              className={
                labelFilter !== '' && labelFilter !== 'outbound' ?
                'po-type outbound disabled'
                :
                'po-type outbound'
              }
              icon={{name: 'dolly', color: 'yellow'}}
              content="Outbound"
              name="type"
              value="outbound"
              onClick={this.handleLabelToggle}
            />
            <Label
              as="a"
              className={
                labelFilter !== '' && labelFilter !== 'inbound' ?
                'po-type inbound disabled'
                :
                'po-type inbound'
              }
              icon={{name: 'warehouse', color: 'orange'}}
              content="Inbound"
              name="type"
              value="inbound"
              onClick={this.handleLabelToggle}
            />
            <Label
              as="a"
              className={
                labelFilter !== '' && labelFilter !== 'complete' ?
                'po-status complete disabled'
                :
                'po-status complete'
              }
              icon={{name: 'check', color: 'green'}}
              content="Complete"
              name="status"
              value="complete"
              onClick={this.handleLabelToggle}
            />
            <Label
              as="a"
              className={
                labelFilter !== '' && labelFilter !== 'processing' ?
                'po-status processing disabled'
                :
                'po-status processing'
              }
              icon={{name: 'sync', color: 'teal'}}
              content="Processing"
              name="status"
              value="processing"
              onClick={this.handleLabelToggle}
            />
            {labelFilter !== '' && (
              <Icon name="close" color="grey" className="clear-filter-icon" onClick={this.handleClearLabelFilter} />
            )}
          </Grid.Column>
          <Grid.Column textAlign="right" className="header col">
            <Label as="a" icon={{name: 'sort amount down', color: 'violet'}} content='Sort By' onClick={this.handleShowSortMenu} />
            {showSortMenu && (
              <span style={{position: 'relative'}}>
                <span style={{ position: 'absolute', top: '25px', right: '-1px', zIndex: 1000, width: '100px' }}>
                  <Button.Group size="tiny" vertical className="sort-by button-menu">
                    <Button value="name" onClick={this.handleSort}>
                      {this.state.sortBy == 'name' && (
                        <Icon name={this.state.sortDirection === 'ascending' ? 'angle double down' : 'angle double up'} />
                      )}
                      Name
                    </Button>
                    <Button value="createdOn" onClick={this.handleSort}>
                      {this.state.sortBy == 'createdOn' && (
                        <Icon name={this.state.sortDirection === 'ascending' ? 'angle double down' : 'angle double up'} />
                      )}
                      Date
                    </Button>
                  </Button.Group>
                </span>
              </span>
            )}
            <Label as="a" icon={{name: showBulkMenu ? 'cancel' : 'tasks', color: showBulkMenu ? 'red' : 'blue'}} content='Bulk' onClick={this.handleBulkMenuToggle} />
            <Label as="a" icon={{name: showFilters ? 'cancel' : 'filter', color: showFilters ? 'red' : 'brown'}} content='Filter' onClick={this.handleToggleFilters} />
            <Label as="a" icon={{name: showImport ? 'cancel' : 'add', color: showImport ? 'red' : 'olive'}} content='Import' onClick={this.handleShowImport} />
          </Grid.Column>
        </Grid>
        <Transition visible={showImport} animation='fade' duration={200} unmountOnHide transitionOnMount>
          <Grid textAlign="center" columns={1} verticalAlign="middle">
            <Grid.Column>
              <Grid container columns={1} verticalAlign="middle" centered>
                <Form style={{padding: '30px 10px'}}>
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
                      {this.state.showReSubmitHint && (
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
                            loading={this.state.submitLoading}
                            onClick={this.handleCompleteImportClick}
                          />
                        </div>
                      </Transition>
                    </div>
                </Form>
              </Grid>
            </Grid.Column>
          </Grid>
        </Transition>
        <Transition visible={showBulkMenu} animation='fade' duration={200} unmountOnHide transitionOnMount>
          <Grid textAlign="center" columns={1} verticalAlign="middle">
            <Grid.Column>
              <Form>
                <Form.Group widths="equal" style={{display: 'flex', justifyContent: 'center'}}>
                  <Button
                    icon={{
                      name: selectAll ? 'close' : 'check',
                      color: selectAll ? null : 'teal',
                    }}
                    color={selectAll ? 'teal' : null}
                    content={selectAll ? 'Deselect All' : 'Select All'}
                    onClick={this.handleSelectAllClick}
                  />
                  <Button
                    icon={{
                      name: 'search plus',
                      color: 'teal',
                    }}
                    content='Scan Selected'
                    disabled={this.state.selected.length === 0}
                  />
                  <Button
                    icon={{
                      name: 'check',
                      color: 'green',
                    }}
                    content='Complete Selected'
                    disabled={this.state.selected.length === 0}
                    onClick={this.handleBulkComplete}
                  />
                  <Button
                    icon={{
                      name: 'trash',
                      color: 'red',
                    }}
                    content='Delete Selected'
                    disabled={this.state.selected.length === 0}
                  />
                </Form.Group>
              </Form>
            </Grid.Column>
          </Grid>
        </Transition>
        <Transition visible={showFilters} animation='fade' duration={200} unmountOnHide transitionOnMount>
          <PurchaseOrderFilterForm
            handleFilterSearch={this.handleFilterSearch}
          />
        </Transition>
        {purchaseOrdersList.length > 0 ?
         purchaseOrdersList
         :
         <NoResultsMessage
           showMessage={this.state.purchaseOrders.length > 0 ? false : true}
           messageHeader={"No Purchase Orders Found"}
           messageText={"It looks like you haven't imported any purchase orders yet."}
           buttonText={"Import Purchase Order"}
           handleButtonClick={this.handleShowImport}
         />
        }
        {Math.ceil(Math.floor(this.state.filteredPurchaseOrders.length / rowsPerPage)) !== 0 && (
          <div className="pagination-container">
            <Pagination
              className="raised segment page-bar"
              ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
              firstItem={{ content: <Icon name='angle double left' />, icon: true }}
              lastItem={{ content: <Icon name='angle double right' />, icon: true }}
              prevItem={null}
              nextItem={null}
              totalPages={Math.ceil(Math.floor(this.state.filteredPurchaseOrders.length / rowsPerPage))}
              onPageChange={this.handlePaginationChange}
              activePage={activePage}
            />
          </div>
        )}
        <Grid textAlign="center" columns={1} verticalAlign="middle">
          <Grid.Column>
          </Grid.Column>
        </Grid>
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

 export default connect(mapStateToProps, {parseCSV, importPurchaseOrder, validatePOInputs, validatePOHeaders, fetchPurchaseOrders, updatePurchaseOrders, addError, removeError, fetchCompanyPoProducts})(PurchaseOrders);
