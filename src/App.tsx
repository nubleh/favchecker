import React, { useState } from 'react';
import styled from 'styled-components';

import { FlowerNames, Genes } from './data/genes';

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
  const [flowerGenes, setFlowerGenes] = useState('00 00 00 00');
  const [field, setField] = useState({} as Field);
  const rows = [];
  for (let x = 0; x < fieldHeight; x++) {
    const row = [];
    for (let y = 0; y < fieldWidth; y++){ 
      row.push(1);
    }
    rows.push(row);
  }

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
  return <div>
    <div>
      tools
    </div>
    <FieldEl style={{
      width: `${cellSize * fieldWidth}px`
    }}>
      {rows.map((row, rowIndex) => {
        return <Row>
          {row.map((col, colIndex) => {
            const content = field[rowIndex]?.[colIndex];
            return <Cell
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
  </div>;
}

const FlowerIconPaths: { [key: number]: { [key: string]: string }} = {
  [FlowerNames.rose]: {
    white: 'img/Rose1.png',
  },
};

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
  return set[color];
};

const resolveFlowerColor = (flower: Flower) => {
  return 'white';
};

const FlowerImg = styled.img`
  width: 100%;
`;

const FieldEl = styled.div`
  margin: 0 auto;
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
