import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

class ConfirmModal extends Component {
  state = { open: true }

  handleClose = () => {
    this.setState({
      open: false,
    })
  }

  handleConfirm = () => {
    this.props.onConfirm(this.props.items, this.props.type)
    this.handleClose();
  }
  handleCancel = () => {
    this.props.onCancel(null,{value: 'showConfirmModal'});
    this.handleClose();
  }

  render() {
    let { items, type, header } = this.props
    const end = items.length > 1 ? 'items?' : 'item?'
    return (
      <div>
        <Modal
          size="tiny"
          open={this.state.open}
          header={header}
          content={`${type} ${items.length} ${end}`}
          actions={[
            { key: 'cancel', content: 'No', negative: true, icon: 'cancel', onClick: this.handleCancel},
            { key: 'yes', content: 'Yes', positive: true, icon: 'check', onClick: this.handleConfirm},
          ]}
        />
      </div>
    )
  }
}

export default ConfirmModal
