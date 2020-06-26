import React from 'react';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem, FormControl, FormGroup } from 'react-bootstrap'

import api_data from "../api/data";

class AppNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: 1,
    }

    this.handlePhazeChange = this.handlePhazeChange.bind(this);
    this.handleOpenDataUploadModal = this.handleOpenDataUploadModal.bind(this);
    this.handleLoadData = this.handleLoadData.bind(this);
  }

  handlePhazeChange(selectedKey) {
    this.setState({
      activeKey: selectedKey
    });

    switch(selectedKey) {
      case 1:
        this.props.handleChangeTab("code");
        break;
      case 2:
        this.props.handleChangeTab("analyze");
        break;
      case 3:
        this.props.handleChangeTab("design");
        break;
    }
  }

  handleLoadData(k) {
    var data = {
      filename: k,
    }
    api_data.load_csv(data, (res) => {
      this.props.handleLoadDataset(k, res.data);
    });
  }

  handleOpenDataUploadModal() {
    const uploadform = (
      <form id="upload-form" encType="multipart/form-data">
        <FormGroup>
          <label>データファイル</label>
          <input type="file" name="file" />
        </FormGroup>
        <FormGroup>
          <label>コメント</label>
          <input type="text" name="remark" />
        </FormGroup>
        <input type="hidden" name="codeid" value={CODE_ID} />
      </form>
    );

    this.props.modalShow('データアップローダー', uploadform);
  }

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Plotshop</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav activeKey={this.state.activeKey} onSelect={this.handlePhazeChange}>
            <NavItem eventKey={1} href="#">
              Coder
            </NavItem>
            <NavItem eventKey={2} href="#">
              Analyzer
            </NavItem>
            <NavItem eventKey={3} href="#">
              Designer
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="/svc/">
              ユーザーページ
            </NavItem>
            <NavItem eventKey={2} onClick={this.handleOpenDataUploadModal}>
              データ追加
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AppNavbar;
