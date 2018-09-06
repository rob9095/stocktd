import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Label, Header, Segment, Form, Menu } from 'semantic-ui-react';
import { parseCSV } from '../services/parseCSV';
import { importPurchaseOrder } from '../store/actions/purchaseOrders';

const typeOptions = [{key: 'inbound',text: 'Inbound', value: 'inbound'},{key: 'outbound',text: 'Outbound', value: 'outbound'}]

class PurchaseOrders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeFile: '',
      update: true,
      showImport: false,
      poType: '',
      scanType: '',
      activeDropdown: '',
      checkboxValue: '',
    }
  }

  handleFileUpload = async (e) => {
    let json = await this.props.parseCSV(e)
    console.log(json)
    this.props.importPurchaseOrder(json, this.props.currentUser)
  }

  handleShowImport = () => {
    this.setState({
      showImport: !this.state.showImport,
      activeFile: this.state.showImport ? '' : this.state.activeFile,
      poType: this.state.poType !== '' ? '' : this.state.poType,
      scanType: this.state.scanType !== '' ? '' : this.state.scanType,
    })
  }

  handleTypeSelect = (e, { name }) => this.setState({ poType: name })
  handleScanSelect = (e, { name }) => this.setState({ scanType: name })


  render() {
    const { showImport, activeFile, update, poType, scanType, checkboxValue } = this.state;
    const { currentUser } = this.props
    return(
      <div>
        <Grid container columns={2} verticalAlign="middle" stackable>
          <Grid.Column>
            <Header size='huge'>Purchase Orders</Header>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Button content={showImport ? 'Cancel Import' : 'Import PO'} icon={showImport ? 'cancel' : 'add'} labelPosition='right' onClick={this.handleShowImport} />
          </Grid.Column>
        </Grid>
        {showImport && (
          <Segment raised>
            <Grid container columns={1} verticalAlign="middle" centered stackable>
              <Form style={{minWidth: '300px',padding: '30px 10px'}}>
                <Header size='small'>Select a purchase order type</Header>
                <Menu compact icon='labeled'>
                  <Menu.Item
                    name="inbound"
                    active={poType === 'inbound'}
                    onClick={this.handleTypeSelect}
                  >
                    Inbound
                  </Menu.Item>
                  <Menu.Item
                    name="outbound"
                    active={poType === 'outbound'}
                    onClick={this.handleTypeSelect}
                  >
                    Outbound
                  </Menu.Item>
                </Menu>
                {poType !== '' && (
                  <div style={{marginTop: '30px'}}>
                    <Header size='small'>Scan after import?</Header>
                    <Menu compact icon='labeled'>
                      <Menu.Item
                        name="yesScan"
                        active={scanType === 'yesScan'}
                        onClick={this.handleScanSelect}
                      >
                        Yes, scan to complete
                      </Menu.Item>
                      <Menu.Item
                        name="noScan"
                        active={scanType === 'noScan'}
                        onClick={this.handleScanSelect}
                      >
                        No, complete on import
                      </Menu.Item>
                    </Menu>
                    {scanType !== '' &&(
                      <div style={{marginTop: '30px'}}>
                        <Header size='small'>Please choose a file to import</Header>
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
                            size="large"
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
                      </div>
                    )}
                  </div>
                )}
              </Form>
            </Grid>
          </Segment>
        )}
        <Segment raised>
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

 export default connect(mapStateToProps, {parseCSV, importPurchaseOrder})(PurchaseOrders);
