import React from 'react';
import PropTypes from 'prop-types';
import {Button, FormControl} from 'react-bootstrap';
import config from '../../config';

import account from '../../api/account';

class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    }

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  handleUsername(event) {
    this.setState({username: event.target.value});
  }

  handlePassword(event) {
    this.setState({password: event.target.value});
  }

  handleSend(event) {
    account.login(this.state.username, this.state.password, () => {this.props.setLogin()});
  }

  render() {
    return (
      <div>
        Username:
        <FormControl
          type="text"
          value={this.state.username}
          placeholder="username"
          onChange={this.handleUsername}
        />
        Password:
        <FormControl
					type="password"
					value={this.state.password}
					placeholder="password"
					onChange={this.handlePassword}
				/>
        <Button onClick={this.handleSend} >Send</Button>
      </div>
    );
  }
}

LoginPanel.propTypes= {
  setLogin: PropTypes.func.isRequired,
  navmeta: PropTypes.string.isRequired,
}

export default LoginPanel;
