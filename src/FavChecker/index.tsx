import React, { useState, useEffect, useRef } from 'react';

import styled, { css } from 'styled-components';

import { langs } from '../i18n/languages';
import { personalities, clothesVariants } from './data/enums';
import villagersData from './data/villagers.json';
import itemsData from './data/itemsClothes.json';
import i18nVillagerNames from '../i18n/villagerNames.json';
import i18nItemNames from '../i18n/itemNames.json';
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
  langCache = (localStorage.getItem(langCacheKey)) as langs;
  if (!langCache) {
    langCache = navigator.language.substr(0, 2) as langs;
  }
} catch (_) {}
if (languages.indexOf(langCache) === -1) {
  langCache = languages[0];
}

const FavChecker = () => {
  const [lang, setLang] = useState(langCache);
  const [villagerNameQuery, setVillagerNameQuery] = useState('');
  const [itemNameQuery, setItemNameQuery] = useState('');
  const [ownVillagers, setOwnVillagers] = useState(ownVillagersCache);

  const elPos = useRef({} as { [key: string]: ClientRect });

  useEffect(() => {
    if (lang === 'ja') {
      document.title = 'あつ森 Fav Checker';
    } else {
      document.title = 'ACNH Fav Checker';
    }
  }, [lang]);
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
    const i18nName = i18nItemNames[name][lang];
    return itemNameQuery !== ''
      && clothingTypes.indexOf(itemsData[name].type) !== -1
      && i18nName.toLowerCase().indexOf(itemNameQuery.toLowerCase()) !== -1;
  }).sort();

  const setItemQueryTo = (i18nItemName: string) => {
    return () => {
      setItemNameQuery(i18nItemName);
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
        if (villagerNameQuery === vName) {
          setVillagerNameQuery('');
        }
        if (villagerNameQuery === '') {
          const i18nVillagerName = i18nVillagerNames[vName as VillagerName][lang];
          setVillagerNameQuery(i18nVillagerName);
        }
      }
    };
  };

  return <MainContainer>
    <VillagerSearcher>
      <input
        value={villagerNameQuery}
        onChange={onChangeVillagerName}
        placeholder={words['Type villager name here'][lang]}
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
            onClick={setItemQueryTo(i18nItemNames[iName as ItemName][lang])}
          >
            {i18nItemNames[iName as ItemName][lang]}
          </ItemSearcherResult>;
        })}
      </ItemSearcherResultContainer>}
      {itemNameQuery !== '' && filteredItemNames.length >= 100 && <ItemSearcherResultContainer>
        {filteredItemNames.length} results, keep typing
      </ItemSearcherResultContainer>}
      <input
        value={itemNameQuery}
        onChange={onChangeItemName}
        placeholder={words['Type item name here'][lang]}
      />
    </ItemSearcher>
    <VillagerContainer>
      {filteredVillagerNames.map(vName => {
        const vData = villagersData[vName];
        const isOwnedVillager = ownVillagers.indexOf(vName) !== -1;
        const shortListed = filteredVillagerNames.length <= 20;
        const i18name = i18nVillagerNames[vName][lang];
        return <VillagerRow
          key={vName}
          isOwnedVillager={isOwnedVillager}
          ref={(el: HTMLDivElement) => {
            if (!el) {
              return;
            }
            const rect = el.getClientRects()[0];
            if (!rect) {
              return;
            }
            const oldRect = elPos.current[vName];
            if (oldRect) {
              const diffX = oldRect.left - rect.left;
              const diffY = oldRect.top - rect.top;
              el.style.transition = 'none';
              el.style.transform = `
                translateX(${diffX}px)
                translateY(${diffY}px)
              `;
              setTimeout(() => {
                el.style.transition = '';
                el.style.transform = '';
              }, 10);
            }
            elPos.current[vName] = rect;
          }}
        >
          <VillagerProfile>
            <VillagerCheckbox
              onClick={addVillagerToOwn(vName)}
              isOwnedVillager={isOwnedVillager}
            ><div style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/img/villagers/${vData.id}.png)`,
            }}/></VillagerCheckbox>
            <VillagerName>
              {i18name} {words['is'][lang]} {words[vData.pers as personalities][lang]}
            </VillagerName>
            <VillagerLikes>
              {words['likes'][lang]} {vData.likes.map(w => words[w as clothesVariants][lang]).join(', ')}
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
                  {i18nItemNames[iName as ItemName][lang]} {commonAttribute && `(${commonAttribute.map(w => words[w as clothesVariants][lang]).join(', ')})`}
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
                        {words[attrKey as clothesVariants][lang]}
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

const iconDiameter = 40;
interface VillagerCheckboxProps {
  isOwnedVillager: boolean;
}
const VillagerCheckbox = styled.div<VillagerCheckboxProps>`
  display: inline-block;
  width: ${iconDiameter}px;
  height: ${iconDiameter}px;
  vertical-align: middle;
  border-radius: ${iconDiameter}px;
  box-sizing: border-box;
  margin-right: 8px;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  background-image: linear-gradient(
    135deg,
    #fff 18%,
    #bbb 18%,
    #bbb 23%,
    #777 23%,
    #777 28%,
    #333 28%,
    #333 68%,
    #777 68%,
    #777 73%,
    #bbb 73%,
    #bbb 78%,
    #fff 78%
  );
  background-size: ${iconDiameter * 3}px;
  transition: background-position 0.2s;
  background-position: 0 0;

  &:hover {
    opacity: 0.9;
    border: solid 2px #fff;
    background-position: -80px 0;
  }

  ${({ isOwnedVillager }) => isOwnedVillager && css`
    border: solid 2px #fff;
  `}

  > div {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    background-size: 80% 80%;
    background-position: center center;
    background-repeat: no-repeat;
  }
`;
const VillagerName = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const VillagerLikes = styled.div`
  margin: 4px 32px;
  font-size: 14px;
`;

interface VillagerRowProps {
  isOwnedVillager: boolean;
}
const VillagerRow = styled.div<VillagerRowProps>`
  margin: 4px 4px 12px;
  transition: transform 0.5s;
  border-radius: 4px;
  background: #292929;
  border: solid 2px #aaa;
  border-width: 12px 2px;
  display: inline-block;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  ${({ isOwnedVillager }) => isOwnedVillager && css`
    border-color: #fff;
  `}

  @media (max-width: 768px) {
    display: block;
  }
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
