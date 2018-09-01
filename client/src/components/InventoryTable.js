import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Icon, Table, Loader, Pagination } from 'semantic-ui-react';
import { fetchAllProducts } from '../store/actions/products';

class InventoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      rowsPerPage: 100,
      activePage: 1,
      products: [],
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

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

  render(){
    let { isLoading, products, rowsPerPage, activePage } = this.state;
    if (isLoading) {
      return(
        <Loader active />
      )
    }
    let tableRows = this.state.products.slice(activePage * rowsPerPage, activePage * rowsPerPage + rowsPerPage).map(p => (
      <Table.Row
        key={p._id}
        >
        <Table.Cell collapsing>
          <Checkbox />
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
    ))
    return(
      <Table celled compact definition>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell />
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
            <Table.HeaderCell colSpan='8'>
              <Button icon labelPosition='left' primary size='small'>
                <Icon name='user' /> Add User
              </Button>
              <Button size='small'>Approve</Button>
              <Button disabled size='small'>
                Approve All
              </Button>
              <Pagination
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
