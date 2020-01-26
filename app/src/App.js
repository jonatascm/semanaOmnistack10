import React from 'react';
import Routes from './routes';
import { StatusBar } from 'react-native';

// import { Container } from './styles';

export default function src() {
  return (
    <>
      <StatusBar  barStyle="light-content" backgroundColor="#7d40e7" />
      <Routes />
    </>
  );
}
