// src/components/App.jsx

import React from 'react';
import TopBar from 'components/TopBar.jsx'

export default function App(props) {
  return (
    <div id="app">
      <TopBar />
      <div id="app-main">
        {props.children}
      </div>
    </div>
  );
}
App.propTypes = {
  children: React.PropTypes.element.isRequired,
};
