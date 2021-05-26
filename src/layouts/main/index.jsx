import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Navbar from './navbar';
import Sidebar from './sidebar';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      <Navbar />
      <Layout>
        <Sidebar />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
