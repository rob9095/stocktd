import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Dropdown, Menu, Icon, Table, Loader, Pagination } from 'semantic-ui-react';
import { fetchPoProducts } from '../store/actions/purchaseOrders';

class PoProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      rowsPerPage: 100,
      activePage: 1,
      products: [],
      selected: [],
      selectAll: false,
      column: '',
      direction: '',
    }
  }
  componentDidMount() {
    this.props.fetchPoProducts(this.props.id, this.props.currentUser)
    .then((res)=>{
      this.setState({
        isLoading: false,
        products: res.products,
      })
      console.log(this.state)
    })
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

  handleRowsPerPageChange = (e, { value }) => this.setState({ rowsPerPage: parseInt(value) })

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

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
    let { products, rowsPerPage, activePage, selectAll, column, direction, isLoading } = this.state;
    if (isLoading) {
      return(
        <div className="loader-top">
           <Loader active />
        </div>
      )
    }
    let tableRows = this.state.products.slice(rowsPerPage*(activePage-1), rowsPerPage*activePage).map(p => {
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
          <Table.Cell singleLine>{p.name}</Table.Cell>
          <Table.Cell singleLine>{p.type}</Table.Cell>
          <Table.Cell singleLine>{p.quantity}</Table.Cell>
          <Table.Cell singleLine>{p.scannedQuantity}</Table.Cell>
        </Table.Row>
      )
    })
    return(
      <div>
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
                PO Name
              </Table.HeaderCell>
              <Table.HeaderCell
              >
                PO Type
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'quantity' ? direction : null}
                onClick={this.handleSort('quantity')}
                textAlign="center"
              >
                Quantity
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'scannedQuantity' ? direction : null}
                onClick={this.handleSort('scannedQuantity')}
                textAlign="center"
              >
                Scanned
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {tableRows}
          </Table.Body>

          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan='7'>
                <Button icon labelPosition='left' primary size='small'>
                  <Icon name='user' /> Add User
                </Button>
                <Button size='small'>Approve</Button>
                <Button disabled size='small'>
                  Approve All
                </Button>
                {Math.floor(products.length / rowsPerPage) > 1 && (
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
                )}
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

export default connect(mapStateToProps, {fetchPoProducts})(PoProductTable);
