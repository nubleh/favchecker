import React from 'react';

import FieldMaker from './FieldMaker';

function App() {
  const hash = window.location.hash;
  return <>
    {hash === '' && <FieldMaker/>}
  </>;
}
export default App;
