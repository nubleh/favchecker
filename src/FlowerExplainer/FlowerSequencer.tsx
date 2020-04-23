import React from 'react';
import { FlowerNames } from '../data/genes';
import styled, { css } from 'styled-components';
import { FlowerIcon } from '../FieldMaker';

interface FlowerSequencerProps {
  species: FlowerNames;
  genes: string;
}
const FlowerSequencer = (props: FlowerSequencerProps) => {
  const { genes, species } = props;
  const genesUsed = species === FlowerNames.rose ? genes : genes.slice(-8);
  const geneParts = genesUsed.split(' ');
  return <div>
    <FlowerDisplay>
      <FlowerIcon
        flower={{
          species,
          genes: genesUsed,
        }}
      />
    </FlowerDisplay>
    <GenePairs>
      {geneParts.map((gp, i) => {
        return <GenePair key={i}>
          {gp.split('').map((allele, i) => <GeneAllele key={i} allele={allele}/>)}
        </GenePair>;
      })}
    </GenePairs>
  </div>;
};

const FlowerDisplay = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

interface GeneAlleleProps {
  allele: string;
}
export const GeneAllele = styled.div<GeneAlleleProps>`
  display: inline-block;
  padding: 0 8px;
  background: #fafafa;
  line-height: 2em;
  height: 2em;
  overflow: hidden;

  &:first-child {
    border-radius: 4px 0 0 4px;
    border-right: dashed 1px #666;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
    border-left: dashed 1px #666;
  }

  &::before, &::after {
    display: block;
    transition: transform 1s;
    ${({ allele }) => allele === '1' && css`
      transform: translateY(-100%);
    `}
  }
  &::before {
    content: '0';
  }
  &::after {
    content: '1';
  }
`;
const GenePairs = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
export const GenePair = styled.div`
  display: inline-block;
  border-radius: 4px;
  color: #333;
  margin: 0 4px;
  font-size: 22px;
`;

export default FlowerSequencer