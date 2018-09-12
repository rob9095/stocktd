import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Dropdown, Menu, Icon, Table, Loader, Pagination, Segment } from 'semantic-ui-react';
import { fetchAllProducts } from '../store/actions/products';
import { goToTop } from 'react-scrollable-anchor';

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
      column: '',
      direction: '',
    }
  }

  handleProductDataFetch = (requestedPage,requestedRowsPerPage) => {
    return new Promise((resolve,reject)=>{
      this.props.fetchAllProducts(requestedPage, requestedRowsPerPage, this.props.currentUser.user.company)
      .then(({products, activePage, totalPages, rowsPerPage, lowerPageLimit, upperPageLimit, skip})=>{
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
    this.setState({
      isLoading: true,
    })
    this.handleProductDataFetch(this.state.activePage,parseInt(value))
  }

  handlePaginationChange = async (e, { activePage }) => {
    this.setState({
      isLoading: true,
    })
    await this.handleProductDataFetch(activePage,this.state.rowsPerPage)
    goToTop();
  }

  handleSort = clickedColumn => () => {
    const { column, products, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        products: products.sort((a,b)=> (a[clickedColumn] === undefined) - (b[clickedColumn] === undefined) || a[clickedColumn] < b[clickedColumn] ? -1 : 1 ),
        direction: 'ascending',
      })

      return
    }

    this.setState({
      products: products.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  render(){
    let { isLoading, products, rowsPerPage, activePage, selectAll, column, direction, skip } = this.state;
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
        <Segment loading={isLoading} basic>
          <Table celled compact definition sortable>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan={9} className="table-header no-select">
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
                    totalPages={this.state.totalPages}
                    onPageChange={this.handlePaginationChange}
                    activePage={activePage}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
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
