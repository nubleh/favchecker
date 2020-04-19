import { FlowerNames } from "./genes";

import AnemoneWhite from '../img/Anemone0.png';
import AnemoneRed from '../img/Anemone1.png';
import AnemoneOrange from '../img/Anemone2.png';
import AnemonePink from '../img/Anemone3.png';
import AnemonePurple from '../img/Anemone4.png';
import AnemoneBlue from '../img/Anemone5.png';
import CosmosWhite from '../img/Cosmos0.png';
import CosmosRed from '../img/Cosmos1.png';
import CosmosYellow from '../img/Cosmos2.png';
import CosmosPink from '../img/Cosmos3.png';
import CosmosOrange from '../img/Cosmos4.png';
import CosmosBlack from '../img/Cosmos5.png';
import HyacinthWhite from '../img/Hyacinth0.png';
import HyacinthYellow from '../img/Hyacinth1.png';
import HyacinthRed from '../img/Hyacinth2.png';
import HyacinthOrange from '../img/Hyacinth3.png';
import HyacinthPink from '../img/Hyacinth4.png';
import HyacinthPurple from '../img/Hyacinth5.png';
import HyacinthBlue from '../img/Hyacinth6.png';
import MumWhite from '../img/Mum0.png';
import MumYellow from '../img/Mum1.png';
import MumRed from '../img/Mum2.png';
import MumPink from '../img/Mum3.png';
import MumGreen from '../img/Mum4.png';
import MumPurple from '../img/Mum5.png';
import PansiWhite from '../img/Pansi0.png';
import PansiYellow from '../img/Pansi1.png';
import PansiRed from '../img/Pansi2.png';
import PansiPurple from '../img/Pansi3.png';
import PansiOrange from '../img/Pansi4.png';
import PansiBlue from '../img/Pansi5.png';
import RoseRed from '../img/Rose0.png';
import RoseWhite from '../img/Rose1.png';
import RoseYellow from '../img/Rose2.png';
import RosePink from '../img/Rose3.png';
import RoseOrange from '../img/Rose4.png';
import RosePurple from '../img/Rose5.png';
import RoseBlack from '../img/Rose6.png';
import RoseBlue from '../img/Rose7.png';
import RoseGold from '../img/GoldenRose.png';
import TuripRed from '../img/Turip0.png';
import TuripWhite from '../img/Turip1.png';
import TuripYellow from '../img/Turip2.png';
import TuripPink from '../img/Turip3.png';
import TuripPurple from '../img/Turip4.png';
import TuripBlack from '../img/Turip5.png';
import TuripOrange from '../img/Turip6.png';
import YuriWhite from '../img/Yuri0.png';
import YuriYellow from '../img/Yuri1.png';
import YuriRed from '../img/Yuri2.png';
import YuriOrange from '../img/Yuri3.png';
import YuriPink from '../img/Yuri4.png';
import YuriBlack from '../img/Yuri5.png';

export const FlowerIconPaths: { [key: number]: { [key: string]: string }} = {
  [FlowerNames.windflower]: {
    'white': AnemoneWhite,
    'red': AnemoneRed,
    'orange': AnemoneOrange,
    'pink': AnemonePink,
    'purple': AnemonePurple,
    'blue': AnemoneBlue,
  },
  [FlowerNames.cosmos]: {
    'white': CosmosWhite,
    'red': CosmosRed,
    'yellow': CosmosYellow,
    'pink': CosmosPink,
    'orange': CosmosOrange,
    'black': CosmosBlack,
  },
  [FlowerNames.hyacinth]: {
    'white': HyacinthWhite,
    'yellow': HyacinthYellow,
    'red': HyacinthRed,
    'orange': HyacinthOrange,
    'pink': HyacinthPink,
    'purple': HyacinthPurple,
    'blue': HyacinthBlue,
  },
  [FlowerNames.mum]: {
    'white': MumWhite,
    'yellow': MumYellow,
    'red': MumRed,
    'pink': MumPink,
    'green': MumGreen,
    'purple': MumPurple,
  },
  [FlowerNames.pansy]: {
    'white': PansiWhite,
    'yellow': PansiYellow,
    'red': PansiRed,
    'purple': PansiPurple,
    'orange': PansiOrange,
    'blue': PansiBlue,
  },
  [FlowerNames.rose]: {
    'red': RoseRed,
    'white': RoseWhite,
    'yellow': RoseYellow,
    'pink': RosePink,
    'orange': RoseOrange,
    'purple': RosePurple,
    'black': RoseBlack,
    'blue': RoseBlue,
    'gold': RoseGold,
  },
  [FlowerNames.tulip]: {
    'red': TuripRed,
    'white': TuripWhite,
    'yellow': TuripYellow,
    'pink': TuripPink,
    'purple': TuripPurple,
    'black': TuripBlack,
    'orange': TuripOrange,
  },
  [FlowerNames.lily]: {
    'white': YuriWhite,
    'yellow': YuriYellow,
    'red': YuriRed,
    'orange': YuriOrange,
    'pink': YuriPink,
    'black': YuriBlack,
  },
};
