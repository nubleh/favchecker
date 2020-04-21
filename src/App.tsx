import React from 'react';

import FieldMaker from './FieldMaker';
import IsabelleMaker from './IsabelleMaker/index';

function App() {
  const hash = window.location.hash;
  return <>
    {hash === '' && <FieldMaker/>}
    {hash === '#isabelle' && <IsabelleMaker/>}
  </>;
}
export default App;
