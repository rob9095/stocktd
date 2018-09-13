import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Button, Checkbox, Dropdown, Menu, Icon, Table, Loader, Pagination, Segment, Grid, Transition, Label } from 'semantic-ui-react';
import { fetchAllProducts } from '../store/actions/products';
import { goToTop } from 'react-scrollable-anchor';
import ProductFilterForm from './ProductFilterForm';
import ProductUploadForm from './ProductUploadForm';

class InventoryProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      rowsPerPage: 100,
      activePage: 1,
      totalPages: 0,
      skip: 0,
      products: [],
      selected: [],
      selectAll: false,
      column: 'sku',
      direction: 'ascending',
      query: [],
      showImport: false,
      showFilters: false,
      showBulkMenu: false,
    }
  }

  handleProductDataFetch = (requestedPage,requestedRowsPerPage) => {
    this.setState({
      isLoading: true,
    })
    return new Promise((resolve,reject)=>{
      this.props.fetchAllProducts(this.state.query,this.state.column, this.state.direction, requestedPage, requestedRowsPerPage, this.props.currentUser.user.company)
      .then(({products, activePage, totalPages, rowsPerPage, skip})=>{
        this.setState({
          isLoading: false,
          dataPage: 1,
          skip,
          products,
          activePage,
          totalPages,
          rowsPerPage,
        })
        console.log(this.state)
        resolve();
      })
      .catch(err=>{
        this.setState({
          isLoading: false,
        })
        console.log(err)
        reject();
      })
    })
  }

  componentDidMount() {
    this.handleProductDataFetch(this.state.activePage,this.state.rowsPerPage)
  }

  handleRowCheck = (e, id) => {
    let selected = this.state.selected;
    if (this.state.selected.indexOf(id) != -1) {
      selected = this.state.selected.filter(s => s !== id)
    } else {
      selected.push(id)
    }
    this.setState({ selected });
  }

  isSelected = id => this.state.selected.indexOf(id) != -1;

  handleSelectAllClick = () => {
    if (!this.state.selectAll) {
      this.setState({ selected: this.state.products.map(p => p._id), selectAll: true, });
      return
    }
    this.setState({ selected: [], selectAll: false, });
  };

  handleRowsPerPageChange = (e, { value }) => {
    this.handleProductDataFetch(this.state.activePage,parseInt(value))
  }

  handlePaginationChange = async (e, { activePage }) => {
    await this.handleProductDataFetch(activePage,this.state.rowsPerPage)
    goToTop();
  }

  handleSort = clickedColumn => async () => {
    const { column, products, direction } = this.state
    if (column !== clickedColumn) {
      await this.setState({
        column: clickedColumn,
        direction: 'ascending',
      })
      this.handleProductDataFetch(this.state.activePage,this.state.rowsPerPage)
      return
    }
    await this.setState({
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
    this.handleProductDataFetch(this.state.activePage,this.state.rowsPerPage)
  }

  handleFilterSearch = async (query) => {
    await this.setState({
      query,
    })
    this.handleProductDataFetch(1,this.state.rowsPerPage)
  }

  handleMenuToggle = (e,{value}) => {
    console.log(value)
    this.setState({
      [value]: !this.state[value]
    })
  }

  render(){
    let { isLoading, products, rowsPerPage, activePage, selectAll, column, direction, skip, showImport, showFilters, showBulkMenu } = this.state;
    let tableRows = this.state.products.map(p => {
      const isSelected = this.isSelected(p._id);
      return (
        <Table.Row
          key={p._id}
          >
          <Table.Cell collapsing>
            <Checkbox
              onClick={event => this.handleRowCheck(event, p._id)}
              checked={isSelected}
            />
          </Table.Cell>
          <Table.Cell singleLine>{p.sku}</Table.Cell>
          <Table.Cell>{p.title}</Table.Cell>
          <Table.Cell singleLine textAlign="center">{p.quantity}</Table.Cell>
          <Table.Cell singleLine textAlign="center">{p.quantityToShip}</Table.Cell>
          <Table.Cell singleLine textAlign="center">{p.price}</Table.Cell>
          <Table.Cell singleLine textAlign="center">{p.weight}</Table.Cell>
          <Table.Cell>{p.brand}</Table.Cell>
          <Table.Cell>{p.supplier}</Table.Cell>
        </Table.Row>
      )
    })
    return(
      <div>
        <Grid container columns={2} verticalAlign="middle">
          <Grid.Column>
            <Header size='huge'>Products</Header>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Menu stackable secondary>
              <Menu.Menu position='right'>
                <Dropdown item text={`${rowsPerPage} rows/page`}>
                  <Dropdown.Menu>
                    <Dropdown.Item value="50" onClick={this.handleRowsPerPageChange}>50</Dropdown.Item>
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
          </Grid.Column>
          <Grid.Column textAlign="right" className="header col">
            <Label as="a" icon={{name: showBulkMenu ? 'cancel' : 'tasks', color: showBulkMenu ? 'red' : 'blue'}} content='Bulk' value="showBulkMenu" onClick={this.handleMenuToggle} />
            <Label as="a" icon={{name: showFilters ? 'cancel' : 'filter', color: showFilters ? 'red' : 'brown'}} content='Filter' value="showFilters" onClick={this.handleMenuToggle} />
            <Label as="a" icon={{name: showImport ? 'cancel' : 'add', color: showImport ? 'red' : 'olive'}} content='Import' value="showImport" onClick={this.handleMenuToggle} />
          </Grid.Column>
        </Grid>
        <Transition visible={showImport} animation='fade' duration={200} unmountOnHide transitionOnMount>
          <ProductUploadForm />
        </Transition>
        <Transition visible={showFilters} animation='fade' duration={200} unmountOnHide transitionOnMount>
          <ProductFilterForm
            handleFilterSearch={this.handleFilterSearch}
          />
        </Transition>
        <Segment loading={isLoading} basic className="no-pad">
          <Table celled compact definition sortable>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell collapsing>
                  <Checkbox
                    onClick={this.handleSelectAllClick}
                    checked={selectAll}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'sku' ? direction : null}
                  onClick={this.handleSort('sku')}
                >
                  SKU
                </Table.HeaderCell>
                <Table.HeaderCell
                >
                Title
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'quantity' ? direction : null}
                  onClick={this.handleSort('quantity')}
                >
                  Quantity
                </Table.HeaderCell>
                <Table.HeaderCell
                >
                  To Ship
                </Table.HeaderCell>
                <Table.HeaderCell

                >
                  Price
                </Table.HeaderCell>
                <Table.HeaderCell

                >
                  Weight
                </Table.HeaderCell>
                <Table.HeaderCell
                >
                  Brand
                </Table.HeaderCell>
                <Table.HeaderCell
                >
                  Supplier
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {tableRows}
            </Table.Body>
          </Table>
          <Pagination
            size='mini'
            floated='right'
            ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
            totalPages={this.state.totalPages}
            onPageChange={this.handlePaginationChange}
            activePage={activePage}
          />
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

 export default connect(mapStateToProps, {fetchAllProducts})(InventoryProductTable);
