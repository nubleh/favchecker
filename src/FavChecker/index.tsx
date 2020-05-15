import React, { useState, useEffect } from 'react';

import styled, { css } from 'styled-components';

import { langs, personalities } from '../i18n/languages';
import villagersData from './data/villagers.json';
import itemsData from './data/items.json';
import i18nVillagerNames from '../i18n/villagerNames.json';
import words from '../i18n/words.json';

type VillagerName = keyof typeof villagersData;
type ItemName = keyof typeof itemsData;

const clothingTypes = [
  'accessories', 
  'bags', 
  'headwear', 
  'shoes', 
  'dresses', 
  'bottoms', 
  'socks', 
  'tops',
  // 'umbrellas',
  // 'music',
  // 'bugs',
  // 'fish',
  // 'floors',
  // 'wallpapers',
  // 'fossils',
  // 'rugs',
  // 'wall mounted',
  // 'misc',
  // 'housewares',
];
const languages = Object.values(langs);
let ownVillagersCache: VillagerName[] = [];
const ownVillagersCacheKey = 'ownVillagersCache';
try {
  ownVillagersCache = JSON.parse(localStorage.getItem(ownVillagersCacheKey) || '[]');
} catch (_) {}

const langCacheKey = 'lang';
let langCache = languages[0];
try {
  langCache = (localStorage.getItem(langCacheKey) || languages[0]) as langs;
} catch (_) {}
if (languages.indexOf(langCache) === -1) {
  langCache = languages[0];
}

const FavChecker = () => {
  const [lang, setLang] = useState(langCache);
  const [villagerNameQuery, setVillagerNameQuery] = useState('');
  const [itemNameQuery, setItemNameQuery] = useState('');
  const [ownVillagers, setOwnVillagers] = useState(ownVillagersCache);

  useEffect(() => {
    localStorage.setItem(ownVillagersCacheKey, JSON.stringify(ownVillagers));
  }, [ownVillagers]);
  useEffect(() => {
    localStorage.setItem(langCacheKey, lang);
  }, [lang]);
  const onChangeVillagerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget) {
      setVillagerNameQuery(e.currentTarget.value);
    }
  };
  const onChangeItemName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget) {
      setItemNameQuery(e.currentTarget.value);
    }
  };

  const villagerNames = Object.keys(villagersData) as VillagerName[];
  const itemNames = Object.keys(itemsData) as ItemName[];
  const filteredVillagerNames = villagerNames.filter((name) => {
    const i18nName = i18nVillagerNames[name][lang];
    return ownVillagers.indexOf(name) !== -1
      || (
        villagerNameQuery !== ''
        && i18nName.toLowerCase().indexOf(villagerNameQuery.toLowerCase()) !== -1
      );
  }).sort((vA, vB) => {
    const vAi = ownVillagers.indexOf(vA);
    const vBi = ownVillagers.indexOf(vB);
    if (vAi === vBi) {
      return vA > vB ? 1 : -1;
    }
    if (vAi === -1) {
      return 1;
    }
    if (vBi === -1) {
      return -1;
    }
    return vA > vB ? 1 : -1;
  });

  const filteredItemNames = itemNames.filter((name) => {
    return itemNameQuery !== ''
      && clothingTypes.indexOf(itemsData[name].type) !== -1
      && name.toLowerCase().indexOf(itemNameQuery.toLowerCase()) !== -1;
  }).sort();

  const setItemQueryTo = (iName: ItemName) => {
    return () => {
      setItemNameQuery(iName);
    };
  };

  const addVillagerToOwn = (vName: VillagerName) => {
    return () => {
      if (ownVillagers.indexOf(vName) === -1) {
        setOwnVillagers([
          ...ownVillagers,
          vName,
        ]);
      } else {
        setOwnVillagers(ownVillagers.filter(v => v !== vName));
      }
      setVillagerNameQuery('');
    };
  };

  return <MainContainer>
    <VillagerSearcher>
      <input
        value={villagerNameQuery}
        onChange={onChangeVillagerName}
        placeholder={'Type villager name here'}
      />
      <LangButton tabIndex={0}>
        <span>{lang}</span>
        <LangOptions>
          {languages.map(langOption => {
            return <div
              key={langOption}
              onClick={() => {
                setLang(langOption);
              }}
              style={lang === langOption ? {
                background: 'rgba(0, 0, 0, 0.1)',
              } : {}}
            >
              {langOption}
            </div>;
          })}
        </LangOptions>
      </LangButton>
    </VillagerSearcher>
    <ItemSearcher>
      {itemNameQuery !== '' && filteredItemNames.length < 100 && <ItemSearcherResultContainer>
        {filteredItemNames.map(iName => {
          return <ItemSearcherResult
            key={iName}
            onClick={setItemQueryTo(iName)}
          >
            {iName}
          </ItemSearcherResult>;
        })}
      </ItemSearcherResultContainer>}
      {itemNameQuery !== '' && filteredItemNames.length >= 100 && <ItemSearcherResultContainer>
        {filteredItemNames.length} results, keep typing
      </ItemSearcherResultContainer>}
      <input
        value={itemNameQuery}
        onChange={onChangeItemName}
        placeholder={'Type item name here'}
      />
    </ItemSearcher>
    <VillagerContainer>
      {filteredVillagerNames.map(vName => {
        const vData = villagersData[vName];
        const isOwnedVillager = ownVillagers.indexOf(vName) !== -1;
        const shortListed = filteredVillagerNames.length <= 20;
        return <VillagerRow
          key={vName}
          isOwnedVillager={isOwnedVillager}
        >
          <VillagerProfile>
            <VillagerCheckbox
              onClick={addVillagerToOwn(vName)}
              isOwnedVillager={isOwnedVillager}
            />
            <VillagerName>
              {i18nVillagerNames[vName][lang]} {words['is'][lang]} {words[vData.pers as personalities][lang]}
            </VillagerName>
            <VillagerLikes>
              {words['likes'][lang]} {vData.likes.join(', ')}
            </VillagerLikes>
          </VillagerProfile>
          {(isOwnedVillager || shortListed) && filteredItemNames.length <= 10 && <div>
            {filteredItemNames.map(iName => {
              const itemData = itemsData[iName];
              const commonAttribute = Object.values(itemData.attributes).reduce((c, n) => {
                if (!c || c.length === 0) {
                  return n;
                }
                if (!n) {
                  return c;
                }
                return c.filter(val => n.indexOf(val) !== -1);
              }, []);
              return <ItemUnit key={iName}>
                <div>
                  {iName} {commonAttribute && `(${commonAttribute.join(', ')})`}
                </div>
                <div>
                  {Object.entries(itemData.attributes).map(([attrKey, attrs]) => {
                    if (!attrs) {
                      return null;
                    }
                    const isFav = attrs.reduce((c, n) => {
                      return c || vData.likes.indexOf(n) !== -1;
                    }, false);
                    return <ItemVariant key={attrKey}>
                      {isFav ? <VariantYes/> : <VariantNo/>}
                      <span>
                        {attrKey}
                      </span>
                    </ItemVariant>;
                  })}
                </div>
              </ItemUnit>;
            })}
          </div>}
        </VillagerRow>;
      })}
    </VillagerContainer>
    <Credits>
      based on datamined data compiled by discord user jhenebean#8648
    </Credits>
  </MainContainer>;
};

const LangOptions = styled.div`
  background: red;
  position: absolute;
  right: 2px;
  top: 95%;
  overflow: auto;
  max-height: 80vh;
  max-width: 90vw;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.85);
  color: #222;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  display: none;
  text-align: left;

  > div {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const LangButton = styled.div`
  font-size: 10px;
  padding: 0 8px;
  user-select: none;
  text-transform: uppercase;
  margin-left: 4px;
  background: #000;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  text-align: center;
  flex: 1 1 auto;

  > span {
    vertical-align: middle;
  }

  &::before {
    content: '';
    display: inline-block;
    height: 100%;
    background: red;
    vertical-align: middle;
  }

  &:hover, &:focus {
    background: #333;
    outline: none;

    ${LangOptions} {
      display: block;
    }
  }
`;

const VillagerContainer = styled.div`
  min-height: 90vh;
`;

const Credits = styled.div`
  bottom: 4px;
  left: 4px;
  font-size: 10px;
  font-family: monospace;
`;

const MainContainer = styled.div`
  padding: 46px 8px;
  input {
    border: none;
    border-radius: 4px;
    background: #fff;
    padding: 4px 8px;
    line-height: 2em;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
    }
  }
`;

const ItemUnit = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  &:nth-child(2n - 1) {
    background: rgba(255, 255, 255, 0.2);
  }
  &:nth-child(2n - 2) {
    background: rgba(255, 255, 255, 0.1);
  }
`;
const ItemVariant = styled.div`
  margin-left: 10px;
  display: inline-block;
  > span {
    vertical-align: middle;
  }
`;

const VillagerProfile = styled.div`
  position: sticky;
  top: 38px;
  background: #292929;
  padding: 10px;
  border-radius: 4px 4px 0 0;
`;

interface VillagerCheckboxProps {
  isOwnedVillager: boolean;
}
const VillagerCheckbox = styled.div<VillagerCheckboxProps>`
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  border-radius: 20px;
  box-sizing: border-box;
  border: solid 2px #fff;
  margin-right: 8px;
  cursor: pointer;
  position: relative;

  &:hover {
    opacity: 0.9;
  }

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    display: block;
    border-radius: 20px;
    background: #fff;
    transition: transform 0.2s;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(0);
  }

  ${({ isOwnedVillager }) => isOwnedVillager && css`
    &::before {
      transform: translateX(-50%) translateY(-50%);
    }
  `}
`;
const VillagerName = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const VillagerLikes = styled.div`
  margin: 4px 32px;
  font-size: 10px;
`;

interface VillagerRowProps {
  isOwnedVillager: boolean;
}
const VillagerRow = styled.div<VillagerRowProps>`
  margin: 4px 4px 12px;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 4px;
  background: #292929;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  ${({ isOwnedVillager }) => isOwnedVillager && css`
    &:hover {
    }
  `}
`;

const VariantCircle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
`;
const VariantYes = styled(VariantCircle)`
  background: #6f6;
`;
const VariantNo = styled(VariantCircle)`
  background: #f66;
`;

const VillagerSearcher = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #999;
  box-sizing: border-box;
  color: #222;
  padding: 4px;
  z-index: 1;
  display: flex;

  input {
    flex: 1 1 auto;
  }
`;

const ItemSearcher = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #999;
  box-sizing: border-box;
  color: #222;
  padding: 4px;
  overflow: auto;
  z-index: 1;
`;
const ItemSearcherResult = styled.div`
  padding: 2px 4px;
  font-size: 12px;
  cursor: pointer;
  display: inline-block;
  background: #fff;
  border-radius: 2px;
  margin-right: 4px;

  &:hover {
    opacity: 0.7;
  }
`;

const ItemSearcherResultContainer = styled.div`
  white-space: nowrap;
  width: 100%;
  overflow: auto;
  padding-bottom: 8px;
`;

export default FavChecker;
