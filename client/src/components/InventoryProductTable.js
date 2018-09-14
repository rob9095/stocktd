import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Button, Checkbox, Dropdown, Menu, Icon, Table, Loader, Pagination, Segment, Grid, Transition, Label, Message } from 'semantic-ui-react';
import { fetchAllProducts, updateProducts, deleteProducts } from '../store/actions/products';
import { goToTop } from 'react-scrollable-anchor';
import ProductFilterForm from './ProductFilterForm';
import ProductUploadForm from './ProductUploadForm';
import ProductEditModal from './ProductEditModal';
import ConfirmModal from '../containers/ConfirmModal';

const actionOptions = [
  { selected: false, key: 'copy', icon: 'copy', text: 'Copy', value: 'copy' },
  { selected: false, key: 'order', icon: 'shop', text: 'Add to order', value: 'order' },
  { selected: false, key: 'delete', icon: 'trash', text: 'Delete', value: 'delete' },
]


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
      showDisplayOptions: false,
      showEditProductModal: false,
      showConfirmModal: false,
      confirmItems: [],
      confirmType: '',
      message: {
        open: false,
        type: '',
        header: '',
        list: [],
      }
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
        this.handleError({
          type: 'error',
          list: err.message,
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

  handleToggle = async (e,{value, id}) => {
    if (value === 'showEditProductModal' && id) {
      await this.setState({
        modalProduct: this.state.products.find(p=>p._id === id)
      })
    }
    this.setState({
      [value]: !this.state[value]
    })
  }

  handleProductUpdate = (updates, modelProduct) => {
    return new Promise((resolve,reject) => {
      let products = this.state.products.map(p=>{
        let update = updates.find(u=>u.id === p._id)
        if (update) {
          return {
            ...p,
            ...update,
          }
        } else {
          return {
            ...p,
          }
        }
      })
      this.props.updateProducts(updates, this.props.currentUser)
      .then((res)=>{
        this.setState({
          modelProduct: modelProduct !== undefined ? modelProduct : this.state.modelProduct,
          products,
        })
        resolve({
          status: 'success',
          updatedProducts: res.updateProducts,
        })
      })
      .catch(error=>{
        console.log(error.message)
        reject({
          status: 'error',
          error: error.message,
        });
      })
    })
  }

  handleModalConfirm = (items,type) => {
    switch(type) {
      case 'Delete':
        this.handleProductDelete(items)
        break;
      default:
        console.log('unknown confirmation type');
    }
  }

  handleProductDelete = (ids) => {
    let products = this.state.products.filter(p=>ids.indexOf(p._id) === -1)
    let selected = this.state.selected.filter(p=>ids.indexOf(p._id) === -1)
    const itemsText = ids.length > 1 ? 'items' : 'item'
    this.props.deleteProducts(ids,this.props.currentUser)
    .then(res=>{
      this.setState({
        products,
        selected,
        message: {
          open: true,
          type: 'success',
          list: [`${res.deletedProducts.nRemoved} ${itemsText} successfully deleted`]
        }
      })
    })
    .catch(err=>{
      this.handleError({
        type: 'error',
        list: err.message,
      })
    })
  }

  handleActionMenuClick = (e,clicked) => {
    switch(clicked.value) {
      case 'delete':
        this.setState({
          showConfirmModal: true,
          confirmItems: [clicked.id],
          confirmType: 'Delete',
        })
        break;
      default:
        console.log('unknown menu option');
    }
  }

  handleBulkDelete = () => {
    this.setState({
      showConfirmModal: true,
      confirmItems: this.state.selected,
      confirmType: 'Delete',
    })
  }

  handleError = ({type,list,header}) => {
    this.setState({
      message: {
        open: true,
        type,
        list,
        header,
      }
    })
  }

  render(){
    let { isLoading, products, rowsPerPage, activePage, selectAll, column, direction, skip, showImport, showFilters, showBulkMenu, showDisplayOptions } = this.state;
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
          <Table.Cell singleLine>{p.quantity}</Table.Cell>
          <Table.Cell singleLine>{p.quantityToShip}</Table.Cell>
          <Table.Cell singleLine>{p.price}</Table.Cell>
          <Table.Cell singleLine>{p.weight}</Table.Cell>
          <Table.Cell>{p.brand}</Table.Cell>
          <Table.Cell>{p.supplier}</Table.Cell>
          <Table.Cell textAlign="center">
            <Button.Group>
              <Button compact id={p._id} onClick={this.handleToggle} value="showEditProductModal">Edit</Button>
              <Dropdown id={p._id} onChange={this.handleActionMenuClick} options={actionOptions} text=" " floating button compact className='icon dgrey-bg h' />
            </Button.Group>
          </Table.Cell>
        </Table.Row>
      )
    })
    return(
      <div>
        <Grid container columns={2} verticalAlign="middle" stackable>
          {this.state.showEditProductModal && (
            <ProductEditModal
              handleToggle={this.handleToggle}
              handleProductUpdate={this.handleProductUpdate}
              product={this.state.modalProduct}
            />
          )}
          {this.state.showConfirmModal && (
            <ConfirmModal
              items={this.state.confirmItems}
              type={this.state.confirmType}
              onConfirm={this.handleModalConfirm}
              onCancel={this.handleToggle}
              header={null}
            />
          )}
          <Grid.Column>
            <Header size='huge'>Products</Header>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Menu stackable secondary>
              <Menu.Menu position='right'>
                <Dropdown item icon={{name: 'chevron down', size: 'small', color: 'teal', className: 'dropdown-icon'}} text={`${rowsPerPage} rows/page`}>
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
            <Label as="a" icon={{name: showDisplayOptions ? 'cancel' : 'cogs', color: showDisplayOptions ? 'red' : 'teal'}} content='Display Options' value="showDisplayOptions" onClick={this.handleToggle} />
          </Grid.Column>
          <Grid.Column textAlign="right" className="header col">
            <Label as="a" icon={{name: showBulkMenu ? 'cancel' : 'tasks', color: showBulkMenu ? 'red' : 'blue'}} content='Bulk' value="showBulkMenu" onClick={this.handleToggle} />
            <Label as="a" icon={{name: showFilters ? 'cancel' : 'filter', color: showFilters ? 'red' : 'brown'}} content='Filter' value="showFilters" onClick={this.handleToggle} />
            <Label as="a" icon={{name: showImport ? 'cancel' : 'add', color: showImport ? 'red' : 'olive'}} content='Import' value="showImport" onClick={this.handleToggle} />
          </Grid.Column>
        </Grid>
        <Transition visible={showImport} animation='fade' duration={200} unmountOnHide>
          <ProductUploadForm />
        </Transition>
        <Transition visible={showFilters} animation='fade' duration={200} unmountOnHide transitionOnMount>
          <ProductFilterForm
            handleFilterSearch={this.handleFilterSearch}
          />
        </Transition>
        <Transition visible={showBulkMenu} animation='fade' duration={200} unmountOnHide transitionOnMount>
          <Grid textAlign="center" columns={1} verticalAlign="middle">
            <Grid.Column>
              <Segment basic className="no-pad">
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
                    name: 'shop',
                    color: 'teal',
                  }}
                  content='Add to Order'
                  disabled={this.state.selected.length === 0}
                />
                <Button
                  icon={{
                    name: 'trash',
                    color: 'red',
                  }}
                  content='Delete Selected'
                  disabled={this.state.selected.length === 0}
                  onClick={this.handleBulkDelete}
                />
              </Segment>
            </Grid.Column>
          </Grid>
        </Transition>
        <Segment loading={isLoading} basic className="no-pad">
            <Transition visible={this.state.message.open} animation='fade' duration={200} unmountOnHide transitionOnMount>
              <div>
                <div className="flex-message center">
                  <Message
                    error={this.state.message.type === 'error'}
                    warning={this.state.message.type === 'warning'}
                    success={this.state.message.type === 'success'}
                    header={this.state.message.header || null}
                    list={this.state.message.list}
                  />
                </div>
              </div>
            </Transition>
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
                  sorted={column === 'title' ? direction : null}
                  onClick={this.handleSort('title')}
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
                  sorted={column === 'quantityToShip' ? direction : null}
                  onClick={this.handleSort('quantityToShip')}
                >
                  To Ship
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'price' ? direction : null}
                  onClick={this.handleSort('price')}
                >
                  Price
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'weight' ? direction : null}
                  onClick={this.handleSort('weight')}
                >
                  Weight
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'brand' ? direction : null}
                  onClick={this.handleSort('brand')}
                >
                  Brand
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={column === 'supplier' ? direction : null}
                  onClick={this.handleSort('supplier')}
                >
                  Supplier
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tableRows}
            </Table.Body>
          </Table>
          <div className="pagination-container">
            <Pagination
              size="mini"
              className="raised segment page-bar"
              ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
              firstItem={null}
              lastItem={null}
              prevItem={{ content: <Icon name='angle left' />, icon: true }}
              nextItem={{ content: <Icon name='angle right' />, icon: true }}
              totalPages={this.state.totalPages}
              onPageChange={this.handlePaginationChange}
              activePage={activePage}
              siblingRange={1}
            />
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

 export default connect(mapStateToProps, {fetchAllProducts, updateProducts, deleteProducts})(InventoryProductTable);
