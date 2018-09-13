import React, { Component } from 'react';
import { Grid, Form, Button, Input, Icon, Transition, Label, Dropdown, Select } from 'semantic-ui-react';

const options = [
  { key: 'equal', text: '=', value: 'equal' },
  { key: 'gte', text: '>=', value: 'gte' },
  { key: 'gt', text: ' >', value: 'gt' },
  { key: 'lte', text: '<=', value: 'lte' },
  { key: 'lt', text: '<', value: 'lt' },
]

class ProductFilterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        sku: '',
        title: '',
        quantity: '',
        quantityToShip: '',
        price: '',
        weight: '',
        supplier: '',
        brand: '',
      },
      selects: {
        quantity: '',
        quantityToShip: '',
        price: '',
        weight: '',
      },
      showMore: false,
    }
  }

  handleChange = e => {
    this.setState({
      values: {
        [e.target.name]: e.target.value,
      }
    });
  };

  handleShowMore = () => {
    this.setState({
      showMore: !this.state.showMore,
    })
  }

  handleSelect = (e,clicked) => {
    console.log(clicked)
    this.setState({
      selects: {
        [clicked.content]: clicked.value,
      }
    })
  }

  handleSubmit = (e,submission) => {
    // fitler out any empty entries or equal selects
    const selects = Object.entries(this.state.selects).filter(val=>val[1] !== '' && val[1] !== 'equal')
    console.log(selects)
    const query = Object.entries(this.state.values).filter(val=>val[1] !== '').map(val=>{
      //check if we have a select for the query value, if we do add it to the element in the query array
      let select = selects.find(s=>s[0] === val[0])
      if(select) {
        return [...val,select[1]]
      } else {
        return [...val]
      }
    })
    //query = ['searchField','searchValue','less than, greater than, etc']
    this.props.handleFilterSearch(query)
  }

  render() {
    const { sku, title, quantity, quantityToShip, price, weight, brand, supplier, showMore, quantitySelect, quantityToShipSelect, priceSelect, weightSelect } = this.state;
    return(
      <Grid textAlign="center" columns={1} verticalAlign="middle">
        <Grid.Column>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths="equal" className="filter-form">
              <Grid container columns={4} verticalAlign="middle" centered stackable>
                <Grid.Column className="form-col">
                  <Form.Field
                    label="SKU"
                    placeholder="SKU"
                    className='stps-input label-left'
                    control={Input}
                    value={sku}
                    name="sku"
                    onChange={this.handleChange}
                    fluid
                  />
                </Grid.Column>
                <Grid.Column className="form-col">
                  <Form.Field
                    label="Title"
                    placeholder="Title"
                    className='stps-input label-left'
                    control={Input}
                    value={title}
                    name="title"
                    onChange={this.handleChange}
                    fluid
                  />
                </Grid.Column>
                <Grid.Column className="form-col">
                  <Form.Field
                    label="Quantity"
                    placeholder="Quantity"
                    className='stps-input label-left'
                    control={Input}
                    value={quantity}
                    name="quantity"
                    onChange={this.handleChange}
                    fluid
                    type="number"
                    //width={14}
                  >
                    <Select onChange={this.handleSelect} content="quantity" value={quantitySelect} className="small-select" compact options={options} placeholder='=' icon={null} />
                    <input />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column className="form-col">
                  <Form.Field
                    label="To Ship"
                    placeholder="To Ship"
                    className='stps-input label-left'
                    control={Input}
                    value={quantityToShip}
                    type="number"
                    name="quantityToShip"
                    onChange={this.handleChange}
                    fluid
                    type="number"
                    //width={14}
                  >
                    <Select onChange={this.handleSelect} content="quantityToShip" value={quantityToShipSelect} className="small-select" compact options={options} placeholder='=' icon={null} />
                    <input />
                  </Form.Field>
                </Grid.Column>
              </Grid>
              </Form.Group>
              <div className="filter-show-more" onClick={this.handleShowMore}>
              {showMore ?
                  <div>
                    <Label className="segment raised no-pad" basic icon={{name:"angle double up", color:"teal"}} content="Show Less"/>
                  </div>
                  :
                  <div>
                    <Label className="segment raised no-pad" basic icon={{name:"angle double down", color:"teal"}} content="Show More"/>
                  </div>
                }
              </div>
              <Transition visible={showMore} animation='fade' duration={200} unmountOnHide transitionOnMount>
                <Form.Group widths="equal" className="filter-form">
                  <Grid container columns={4} verticalAlign="middle" centered stackable>
                    <Grid.Column className="form-col">
                      <Form.Field
                        label="Brand"
                        placeholder="Brand"
                        className='stps-input label-left'
                        control={Input}
                        value={brand}
                        name="brand"
                        onChange={this.handleChange}
                        fluid
                      />
                    </Grid.Column>
                    <Grid.Column className="form-col">
                      <Form.Field
                        label="Supplier"
                        placeholder="Supplier"
                        className='stps-input label-left'
                        control={Input}
                        value={supplier}
                        name="supplier"
                        onChange={this.handleChange}
                        fluid
                      />
                    </Grid.Column>
                    <Grid.Column className="form-col">
                      <Form.Field
                        label="Price"
                        placeholder="Price"
                        className='stps-input label-left'
                        control={Input}
                        type="number"
                        value={price}
                        name="price"
                        onChange={this.handleChange}
                        fluid
                      >
                        <Select onChange={this.handleSelect} content="price" value={priceSelect} className="small-select" compact options={options} placeholder='=' icon={null} />
                        <input />
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column className="form-col">
                      <Form.Field
                        label="Weight"
                        placeholder="Weight"
                        className='stps-input label-left'
                        control={Input}
                        type="number"
                        value={weight}
                        name="weight"
                        onChange={this.handleChange}
                        fluid
                        type="number"
                      >
                        <Select onChange={this.handleSelect} content="weight" value={weightSelect}  className="small-select" compact options={options} placeholder='=' icon={null} />
                        <input />
                      </Form.Field>
                    </Grid.Column>
                  </Grid>
                </Form.Group>
              </Transition>
            <Form.Group className={!showMore ? 'filter-submit margin-top' : 'filter-submit'}>
              <Button
                content="Search"
                icon="search"
                color="teal"
              />
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

export default ProductFilterForm;
