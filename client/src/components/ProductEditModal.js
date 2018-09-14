import React, { Component } from 'react'
import { Button, Header, Icon, Image, Modal, Form, Input, TextArea, Message } from 'semantic-ui-react'

class ProductEditModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: true,
      messageList: [],
      messageHeader: '',
      messageType: '',
      skuError: false,
      product: {
        ...this.props.product,
      },
      values: {
        sku: '',
        title: '',
        quantity: '',
        price: '',
        barcode: '',
        brand: '',
        supplier: '',
        weight: '',
      },
    }
  }

  resetValues = () => {
    this.setState({
      values: {
        ...this.props.product,
      }
    })
  }

  componentDidMount() {
    this.resetValues();
  }

  handleChange = e => {
    this.setState({
      values: {
        [e.target.name]: e.target.value,
      }
    });
  };

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
    this.props.handleToggle(null,{value: 'showEditProductModal'})
  }

  clearErrors = () => {
    this.setState({
      messageType: '',
      messageList: [],
      messageHeader: '',
      skuError: false,
    })
  }

  handleSubmit = (e,submission) => {
    this.clearErrors();
    if (this.state.values.sku === '') {
      this.setState({
        messageType: 'error',
        skuError: true,
        messageList: ['SKU cannot be blank'],
      })
      return
    }
    // fitler out any empty entries or values that are the same
    const values = Object.entries(this.state.values).filter(val=>val[1] !== '' && val[1] !== this.props.product[val[0]])
    if (values.length === 0) {
      this.setState({
        messageType: 'error',
        messageList: ['Please make an update and try again'],
      })
      return
    }
    let update = {
      id: this.props.product._id,
    }
    for (let val of values) {
      update = {
        ...update,
        [val[0]]: val[1],
      }
    }
    console.log(update)
    this.props.handleProductUpdate([update])
    .then(res=>{
      this.setState({
        messageList: ['Product Updated'],
        messageType: 'success',
        product: {
          ...this.props.product,
          ...update,
        },
      })
    })
    .catch(e=>{
      this.setState({
        messageHeader: 'Something went wrong',
        messageList: e.error.message,
        messageType: 'error',
      })
    })
  }

  render() {
    const { sku, title, quantity, price, barcode, brand, supplier, weight } = this.state.values;
    return (
      <Modal
        open={this.state.isOpen}
        onClose={this.toggleModal}
        closeOnDimmerClick={false}
      >
        <Modal.Header>Edit Product</Modal.Header>
        <Modal.Content image scrolling>
          <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />
          <Modal.Description>
            {this.state.messageList.length > 0 && (
              <Message
                error={this.state.messageType === 'error'}
                warning={this.state.messageType === 'warning'}
                success={this.state.messageType === 'success'}
                header={this.state.messageHeader || null}
                list={this.state.messageList}
              />
            )}
            <Header>{this.state.product.sku}</Header>
            <p>{this.state.product.title}</p>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Input error={this.state.skuError} label='SKU' placeholder="SKU" name="sku" value={sku} onChange={this.handleChange} width={4} />
                <Form.Input label='Barcode' placeholder='Barcode' onChange={this.handleChange} name="barcode" value={barcode} width={4} />
                <Form.Input label='Quantity' placeholder='Quantity' type="number" onChange={this.handleChange} name="quantity" value={quantity} width={4} />
                <Form.Input label='Price' placeholder='Price' type="number" onChange={this.handleChange} name="price" value={price} width={4} />
              </Form.Group>
              <Form.Group>
                <Form.Input label='Title' placeholder='Title' onChange={this.handleChange} name="title" value={title} width={16} />
              </Form.Group>
              <Form.Group>
                <Form.Input label='Brand' placeholder='Brand' onChange={this.handleChange} name="brand" value={brand} width={6} />
                <Form.Input label='Supplier' placeholder='Supplier' onChange={this.handleChange} name="supplier" value={supplier} width={6} />
                <Form.Input label='Weight' placeholder='Weight' type="number" onChange={this.handleChange} name="weight" value={weight} width={4} />
              </Form.Group>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.toggleModal} negative icon="cancel" content="Cancel" />
          <Button onClick={this.handleSubmit} positive icon="save" content="Save" />
        </Modal.Actions>
      </Modal>
    )
  }

}

export default ProductEditModal
