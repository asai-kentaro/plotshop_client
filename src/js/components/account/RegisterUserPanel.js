import React from 'react';
import PropTypes from 'prop-types';
import {Button, FormControl} from 'react-bootstrap';
import request from 'superagent';
import config from '../../config';

import account from '../../api/account';

class RegisterUserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
      password2: '',
      role: 'user',
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handlePassword2Change(event) {
    this.setState({password2: event.target.value});
  }

  handleRoleChange(event) {
    this.setState({role: event.target.value});
  }

  handleSubmit(event) {
    if(this.state.password == this.state.password2) {
      account.register(this.state.name, this.state.password, this.state.role, () => {this.props.switchPanel('content_list')});
    }
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input className="form-control" type="text" value={this.state.name} onChange={this.handleNameChange} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input className="form-control" type="password" value={this.state.password} onChange={this.handlePasswordChange} />
        </div>
        <div className="form-group">
          <label>Password(Confirm):</label>
          <input className="form-control" type="password" value={this.state.password2} onChange={this.handlePassword2Change} />
        </div>
        <div className="form-group">
          <select className="form-control" value={this.state.role} onChange={this.handleRoleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        <input className="form-control" type="submit" value="Submit" />
      </form>
    );
  }
}

RegisterUserPanel.propTypes= {
  switchPanel: PropTypes.func.isRequired,
  navmeta: PropTypes.string.isRequired,
}

export default RegisterUserPanel;
