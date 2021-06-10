import React,{useEffect, useState,Component} from "react";
import { Route, Link,Switch,Router } from 'react-router-dom';
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge,Container,Row,Col} from 'reactstrap';
import axios from 'axios';
import { Layout, Menu, Breadcrumb, Select } from 'antd';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import AdminBad from '../components/admin/AdminBad';
import AdminMc from '../components/admin/AdminMc';
import AdminAd from '../components/admin/AdminAd';
import MenuItem from "antd/lib/menu/MenuItem";
const WhiteSpace = styled.div`
  margin: 10px;
`;
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;


const Admin = () => {
  const [menustate,setMenustate]=useState(false)
  // state = {
  //   collapsed: false,
  // };

  const onCollapse = (menustate) => {
    console.log("eee");
    setMenustate(menustate);
  }


    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          menustate={menustate}
          onCollapse={(e)=>onCollapse(menustate)}
        >
          <div className="App-logo" />
          <Menu  theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" onSelect={console.log("1")}>
              <span >Option 1</span>
            </Menu.Item>
            <Menu.Item key="2" onSelect={console.log("2")} >
              <span >Option 2</span>
            </Menu.Item>
            <Menu.Item key="3" onSelect={console.log("3")}  >
              <span >Option 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            UTING ADMIN
          </Footer>
        </Layout>
      </Layout>
    );
  
}

export default Admin;
