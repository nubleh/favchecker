import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { FlowerNames, Genes, SeedGenes } from './data/genes';
import { FlowerIconPaths } from './data/flowericonpaths';

interface Field {
  [key: number]: {
    [key: number]: Flower | undefined
  }
}

interface Flower {
  species: FlowerNames
  genes: string
}

const cellSize = 50;

function App() {
  const [fieldWidth, setFieldWidth] = useState(10);
  const [fieldHeight, setFieldHeight] = useState(10);

  const [flowerSpecies, setFlowerSpecies] = useState(FlowerNames.rose);
  const [flowerGenes, setFlowerGenes] = useState('11 112 11 00');
  const [field, setField] = useState({} as Field);
  const rows = [];
  for (let x = 0; x < fieldHeight; x++) {
    const row = [];
    for (let y = 0; y < fieldWidth; y++){ 
      row.push(1);
    }
    rows.push(row);
  }

  const flowerOptions = Object.keys(SeedGenes).map(k => Number(k) as FlowerNames);
  const colorOptions: { [key: string]: string } = Object.entries(Genes[flowerSpecies]).reduce((c, n) => {
    if (!c[n[1]]) {
      c[n[1]] = n[0];
    }
    return c;
  }, {} as { [key: string]: string });

  const onClickCell = (rowIndex: number, colIndex: number) => {
    return () => {
      const newField = {...field};
      if (!newField[rowIndex]) {
        newField[rowIndex] = {};
      }
      if (!newField[rowIndex][colIndex]) {
        newField[rowIndex][colIndex] = {
          species: flowerSpecies,
          genes: flowerGenes,
        };
      } else {
        newField[rowIndex][colIndex] = undefined;
      }
      setField(newField);
    };
  };

  const currentColor = resolveFlowerColor({
    species: flowerSpecies,
    genes: flowerGenes,
  });
  return <MainContainer>
    <Tools>
      <FlowerSpeciesChoice>
        {flowerOptions.map(f => {
          return <FlowerSpeciesOption
            key={f}
            onClick={() => {
              setFlowerSpecies(f);
            }}
            active={f === flowerSpecies}
          >
            <FlowerIcon
              flower={{
                species: f,
                genes: '',
              }}
            />
          </FlowerSpeciesOption>;
        })}
      </FlowerSpeciesChoice>
      <FlowerColorChoice>
        {Object.entries(colorOptions).map(colorItem => {
          return <FlowerSpeciesOption
            key={colorItem[0]}
            onClick={() => {
              setFlowerGenes(colorItem[1]);
            }}
            active={colorItem[0] === currentColor}
          >
            <FlowerIcon
              flower={{
                species: flowerSpecies,
                genes: colorItem[1],
              }}
            />
          </FlowerSpeciesOption>;
        })}
      </FlowerColorChoice>
    </Tools>
    <FieldEl style={{
      width: `${cellSize * fieldWidth}px`
    }}>
      {rows.map((row, rowIndex) => {
        return <Row key={rowIndex}>
          {row.map((_, colIndex) => {
            const content = field[rowIndex]?.[colIndex];
            return <Cell
              key={colIndex}
              onClick={onClickCell(rowIndex, colIndex)}
            >
              {content && <FlowerIcon
                flower={content}
              />}
            </Cell>;
          })}
        </Row>;
      })}
    </FieldEl>
  </MainContainer>;
}

interface FlowerIconProps {
  flower: Flower
}

const FlowerIcon = (props: FlowerIconProps) => {
  const path = getFlowerPath(props.flower);
  return <div>
    <FlowerImg src={path}/>
  </div>;
}; 

const getFlowerPath = (flower: Flower) => {
  const set = FlowerIconPaths[flower.species];
  const color = resolveFlowerColor(flower);
  return set[color] || Object.values(set)[0];
};

const resolveFlowerColor = (flower: Flower) => {
  const geneSet = Genes[flower.species];
  const gene =  flower.species === FlowerNames.rose ? flower.genes : flower.genes.slice(-8);
  return geneSet[gene];
};

const MainContainer = styled.div`
  margin: 60px 0;
`;

interface FlowerSpeciesOptionProps {
  active?: boolean
}
const FlowerSpeciesOption = styled.div<FlowerSpeciesOptionProps>`
  cursor: pointer;
  transition: transform 0.1s;
  border-radius: 4px;

  &:hover {
    transform: scale(1.1);
  }
  ${({ active }) => active && css`
    background: rgba(255, 255, 255, 0.3);
  `}
`;

const FlowerSpeciesChoice = styled.div`
  margin-bottom: 12px;
  > div {
    display: inline-block;
    width: 60px;
  }
`;

const FlowerColorChoice = styled.div`
  margin-bottom: 12px;
  > div {
    display: inline-block;
    width: 30px;
  }
`;

const Tools = styled.div`
  text-align: center;
  user-select: none;
`;

const FlowerImg = styled.img`
  width: 100%;
`;

const FieldEl = styled.div`
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  user-select: none;
`;

const Cell = styled.div`
  display: inline-block;
  width: ${cellSize}px;
  height: ${cellSize}px;
  background: url('img/AnimalPatternColor^_D.png');
  background-size: 100% 100%;
  vertical-align: top;
  cursor: pointer;
  transition: transform 0.1s;

  &:hover {
    opacity: 0.95;
  }
`;

const Row = styled.div`
  display: block;
  height: ${cellSize}px;
`;

export default App;
