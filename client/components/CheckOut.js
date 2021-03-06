import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import store, { updateOrder, setLineItem, setOrder, updateProduct } from '../store';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class CheckOut extends Component {
  constructor({ order, id, updateOrder, thisUserlineItems, thisUserProducts, updateProduct }) {
    super();
    this.state = {
      fullName: '',
      address: '',
      creditCardNumber: ''
    };

    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onSave(ev) {
    ev.preventDefault();
    const { fullName, address, creditCardNumber } = this.state;
  }

  onChange(ev) {
    const change = {};
    change[ev.target.name] = ev.target.value;
    this.setState(change);
  }

  onClick() {
    this.props.updateOrder(this.props.order.id, { fullName: this.state.fullName, address: this.state.address, creditCardNumber: this.state.creditCardNumber });
    this.props.thisUserlineItems.map((thisUserlineItem)=>this.props.setLineItem(thisUserlineItem.id, { active: false, orderId: this.props.order.id }));
    this.props.setOrder(this.props.order.id, { active: false });
    this.props.thisUserProducts.map((thisUserProduct)=>{
      const lineItemOfThisProduct = this.props.thisUserlineItems.find(thisUserlineItem => thisUserlineItem.productId === thisUserProduct.id) 
      this.props.updateProduct(thisUserProduct.id, {inventory: thisUserProduct.inventory-lineItemOfThisProduct.quantity})
    }) 
  }

  render() {
    const { onSave, onChange } = this;
    const { fullName, address, creditCardNumber } = this.state;
    return (
      <div>
        <h2>Order Summary</h2>
        {this.props.order &&
        <div>
          <p>Price: {this.props.order.price} dollar</p>
          <p>Description: {this.props.order.description}</p>
        </div>}
        <h3>We need more information to complete the order:</h3>
        <form onSubmit={ onSave }>
        <TextField
            name="fullName"
            floatingLabelText="Full Name"
            value={ fullName }
            onChange={ onChange }
            floatingLabelFixed={true}
            // errorText={this.state.fullNameError}
          />
          <br />
          <TextField
            name="address"
            floatingLabelText="Address"
            value={ address }
            onChange={ onChange }
            floatingLabelFixed={true}
            // errorText={this.state.addressError}
          />
          <br />
          <TextField
            name="creditCardNumber"
            floatingLabelText="Credit Card Number"
            value={ creditCardNumber }
            onChange={ onChange }
            floatingLabelFixed={true}
            // errorText={this.state.creditCardNumberError}
          />
          <br />
          <br />
          <br />
          <Link to="/complete"><RaisedButton label="Complete Order" onClick={ this.onClick } primary/></Link>
        </form>

      </div>
    );
  }
}


const mapStateToProps = ({ orders, lineItems, products }, { id }) => {
  const thisUserlineItemsAll = lineItems.filter(lineItem => lineItem.active === true)
  const thisUserlineItems = thisUserlineItemsAll.filter(lineItem => lineItem.userId === id);
  const idArr = thisUserlineItems.map(thisUserlineItems => thisUserlineItems.productId);
  const thisUserProducts = products.filter(product => idArr.includes(product.id));
  const thisUserOrders = orders.filter(order => order.active === true);
  const order = thisUserOrders.find(thisUserOrder => thisUserOrder.userId === id);
  return {
    order,
    id,
    thisUserlineItems,
    thisUserProducts
  };
}

const mapDispatchToProps = (dispatch, { history }) => {
  return {
    updateOrder: (id, order) => dispatch(updateOrder(id, order, history)),
    setLineItem: (id, lineItem) => dispatch(setLineItem(id, lineItem, history)),
    setOrder: (id, order) => dispatch(setOrder(id, order, history)),
    updateProduct: (id, product) => dispatch(updateProduct(id, product, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);
