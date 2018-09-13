import React, { Component } from 'react';
import { Grid, Form, Button, Input, Icon, Transition, Label, Dropdown } from 'semantic-ui-react';

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

  handleSubmit = (e,submission) => {
    // fitler out any empty entries
    const query = Object.entries(this.state.values).filter(val=>val[1] !== '')
    this.props.handleFilterSearch(query)
  }

  render() {
    const { sku, title, quantity, quantityToShip, price, weight, brand, supplier, showMore } = this.state;
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
                  />
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
                  />
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
                        label="Price"
                        placeholder="Price"
                        className='stps-input label-left'
                        control={Input}
                        type="number"
                        value={price}
                        name="price"
                        onChange={this.handleChange}
                        fluid
                      />
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
                      />
                    </Grid.Column>
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
