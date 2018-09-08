import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Button, Label, Header, Segment, Form, Menu, Message, Icon, Transition } from 'semantic-ui-react';

class PurchaseOrderListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      showActionsMenu: false,
      }
    }
    handlewActionsMenuToggle = () => {
      this.setState({
        showActionsMenu: !this.state.showActionsMenu,
      })
    }
    render() {
      let { showActionsMenu } = this.state;
      let {id, name, createdOn, status, statusColor, statusIcon, type, typeIcon, typeColor } = this.props
      return(
        <Segment key={id} raised className="po-item-container">
          <div className="po-item">
            <div className="po-details">
              <div style={{marginTop: "-5px", marginRight: "5px"}}>
                <Icon name="circle" color={statusColor} />
              </div>
              <div>
                <Header as='h3' className="po-title">
                  {name}
                  <Header.Subheader>Created: {createdOn}</Header.Subheader>
                </Header>
                <Label as="a" className="po-status" icon={{name: statusIcon, color: statusColor}} content={status} />
                <Label as="a" className="po-type" icon={{name: typeIcon, color: typeColor}} content={type} />
              </div>
            </div>
            <div className="po-actions">
              <Transition visible={showActionsMenu} animation='drop' duration={200}>
                <div>
                  <div className="actions-menu">
                    <Segment raised>
                      <Menu compact borderless secondary>
                          <Menu.Item as='a'><Icon color="teal" name="search plus" /> Scan PO</Menu.Item>
                          <Menu.Item as='a'><Icon color="green" name="check" /> Mark Complete</Menu.Item>
                          <Menu.Item as='a'><Icon color="red" name="trash" />  Delete PO</Menu.Item>
                      </Menu>
                    </Segment>
                  </div>
                </div>
              </Transition>
              {showActionsMenu ?
                <Icon
                  className="actions-menu-icon"
                  onClick={this.handlewActionsMenuToggle}
                  color="grey"
                  name='close'
                />
                :
                <Icon
                  className="actions-menu-icon"
                  onClick={this.handlewActionsMenuToggle}
                  color="grey"
                  name='ellipsis vertical'
                />
              }
            </div>
          </div>
        </Segment>
      )
    }
  }

function mapStateToProps(state) {
 return {
   currentUser: state.currentUser,
   errors: state.errors,
 };
}

export default connect(mapStateToProps, {})(PurchaseOrderListItem);
