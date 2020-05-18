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
  const [_, setWindowWidth] = useState(window.innerWidth);

  const elPos = useRef({} as { [key: string]: { rect: ClientRect, scroll: number } });

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateWindowWidth);
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };
  }, []);

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
        const i18nVillagerName = i18nVillagerNames[vName as VillagerName][lang];
        if (villagerNameQuery === i18nVillagerName) {
          setVillagerNameQuery('');
        }
      } else {
        setOwnVillagers(ownVillagers.filter(v => v !== vName));
        if (filteredVillagerNames.length - ownVillagers.length <= 1) {
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
            el.style.transition = 'none';
            el.style.transform = '';
            const rect = el.getClientRects()[0];
            if (!rect) {
              return;
            }
            const oldData = elPos.current[vName];
            if (oldData) {
              const oldRect = oldData.rect;
              const diffX = oldRect.left - rect.left;
              const diffScroll = window.scrollY - oldData.scroll;
              const diffY = oldRect.top - rect.top - diffScroll;
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
            elPos.current[vName] = {
              rect,
              scroll: window.scrollY,
            };
          }}
        >
          <VillagerProfile>
            <VillagerCheckbox
              onClick={addVillagerToOwn(vName)}
              isOwnedVillager={isOwnedVillager}
            ><div style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/img/villagers/${vData.id}.png)`,
            }}/></VillagerCheckbox>
            <VillagerDetails>
              <VillagerName>
                <strong>{i18name}</strong> {words['is'][lang]} <strong>{words[vData.pers as personalities][lang]}</strong>
              </VillagerName>
              <VillagerLikes>
                {words['likes'][lang]} {vData.likes.map(w => words[w as clothesVariants][lang]).join(', ')}
              </VillagerLikes>
            </VillagerDetails>
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
                  <strong>{i18nItemNames[iName as ItemName][lang]}</strong> {commonAttribute && `(${commonAttribute.map(w => words[w as clothesVariants][lang]).join(', ')})`}
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
  position: absolute;
  right: 2px;
  top: 95%;
  display: none;
  overflow: auto;
  max-height: 80vh;
  max-width: 90vw;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.85);
  color: #222;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
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
  font-size: 0.825rem;
  padding: 0 0.5rem;
  user-select: none;
  text-transform: uppercase;
  margin-left: 4px;
  color: #fff;
  border: solid 2px rgb(155, 155, 155);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  text-align: center;
  flex: 1 1 auto;
  margin-left: 0.5rem;

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
    color: #111;
    border-color: #fff;
    background: #fff;
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

const VillagerProfile = styled.div`
  position: sticky;
  top: 1rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
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
    border: solid 2px #0366d6;
    background-position: -80px 0;
  }

  ${({ isOwnedVillager }) => isOwnedVillager && css`
    // change here
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

const VillagerDetails = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.33;
  font-weight: normal;
`;

const VillagerName = styled.span`
  display: inline-block;
`;

const VillagerLikes = styled.span`
  display: block;
`;

interface VillagerRowProps {
  isOwnedVillager: boolean;
}
const VillagerRow = styled.div<VillagerRowProps>`
  margin-top: 0.5rem;
  transition: transform 0.6s;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1)
  display: inline-block;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 1);

  ${({ isOwnedVillager }) => isOwnedVillager && css`
    // if villager is active
    border-bottom: solid 3px #0366d6;
  `}

  @media (max-width: 768px) {
    display: block;
  }
`;

const ItemUnit = styled.div`
  padding: 0.625rem 1rem;
  line-height: 1.5;
  font-size: 0.8rem;
  &:not(:first-child) {
    border-top: solid 1px rgba(255, 255, 255, 0.3);
  }
`;
const ItemVariant = styled.div`
  display: inline-block;
  &:not(:first-child) {
    margin-left: 1rem;
  }
`;

const VariantCircle = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 4px;
  border-radius: 100%;
`;
const VariantYes = styled(VariantCircle)`
  background-color: #28a745;
`;
const VariantNo = styled(VariantCircle)`
  background-color: #d73a49;
`;

const VillagerSearcher = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 0.5rem;

  input {
    flex: 1 1 auto;
  }
`;

const ItemSearcher = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  z-index: 1;
  padding: 0.5rem;
`;

const ItemSearcherResult = styled.span`
  display: inline-block;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 12px;
  border-radius: 2px;
  margin-right: 4px;
  color: #fff;
  border: 1px solid rgba(95, 95, 95);

  &:hover {
    color: #111;
    border-color: rgba(215, 215, 215);
    background-color: rgba(215, 215, 215);
  }
`;

const ItemSearcherResultContainer = styled.div`
  white-space: nowrap;
  width: 100%;
  overflow: auto;
  padding-bottom: 8px;
`;

export default FavChecker;
