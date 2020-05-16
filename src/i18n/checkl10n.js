const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./itemNames.json', 'utf8'));
const dataV = JSON.parse(fs.readFileSync('./villagerNames.json', 'utf8'));

let diffES = 0;
let diffFR = 0;
Object.values(data).forEach(d => {
  const a = d['en'];
  const aa = d['en (Europe)'];

  const b = d['es'];
  const bb = d['es (US)'];

  const c = d['fr'];
  const cc = d['fr (US)'];

  if (a !== aa) {
    console.log('en is different: ' + a);
  }
  if (b !== bb) {
    console.log('es is different: ' + a + `("${b}" vs "${bb}")`);
    diffES++;
  }
  if (c !== cc) {
    console.log('fr is different: ' + a + `("${c}" vs "${cc}")`);
    diffFR++;
  }
});

console.log(Object.values(data).length, 'es '+diffES, 'fr '+diffFR);
Object.values(dataV).forEach(d => {
  const a = d['en'];
  const aa = d['en (Europe)'];

  const b = d['es'];
  const bb = d['es (US)'];

  const c = d['fr'];
  const cc = d['fr (US)'];

  if (a !== aa) {
    console.log('en is different: ' + a + `("${a}" en-US vs "${aa}" en-EU)`);
  }
  if (b !== bb) {
    console.log('es is different: ' + a + `("${b}" es vs "${bb}" es-US)`);
  }
  if (c !== cc) {
    console.log('fr is different: ' + a + `("${c}" fr vs "${cc}" fr-US)`);
  }
});