import React, { Component } from 'react';
import { Grid, Form, Button, Input } from 'semantic-ui-react';

const selectOptions = {
  type: [
    {
      key: 'all',
      text: 'All',
      value: 'all'
    },
    {
      key: 'inbound',
      text: 'Inbound',
      value: 'inbound'
    },
    {
      key: 'outbound',
      text: 'Outbound',
      value: 'outbound'
    },
  ],
  status: [
    {
      key: 'all',
      text: 'All',
      value: 'all'
    },
    {
      key: 'complete',
      text: 'Complete',
      value: 'complete'
    },
    {
      key: 'processing',
      text: 'Processing',
      value: 'processing'
    },
  ],
}

class PurchaseOrderFilterForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sku: '',
      name: '',
      dateStart: '',
      dateEnd: '',
      status: '',
      type: '',
    }
  }

  handleSelect = (e,clicked) => {
    this.setState({
      [clicked.content]: clicked.value,
    })
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = (e,submission) => {
    // fitler out any empty entries, dates, or anything with all for select boxes. toLowerCase everything
    const query = Object.entries(this.state).filter(val=>val[1] !== '' && !val[0].startsWith('date') && val[1] !== 'all').map(val=>([val[0],val[1].toLowerCase()]))
    const dates = Object.entries(this.state).filter(val=>val[1] !== '' && val[0].startsWith('date'))
    this.props.handleFilterSearch(query,dates)
  }

  render() {
    const { sku, name, dateStart, dateEnd, status, type } = this.state;
    return(
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths="equal" className="po-filter-form">
              <Grid container columns={7} verticalAlign="middle" centered stackable>
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
                    label="PO Name"
                    placeholder="PO Name"
                    className='stps-input label-left'
                    control={Input}
                    value={name}
                    name="name"
                    onChange={this.handleChange}
                    fluid
                  />
                </Grid.Column>
                <Grid.Column className="form-col">
                  <Form.Select
                    value={status}
                    content="status"
                    onChange={this.handleSelect}
                    label="PO Status"
                    placeholder="PO Status"
                    className="stps-select compact label-left"
                    options={selectOptions.status}
                    fluid
                  />
                </Grid.Column>
                <Grid.Column className="form-col">
                  <Form.Select
                    value={type}
                    content="type"
                    onChange={this.handleSelect}
                    label="PO Type"
                    placeholder="PO Type"
                    className="stps-select compact label-left"
                    options={selectOptions.type}
                    fluid
                  />
                </Grid.Column>
                <Grid.Column className="form-col">
                  <Form.Field
                    label="Date Created From"
                    placeholder='Date Created label-left'
                    control={Input}
                    className='stps-input label-left'
                    type="date"
                    content="dateStart"
                    value={dateStart}
                    onChange={this.handleSelect}
                    fluid
                  />
                </Grid.Column>
                <Grid.Column className="form-col">
                  <Form.Field
                    label="to"
                    placeholder='Date Created label-left'
                    control={Input}
                    className='stps-input label-left'
                    type="date"
                    content="dateEnd"
                    value={dateEnd}
                    onChange={this.handleSelect}
                    fluid
                  />
                </Grid.Column>
              </Grid>
            </Form.Group>
            <Form.Group className="filter-submit">
              <Button
                content="Search"
                icon="search"
              />
            </Form.Group>
          </Form>
    )
  }
}

export default PurchaseOrderFilterForm;
