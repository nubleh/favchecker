import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { FlowerNames, Genes, SeedGenes } from './data/genes';
import { FlowerIconPaths } from './data/flowericonpaths';

import SuzuranImage from './img/Suzuran.png';
import SuzuranWhiteImage from './img/Suzuran_w.png';
import ClothIcon from './img/Icon_GeneralCloth_00^t.png';
import TrashIcon from './img/ProfileReplaceIcon^t.png';
import RoadTexture from './img/RoadTexC^_A.png';
import GrassTexture from './img/AnimalPatternColor^_D.png';
import CliffIcon from './img/RoadCreationIconCriff^w.png';

interface Field {
  [key: number]: {
    [key: number]: Flower | undefined
  }
}
interface BlockField {
  [key: number]: {
    [key: number]: Blockers
  }
}
interface ElevationField {
  [key: number]: {
    [key: number]: number
  }
}

enum Blockers {
  PAVEMENT,
  LILYOFTHEVALLEY,
}
interface Flower {
  species: FlowerNames
  genes: string
}

const cellSize = 50;

const FieldMaker = () => {
  const [fieldWidth, setFieldWidth] = useState(10);
  const [fieldHeight, setFieldHeight] = useState(10);

  const [isBlocking, setIsBlocking] = useState(undefined as Blockers | undefined);
  const [flowerSpecies, setFlowerSpecies] = useState(FlowerNames.rose);
  const [flowerGenes, setFlowerGenes] = useState('11 112 11 00');
  const [field, setField] = useState({} as Field);
  const [blockField, setBlockField] = useState({} as BlockField);
  const [viewPerspective, setViewPerspective] = useState(false);
  const rows = [];

  const [hoverCol, setHoverCol] = useState(0);
  const [hoverRow, setHoverRow] = useState(0);
  const [elevation, setElevation] = useState({} as ElevationField);

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
      if (isBlocking !== undefined) {
        const newBlockField = {...blockField};
        if (!newBlockField[rowIndex]) {
          newBlockField[rowIndex] = {};
        }
        if (newBlockField[rowIndex][colIndex] !== isBlocking) {
          newBlockField[rowIndex][colIndex] = isBlocking;
        } else {
          delete newBlockField[rowIndex][colIndex];
        }
        setBlockField(newBlockField);
      } else {
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
      }
    };
  };

  const currentColor = resolveFlowerColor({
    species: flowerSpecies,
    genes: flowerGenes,
  });

  const fieldElKeypressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 113 q, 119 w
    if (e.which === 113) {
      const newElevation = { ...elevation };
      if (!newElevation[hoverRow]) {
        newElevation[hoverRow] = {};
      }
      const newLevel = Math.min(2, (newElevation[hoverRow][hoverCol] || 0) + 1);
      newElevation[hoverRow][hoverCol] = newLevel;
      setElevation(newElevation);
    }
    if (e.which === 119) {
      const newElevation = { ...elevation };
      if (!newElevation[hoverRow]) {
        newElevation[hoverRow] = {};
      }
      newElevation[hoverRow][hoverCol] = Math.max(0, (newElevation[hoverRow][hoverCol] || 0) - 1);
      setElevation(newElevation);
    }
  };

  return <MainContainer
    onKeyPress={fieldElKeypressHandler}
    tabIndex={1}
  >
    <Tools>
      <img
        alt={'Set lily of the valley'}
        title={'Set lily of the valley'}
        style={{
          width: 48,
          background: isBlocking === Blockers.LILYOFTHEVALLEY ? 'rgba(255, 255, 255, 0.5)' : '',
        }}
        src={SuzuranWhiteImage}
        onClick={() => {
          setIsBlocking(isBlocking === Blockers.LILYOFTHEVALLEY ? undefined : Blockers.LILYOFTHEVALLEY);
        }}
      />
      <img
        alt={'Set pavement'}
        title={'Set pavement'}
        style={{
          width: 48,
          background: isBlocking === Blockers.PAVEMENT ? 'rgba(255, 255, 255, 0.5)' : '',
        }}
        src={ClothIcon}
        onClick={() => {
          setIsBlocking(isBlocking === Blockers.PAVEMENT ? undefined : Blockers.PAVEMENT);
        }}
      />
      <img
        alt={'Clear field'}
        title={'Clear field'}
        style={{ width: 48 }}
        src={TrashIcon}
        onClick={() => {
          setField({});
          setBlockField({});
        }}
      />
      <MinusPlusButton
        title={'Shrink field'}
        onClick={() => {
          setFieldWidth(Math.max(3, fieldWidth - 1));
          setFieldHeight(Math.max(3, fieldHeight - 1));
        }}
      />
      <PlusButton
        title={'Enlarge field'}
        onClick={() => {
          setFieldWidth(Math.min(99, fieldWidth + 1));
          setFieldHeight(Math.min(99, fieldHeight + 1));
        }}
      />
      <img
        alt={'Elevation: Hover and press Q and W'}
        title={'Elevation: Hover and press Q and W'}
        style={{
          width: 48,
          background: viewPerspective ? 'rgba(255, 255, 255, 0.5)' : '',
        }}
        src={CliffIcon}
        onClick={() => {
          setViewPerspective(!viewPerspective);
        }}
      />
    </Tools>
    <Tools>
      <FlowerSpeciesChoice>
        {flowerOptions.map(f => {
          return <FlowerSpeciesOption
            key={f}
            onClick={() => {
              setFlowerSpecies(f);
              setIsBlocking(undefined);
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
            key={`${flowerSpecies}${colorItem[0]}`}
            onClick={() => {
              setFlowerGenes(colorItem[1]);
              setIsBlocking(undefined);
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
    <FieldEl
      style={{
        width: `${cellSize * fieldWidth}px`,
      }}
      isViewPerspective={viewPerspective}
    >
      {rows.map((row, rowIndex) => {
        return <Row key={rowIndex}>
          {row.map((_, colIndex) => {
            const content = field[rowIndex]?.[colIndex];
            const blockerType = blockField[rowIndex]?.[colIndex];
            return <Cell
              key={colIndex}
              onClick={onClickCell(rowIndex, colIndex)}
              onMouseOver={() => {
                setHoverCol(colIndex);
                setHoverRow(rowIndex);
              }}
              style={{
                transform: `translateZ(${25 * (elevation[rowIndex]?.[colIndex] || 0)}px)`
              }}
              elevation={elevation[rowIndex]?.[colIndex] || 0}
            >
              {!blockerType && content && <FlowerIcon
                flower={content}
              />}
              {blockerType === Blockers.PAVEMENT && <BlockImage
                src={RoadTexture}
              />}
              {blockerType === Blockers.LILYOFTHEVALLEY && <BlockImage
                src={SuzuranImage}
              />}
            </Cell>;
          })}
        </Row>;
      })}
    </FieldEl>
  </MainContainer>;
};

interface FlowerIconProps {
  flower: Flower
}

export const FlowerIcon = (props: FlowerIconProps) => {
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

export const resolveFlowerColor = (flower: Flower) => {
  const geneSet = Genes[flower.species];
  const gene =  flower.species === FlowerNames.rose ? flower.genes : flower.genes.slice(-8);
  return geneSet[gene];
};

const MainContainer = styled.div`
  margin: 8px 0;
  perspective: 1000px;

  &:focus {
    outline: none;
  }
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
  margin: 12px 0;

  > img {
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: translateY(1px) scale(1.1);
    }
  }
`;

const FlowerImg = styled.img`
  width: 100%;
`;

const slamIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(10);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;
const BlockImage = styled.img`
  width: 100%;
  height: 100%;
  border: solid 6px transparent;
  box-sizing: border-box;
  border-radius: 12px;
  animation: ${slamIn} 0.1s 1 linear;
`;

const bounceIn = keyframes`
  0% {
    transform: scale(0);
  }

  80% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
`;

interface CellProps {
  elevation: number;
}
const Cell = styled.div<CellProps>`
  display: inline-block;
  width: ${cellSize}px;
  height: ${cellSize}px;
  background: 
    linear-gradient(to left, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)),
    url('${GrassTexture}');
  vertical-align: top;
  cursor: pointer;
  transition: transform 0.1s, background-size 0.1s;
  background-position: center center;
  background-repeat: no-repeat;
  box-sizing: border-box;

  ${({ elevation }) => css`
    ${elevation === 1 && css`
      background: 
      linear-gradient(to left, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
      url('${GrassTexture}');
    `}
    ${elevation === 2 && css`
      background: 
      linear-gradient(to left, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
      url('${GrassTexture}');
    `}
  `}
  background-size: 100% 100%;

  &:hover {
  }

  ${FlowerImg} {
    animation: ${bounceIn} 0.1s 1;
  }

  > div {
    transition: transform 1s;
    transform-origin: bottom;
    pointer-events: none;
  }
`;

interface FieldElProps {
  isViewPerspective: boolean;
}
const FieldEl = styled.div<FieldElProps>`
  margin: 0 auto;
  border-radius: 8px;
  user-select: none;
  background: url('${GrassTexture}');
  background-size: ${cellSize}px ${cellSize}px;
  transition: transform 2s;
  transform-style: preserve-3d;

  &:hover {
    ${Cell} {
      border: solid 0.5px rgba(0, 0, 0, 0.2);
    }
  }

  ${({ isViewPerspective }) => isViewPerspective && css`
    transform: rotateX(55deg) rotateZ(55deg);
    ${Cell} {
      border: solid 0.5px rgba(0, 0, 0, 0.2);
      > div {
        ${''/*transform: translateY(-50%) rotateX(-90deg);*/}
      }
    }

    &:hover {
      ${Cell} {
        border: solid 0.5px rgba(0, 0, 0, 0.4);
      }
    }
  `}
`;

const Row = styled.div`
  display: block;
  height: ${cellSize}px;
  transform-style: preserve-3d;
`;

export const MinusPlusButton = styled.div`
  width: 48px;
  height: 48px;
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: translateY(1px) scale(1.1);
  }

  &::before, &::after {
    display: block;
    position: absolute;
    width: 24px;
    height: 8px;
    background: #fff;
    top: 50%;
    left: 50%;
  }
  &::before {
    content: '';
    transform: translateX(-50%) translateY(-50%);
  }
`;

export const PlusButton = styled(MinusPlusButton)`
  &::after {
    content: '';
    transform: translateX(-50%) translateY(-50%) rotateZ(90deg);
  }
`;

export default FieldMaker;
