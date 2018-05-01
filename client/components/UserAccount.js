import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateUser, updateAddress, createUser, createAddress } from '../store';
//import { Input, Button } from 'mdbreact';

class UserForm extends Component {
  constructor(props) {
    super(props);
    const { user, userAddress } = props;
    this.state = {
      id: user.id ? user.id : '',
      firstName: user.id ? user.firstName : '',
      lastName: user.id ? user.lastName : '',
      password: user.id ? user.password : '',
      email: user.id ? user.email : '',
      isPrimary: user.id ? userAddress.isPrimary : '',
      address1: user.id ? userAddress.address1 : '',
      address2: user.id ? userAddress.address2: '',
      city: user.id ? userAddress.city: '',
      state: user.id ? userAddress.state : '',
      zipCode: user.id ? userAddress.zipCode : '',
      phoneNumber: user.id ? userAddress.phoneNumber : '',
      updating: false 
    }
    this.onChange = this.onChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //edit mode automatically?
    const { user, userAddress } = nextProps;
    // if (user.id) {
    //   const { id, firstName, lastName, email, password } = user;
    //   this.setState({ id, firstName, lastName, email, password })
    // }
  }

  onChange(ev) {
    const change = {};
    change[ev.target.name] = ev.target.value;
    this.setState(change);
  }

  onUpdate(ev) {
    ev.preventDefault()
    const { user, updateUser, updateAddress, userAddress, createAddress, createUser } = this.props;
    const newUserInfo = this.state; 
    user.id ? updateUser(newUserInfo) : createUser(newUserInfo);
    user.id ? updateAddress(newUserInfo) : createAddress(newUserInfo);
    this.setState({ updating: false })
  }

  render() {
    const { onChange, onUpdate } = this;
    const { firstName, lastName, email, password, isPrimary, address1, address2, city, state, zipCode, phoneNumber, updating } = this.state;
    const fields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      password: 'Password',
      isPrimary: 'Primary Address',
      address1: 'Street Address',
      address2: 'Apartment Number',
      city: 'City',
      state: 'State',
      zipCode: 'Zip Code',
      phoneNumber: 'Phone Number'
    }
    return (    
      <div>
        <h2>User Account</h2>
        <form>
          {
            Object.keys(fields).map(field => {
              return (
                <div className="" key={field}>
                <label className="font-weight-bold">{fields[field]}</label>
                <input
                name={field}
                readOnly={updating ? false : true}
                className={`form-control${updating ? `` : `-plaintext` }`}
                onChange={onChange}
                value={this.state[field]}
//                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text' }
                />
                </div>
              )
            })
          }
        </form>
          {
            updating ? (
              <button onClick={ onUpdate } className='btn btn-primary'>Save</button>
            ) : (
              <button onClick={() => this.setState({ updating: true })} className='btn btn-primary'>Update Info</button>
            )
          }
      </div>
    )
  }
}

const mapState = ({ user, addresses }) => {
  const userAddress = addresses.find(address => user.id === address.userId && address.isPrimary === true) 
  return { 
    user,
    userAddress
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateUser: (user) => dispatch(updateUser(user)),
    updateAddress: (address) => dispatch(updateAddress(address)),
    createUser: (user) => dispatch(createUser(user)),
    createAddress: (address) => dispatch(createAddress(address))
  }
}

export default connect(mapState, mapDispatch)(UserForm);
