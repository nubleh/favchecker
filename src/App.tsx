import React from 'react';

import FieldMaker from './FieldMaker';
import IsabelleMaker from './IsabelleMaker/index';
import FlowerExplainer from './FlowerExplainer';
import FlowerCrosser from './FlowerCrosser';
import FavChecker from './FavChecker';

function App() {
  const hash = window.location.hash;
  return <>
    {hash === '' && <FieldMaker/>}
    {hash === '#isabelle' && <IsabelleMaker/>}
    {hash === '#explain' && <FlowerExplainer/>}
    {hash === '#crosser' && <FlowerCrosser/>}
    {hash === '#favchecker' && <FavChecker/>}
  </>;
}
export default App;
