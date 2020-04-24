import React, { useState, useRef } from 'react';
import { FlowerNames } from '../data/genes';
import { speciesNames } from '../FlowerExplainer';
import styled, { keyframes, css } from 'styled-components';
import { FlowerIcon } from '../FieldMaker';

const console = window.console;
const colorA = '#99f';
const colorB = '#f99';
const random01 = () => {
  return Math.random() > 0.5 ? 0 : 1;;
}
const parentOptions = [
  [
    {
      genes: '11 00 00 01',
      name: 'Seed Red',
    },
    {
      genes: '11 00 00 01',
      name: 'Seed Red',
    },
  ],
  [
    {
      genes: '00 11 00 00',
      name: 'Seed Yellow',
    },
    {
      genes: '00 00 01 00',
      name: 'Seed White',
    },
  ],
  [
    {
      genes: '11 11 01 01',
      name: 'Island Tours Orange',
    },
    {
      genes: '11 11 01 01',
      name: 'Island Tours Orange',
    },
  ],
];
const FlowerCrosser = () => {
  const [species, setSpecies] = useState(FlowerNames.rose);

  const [parents, setParents] = useState([
    {
      genes: '11 00 00 01',
      name: 'Seed Red',
    },
    {
      genes: '11 00 00 01',
      name: 'Seed Red',
    },
  ]);
  const geneA = parents[0].genes;
  const geneB = parents[1].genes;

  const [choiceA, setChoiceA] = useState([-1, -1, -1, -1]);
  const [choiceB, setChoiceB] = useState([-1, -1, -1, -1]);

  const isCrossed = choiceA.indexOf(-1) === -1 && choiceB.indexOf(-1) === -1;

  const posRef = useRef({
    sourceA: [] as ClientRect[],
    sourceB: [] as ClientRect[],
  });

  const crossFlowers = () => {
    setChoiceA(choiceA.map(random01));
    setChoiceB(choiceB.map(random01));
  };

  const geneC = ['00', '00', '00', '00'].map((output, i) => {
    if (choiceA[i] === -1 || choiceB[i] === -1) {
      return output;
    }
    const result = geneA.split(' ')[i][choiceA[i]] + geneB.split(' ')[i][choiceB[i]];
    return result === '10' ? '01' : result;
  }).join(' ');

  const kbShortcuts = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.which >= 49 && e.which <= 53) {
      setChoiceA([-1, -1, -1, -1]);
      setChoiceB([-1, -1, -1, -1]);
      setSpecies(FlowerNames.rose);
      setParents(parentOptions[e.which - 49]);
    }
  };

  const dur = 1;
  return <MainContainer>
    <h1>
      {speciesNames[species]}
    </h1>
    <Parents>
      <Parent>
        <h2>
          {parents[0].name}
        </h2>
        <IconContainer>
          <FlowerIcon
            flower={{
              species,
              genes: geneA,
            }}
          />
        </IconContainer>
        <GeneContainer>
          {geneA.split(' ').map((g, i) => {
            return <Pair key={i} ref={(el: HTMLDivElement) => {
              if (!el) {
                return;
              }
              const rect = el.getClientRects()[0];
              posRef.current.sourceA[i] = rect;
            }}>
              {choiceA[i] !== -1 && <ChoiceArrow
                key={choiceA.join('')}
                pos={choiceA[i]}
                index={i}
              />}
              <div>
                {g.split('').map((a, ai) => <Allele
                  key={ai}
                  style={{
                    background: colorA,
                  }}
                >{a}</Allele>)}
              </div>
            </Pair>;
          })}
        </GeneContainer>
      </Parent>
      <Parent>
        <h2>
          {parents[1].name}
        </h2>
        <IconContainer>
          <FlowerIcon
            flower={{
              species,
              genes: geneB,
            }}
          />
        </IconContainer>
        <GeneContainer>
          {geneB.split(' ').map((g, i) => {
            return <Pair key={i} ref={(el: HTMLDivElement) => {
              if (!el) {
                return;
              }
              const rect = el.getClientRects()[0];
              posRef.current.sourceB[i] = rect;
            }}>
              {choiceB[i] !== -1 && <ChoiceArrow
                key={choiceB.join('')}
                pos={choiceB[i]}
                index={i}
              />}
              <div>
                {g.split('').map((a, ai) => <Allele
                  key={ai}
                  style={{
                    background: colorB,
                  }}
                >{a}</Allele>)}
              </div>
            </Pair>;
          })}
        </GeneContainer>
      </Parent>
    </Parents>
    <div><button onClick={crossFlowers} onKeyDown={kbShortcuts}>
      cross
    </button></div>
    <Parent style={{
      opacity: isCrossed ? 1 : 0,
    }}>
      <React.Fragment key={[...choiceA, ...choiceB].join('')}>
        <GeneContainer>
          {geneC.split(' ').map((g, i) => {
            return <Pair key={i}>
              <div>
                {g.split('').map((a, ai, arr) => {
                  let sourceIndex = 0;
                  if (
                    geneA.split(' ')[i][choiceA[i]] !== a
                    || (
                      ai === 1
                      && a === arr[0]
                    )
                  ) {
                    sourceIndex = 1;
                  }
                  const sourceChoice = sourceIndex === 0 ? choiceA : choiceB;
                  return <Allele
                    key={ai}
                    style={{
                      backgroundColor: sourceIndex === 0 ? colorA : colorB,
                    }}
                    ref={(el: HTMLDivElement) => {
                      if (!el) {
                        return;
                      }
                      const rect = el.getClientRects()[0];
                      const source = sourceIndex === 0 ? posRef.current.sourceA : posRef.current.sourceB;
                      const sourceRect = source[i];
                      const extraTransform = sourceChoice[i] === 1 ? 'translateX(100%)' : '';
                      el.style.transform = `
                        translateX(${sourceRect.left - rect.left}px)
                        translateY(${sourceRect.top - rect.top}px)
                        ${extraTransform}
                        scale(1.4)
                      `;
                      el.style.opacity = '0';
                      setTimeout(() => {
                        el.style.transition = `
                          transform ${dur}s cubic-bezier(0.5, 0, 0.75, 0),
                          opacity 1s
                        `;
                        el.style.transitionDelay = `${2 + i * dur}s`;
                        el.style.transform = '';
                        el.style.opacity = '';
                      }, 20);
                    }}
                  >
                    {a}
                  </Allele>;
                })}
              </div>
            </Pair>;
          })}
        </GeneContainer>
        <IconContainerBottom style={{
          animationDelay: `${3 + 4 * dur}s`,
        }}>
          <FlowerIcon
            flower={{
              species,
              genes: geneC,
            }}
          />
        </IconContainerBottom>
      </React.Fragment>
    </Parent>
  </MainContainer>;
};

const MainContainer = styled.div`
  width: 600px;
  background: #222;
  margin: 10px auto;
  padding: 20px 10px;
  border-radius: 8px;
  font-family: ACNHFont;
  text-align: center;
  text-transform: uppercase;
  background-position: center center;
  background-size: cover;

  h1 {
    margin: 0 0 20px;
  }

  h2 {
    margin: 0;
    font-size: 14px;
    margin-bottom: 10px;
  }

  button {
    border: none;
    background: #ccc;
    text-transform: uppercase;
    font-size: 16px;
    padding: 4px 16px;
    border-radius: 4px;
    margin-bottom: 20px;

    &:focus {
      outline: none;
      background: #ddd;
    }

    &:active {
      transform: translateY(2px) scale(0.95);
      opacity: 0.9;
    }
  }
`;

const IconContainer = styled.div`
  width: 60px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
`;
const fadein = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
const IconContainerBottom = styled(IconContainer)`
  margin: 20px auto 0;
  animation: ${fadein} 1s 1;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const Parent = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding: 20px;
  margin: 0 10px;
  background: rgba(66, 66, 66, 0.6);
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
  transition: opacity 0.5s;
`;
const Parents = styled.div`
  margin-bottom: 20px;
`;

const Pair = styled.div`
  display: inline-block;
  margin: 0 4px;
  position: relative;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
`;
const Allele = styled.div`
  display: inline-block;
  background: #fff;
  color: #222;
  padding: 2px 4px;
  &:first-child {
    border-radius: 4px 0 0 4px;
    border-right: dashed 1px #666;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
    border-left: dashed 1px #666;
  }
`;

const GeneContainer = styled.div`
  position: relative;
`;
const flip = keyframes`
  0% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(10px);
  }
`;

interface ChoiceArrowProps {
  pos: number;
  index: number;
}
const ChoiceArrow = styled.div<ChoiceArrowProps>`
  height: 10px;
  position: absolute;
  width: 100%;
  bottom: 100%;
  left: 0;

  &:nth-child(2) {
    left: 25%;
  }
  &:nth-child(3) {
    left: 50%;
  }
  &:nth-child(4) {
    left: 75%;
  }

  &::before {
    content: '';
    position: absolute;
    border: solid 30px #fff;
    border-width: 6px 4px 0 4px;
    border-color: #fff transparent transparent transparent;
    width: 0;
    height: 0;
    bottom: 4px;
    left: 50%;
    margin-left: -4px;
    animation: ${flip} 0.1s 5 alternate-reverse linear;
    transform: translateX(-10px);

    ${({ pos }) => pos === 1 && css`
      animation: ${flip} 0.1s 5 alternate linear;
      transform: translateX(10px);
    `}

    ${({ index }) => css`
      animation-iteration-count: ${3 + index * 4}
    `}
  }
`;

export default FlowerCrosser;
