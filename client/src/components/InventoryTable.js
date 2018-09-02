import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Dropdown, Menu, Icon, Table, Loader, Pagination } from 'semantic-ui-react';
import { fetchAllProducts } from '../store/actions/products';

class InventoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      rowsPerPage: 100,
      activePage: 1,
      products: [],
      selected: [],
      selectAll: false,
    }
  }
  componentDidMount() {
    this.props.fetchAllProducts(this.props.currentUser.user.company)
    .then((res)=>{
      this.setState({
        isLoading: false,
        products: res.products,
      })
      console.log(this.state)
    })
  }

  handleRowCheck = ((e, id) => {
    let selected = [...this.state.selected];
    if (this.state.selected.includes(id)) {
      selected = this.state.selected.filter(s => s !== id)
    } else {
      selected.push(id)
    }
    this.setState({ selected });
  })

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleSelectAllClick = () => {
    if (!this.state.selectAll) {
      this.setState({ selected: this.state.products.map(p => p._id), selectAll: true, });
      return
    }
    this.setState({ selected: [], selectAll: false, });
  };

  handleRowsPerPageChange = (e, { value }) => this.setState({ rowsPerPage: parseInt(value) })

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

  render(){
    let { isLoading, products, rowsPerPage, activePage, rowsPerPageOptions, selectAll } = this.state;
    if (isLoading) {
      return(
        <Loader active />
      )
    }
    let tableRows = this.state.products.slice(activePage * rowsPerPage, activePage * rowsPerPage + rowsPerPage).map(p => {
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
          <Table.Cell>{p.sku}</Table.Cell>
          <Table.Cell>{p.title}</Table.Cell>
          <Table.Cell>{p.quantity}</Table.Cell>
          <Table.Cell>{p.quantityToShip}</Table.Cell>
          <Table.Cell>{p.price}</Table.Cell>
          <Table.Cell>{p.weight}</Table.Cell>
          <Table.Cell>{p.brand}</Table.Cell>
          <Table.Cell>{p.supplier}</Table.Cell>
        </Table.Row>
      )
    })
    return(
      <div>
        <Table celled compact definition>
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan={9}>
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
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing>
                <Checkbox
                  onClick={this.handleSelectAllClick}
                  checked={selectAll}
                />
              </Table.HeaderCell>
              <Table.HeaderCell>SKU</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Quantity to Ship</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Weight</Table.HeaderCell>
              <Table.HeaderCell>Brand</Table.HeaderCell>
              <Table.HeaderCell>Supplier</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tableRows}
          </Table.Body>

          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan='9'>
                <Button icon labelPosition='left' primary size='small'>
                  <Icon name='user' /> Add User
                </Button>
                <Button size='small'>Approve</Button>
                <Button disabled size='small'>
                  Approve All
                </Button>
                <Pagination
                  size='mini'
                  floated='right'
                  ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                  firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                  lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                  prevItem={{ content: <Icon name='angle left' />, icon: true }}
                  nextItem={{ content: <Icon name='angle right' />, icon: true }}
                  totalPages={Math.floor(products.length / rowsPerPage)}
                  onPageChange={this.handlePaginationChange}
                  activePage={activePage}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
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

 export default connect(mapStateToProps, {fetchAllProducts})(InventoryTable);
