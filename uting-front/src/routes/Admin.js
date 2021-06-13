import React, { useEffect, useState, Component } from "react";
import { Route, Link, Switch, Router } from "react-router-dom";
import styled from "styled-components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  FormText,
  Badge,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Layout, Menu, Breadcrumb, Select } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import AdminBad from "../components/admin/AdminBad";
import AdminMc from "../components/admin/AdminMc";
import AdminAd from "../components/admin/AdminAd";
import MenuItem from "antd/lib/menu/MenuItem";

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

const Admin = () => {
  const [menustate, setMenustate] = useState("");
  const onSider = (e) => {
    setMenustate(e.target.innerText);
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}></Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Admin</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            display: "grid",
            width: "100%",
            height: "100%",
            gridTemplateColumns: "0.5fr 1fr 1fr",
          }}
        >
          <AdminMc></AdminMc>
          <AdminBad></AdminBad>
          <AdminAd></AdminAd>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>UTING ADMIN</Footer>
    </Layout>
  );
};

export default Admin;
