import React, { Component } from 'react'
import { Button, Modal, Loader } from 'semantic-ui-react'

class LoaderModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.open || false,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.open === false && this.state.open === true) {
      this.toggle();
    }
    if (newProps.open === true && this.state.open === false) {
      this.toggle();
    }
  }
  toggle = () => this.setState({ open: !this.state.open })

  handleClick = () => {
    console.log('please be patient')
  }

  render() {
    const { open } = this.state
    return (
        <Modal
          dimmer="inverted"
          basic
          size="small"
          open={open}
          closeOnDimmerClick={false}
          closeOnDimmerClick={false}
          closeOnDocumentClick={false}
        >
          <Modal.Content>
            <Loader active />
          </Modal.Content>
        </Modal>
    )
  }
}

export default LoaderModal
