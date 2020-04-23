import React from 'react';

import FieldMaker from './FieldMaker';
import IsabelleMaker from './IsabelleMaker/index';
import FlowerExplainer from './FlowerExplainer';

function App() {
  const hash = window.location.hash;
  return <>
    {hash === '' && <FieldMaker/>}
    {hash === '#isabelle' && <IsabelleMaker/>}
    {hash === '#explain' && <FlowerExplainer/>}
  </>;
}
export default App;
