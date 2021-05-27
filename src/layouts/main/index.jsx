import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Navbar from './navbar';
import Sidebar from './sidebar';

const { Content } = Layout;

const MainLayout = ({ children, setNNWeights, setResults }) => {
  return (
    <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      <Navbar />
      <Layout>
        <Sidebar setNNWeights={setNNWeights} setResults={setResults} />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
