import React, { useState, useRef, useEffect } from 'react';
import { FlowerNames } from '../data/genes';
import FlowerSequencer, { GeneAllele, GenePair } from './FlowerSequencer';
import styled, { css } from 'styled-components';
import { resolveFlowerColor } from '../FieldMaker';

export const speciesNames = {
  [FlowerNames.rose]: 'rose',
  [FlowerNames.hyacinth]: 'hyacinth',
  [FlowerNames.tulip]: 'tulip',
  [FlowerNames.mum]: 'mum',
  [FlowerNames.windflower]: 'windflower',
  [FlowerNames.pansy]: 'pansy',
  [FlowerNames.cosmos]: 'cosmos',
  [FlowerNames.lily]: 'lily',
};
const FlowerExplainer = () => {
  const [genes, setGenes] = useState('11 11 11 00');
  const [species, setSpecies] = useState(FlowerNames.rose);

  const [atSlide, setAtSlide] = useState(0);

  const randGenesIntervalRef = useRef(0);
  const randSpeciesIntervalRef = useRef(0);
  useEffect(() => {
    if (atSlide < 10 || atSlide > 100) {
      return;
    }
    randGenesIntervalRef.current = setInterval(() => {
      setGenes(getRandomGenes());
    }, 1000);
    return () => {
      clearInterval(randGenesIntervalRef.current);
    };
  }, [atSlide]);
  useEffect(() => {
    if (atSlide < 16 || atSlide > 100) {
      return;
    }
    randSpeciesIntervalRef.current = setInterval(() => {
      setSpecies(getRandomSpecies());
    }, 5000);
    return () => {
      clearInterval(randSpeciesIntervalRef.current);
    };
  }, [atSlide]);

  return <MainContainer>
    {atSlide < 5 && <>
      <Slide active={atSlide >= 1}>
        <h1>
          Every flower has genes, represented by 3 or 4 pairs of bits
        </h1>
      </Slide>
      <Slide active={atSlide >= 2}>
        <h1>
          Each pair can be 00, 01, or 11.
        </h1>
      </Slide>
      <Slide active={atSlide >= 2}>
        <h1>
          <span>It looks like this:</span>
          {atSlide === 2 && <span style={{ fontFamily: 'monospace' }}>
            00 01 11 00
          </span>}
          {atSlide === 3 && <span style={{ fontFamily: 'monospace' }}>
            01 00 00 00
          </span>}
          {atSlide === 4 && <span style={{ fontFamily: 'monospace' }}>
            11 11 01 00
          </span>}
        </h1>
      </Slide>
    </>}
    <Slide active={atSlide >= 5}>
      <h1>
        Let's put that into practice.
      </h1>
    </Slide>
    <Slide active={atSlide >= 6}>
      <FlowerSequencer
        species={species}
        genes={genes}
      />
    </Slide>
    {atSlide < 9 && <Slide active={atSlide >=7}>
      <h1>
        For every flower species, the game has a preset color assigned to every possible gene combination.
      </h1>
    </Slide>}
    {atSlide < 9 && <Slide active={atSlide >=8}>
      <h1>
        A rose with 11 11 11 00 is blue.
      </h1><h1>
        In fact, of all the 81 gene combinations (3 ^ 3 ^ 3 ^ 3) a rose can be, only 11 11 11 00 is blue.
      </h1><h1>
        That's what makes blue roses so troublesome to breed.
      </h1>
    </Slide>}
    {atSlide < 13 && <>
      <Slide active={atSlide >=9}>
        <h1>
          Let's see what colors the rose becomes if it had other combinations of genes.
        </h1>
      </Slide>
      <Slide active={atSlide >=11}>
        <h1>
          There are 81 combinations of genes for roses, but only 8 colors.
        </h1>
      </Slide>
      <Slide active={atSlide >=12}>
        <h1>
          Because of this, there are many gene combinations that are assigned to the same color.
        </h1>
      </Slide>
    </>}
    {atSlide < 16 && <>
      <Slide active={atSlide >=13}>
        <h1>
          If we have {getFlowerColorAndName(species, genes)} plant in the game, how do we find out its actual genes?
        </h1>
      </Slide>
      <Slide active={atSlide >= 14}>
        <h1>
          We can't.
        </h1>
      </Slide>
      <Slide active={atSlide >= 15}>
        <h1>
          That's why it's important to keep track of where you got your flowers from, and which parent flowers it was bred from.
        </h1>
      </Slide>
    </>}
    <Slide active={atSlide >=16}>
      <h1>
        Let's take a look at what other flower species look like.
      </h1>
    </Slide>
    <Slide active={atSlide >=17}>
      <h1>
        Here's {getFlowerColorAndName(species, genes)}.
      </h1>
    </Slide>

    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      padding: 20,
      background: '#555',
    }}>
      {atSlide}
      <span onClick={() => {setAtSlide(atSlide + 1)}}>
        Next
      </span>
      <span onClick={() => {setAtSlide(atSlide - 1)}}>
        Prev
      </span>
    </div>    
  </MainContainer>;
};

const MainContainer = styled.div`
  width: 600px;
  margin: 30px auto;
  font-family: ACNHFont;
  h1 {
    line-height: 1.2em;
    > span {
      vertical-align: middle;
      margin-right: 20px;
    }
  }
`;

interface SlideProps {
  active?: boolean
}
const Slide = styled.div<SlideProps>`
  transition: opacity 1s;
  opacity: 0;
  ${({ active }) => active && css`
    opacity: 1;
  `}
`;

const getFlowerColorAndName = (species: FlowerNames, genes: string) => {
  const color = resolveFlowerColor({ species, genes});
  const speciesName = speciesNames[species];
  if ('aeiou'.split('').indexOf(color[0]) !== -1) {
    return `an ${color} ${speciesName}`;
  }
  return `a ${color} ${speciesName}`;
};
const getRandomSpecies = () => {
  return [
    FlowerNames.rose,
    FlowerNames.hyacinth,
    FlowerNames.tulip,
    FlowerNames.windflower,
    FlowerNames.cosmos,
    FlowerNames.pansy,
    FlowerNames.mum,
    FlowerNames.lily,
  ][Math.floor(Math.random() * 8)];
};
const getRandomGenes = () => {
  return [1, 1, 1, 1].map(p => {
    const roll = Math.random();
    if (roll > 0.667) {
      return '00';
    }
    if (roll > 0.333) {
      return '01';
    }
    return '11';
  }).join(' ');
};

export default FlowerExplainer;
