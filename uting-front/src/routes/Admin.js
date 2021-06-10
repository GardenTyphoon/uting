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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider onClick={(e) => onSider(e)}>
        <div className="App-logo" />
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <span>MC봇 관리</span>
          </Menu.Item>
          <Menu.Item key="2">
            <span>신고 관리</span>
          </Menu.Item>
          <Menu.Item key="3">
            <span>광고 관리</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            {menustate === "MC봇 관리" ? (
              <AdminMc></AdminMc>
            ) : menustate === "신고 관리" ? (
              <AdminBad></AdminBad>
            ) : menustate == "광고 관리" ? (
              <AdminAd></AdminAd>
            ) : (
              "UTING관리자 페이지 입니다."
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>UTING ADMIN</Footer>
      </Layout>
    </Layout>
  );
};

export default Admin;
