let table;
let volcanoColor;
let minElevation = -6000; //limiti altitudine (elevation) per scala di colore
let elevation = 0; //valore di altitudine da mappare
let maxElevation = 7000;
let selectedVolcano = null; //x memorizzare dati vulcano cliccato
let volcanoElevation = 0;
let peakY = null; //memorizza coordinata Y picco del grafico

function preload() {
  table = loadTable(
    "volcanoes-2025-10-27 - Es.3 - Original Data.csv",
    "csv",
    "header"
  );
}

//x recuperare parametri da URL
function getURLParams() { //restituisce tutti paramtetri dopo "?" in URL pagina
    const params = {};
    const url = window.location.href;
    const parts = url.split('?'); //divide URL in 2 parti, divise da ?, parts[0] contiene l'URL base, parts[1] contiene stringa di query completa, che è lista di parametri e valori
    if (parts.length > 1) {
        const query = parts[1];
        const vars = query.split('&'); //split('&') ottiene singoli parametri es.["volcano=Vesuvio", "id=123", "active=true"]
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('='); //split('=') (e ciclo) es."volcano=Vesuvio" diventa params.volcano = "Vesuvio", "id=123" diventa params.id = "123","active=true" diventa params.active = "true"
            params[pair[0]] = pair[1];
        }
    }
    return params;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //recupera dati vulcano da URL
  let parameters = getURLParams();

  if (parameters.volcano && parameters.lat && parameters.lon) {
    let volcanoName = decodeURIComponent(parameters.volcano); //trova riga vulcano usando nome vulcano
    let targetLatitude = parameters.lat;
    let targetLongitude = parameters.lon;
    let foundRows = table.findRows(volcanoName, "Volcano Name"); //nome colonna nella tabella è "Volcano Name"

    let targetRow = null;

    //itera su risultati x trovare riga che corrisponde a coordinate
    for (let i = 0; i < foundRows.length; i++) {
      let row = foundRows[i];

      if ( //confronta latitudine e longitudine come stringhe x garantire precisione
        row.getString("Latitude") === targetLatitude &&
        row.getString("Longitude") === targetLongitude
      ) {
        targetRow = row;
        break; //trovato vulcano univoco, interrompe ciclo
      }
    }

    if (targetRow) {
      selectedVolcano = targetRow;
      //estrae valore Elevation e lo converte in numero
      let rawElevation = selectedVolcano.getString("Elevation (m)");
      let parsedElevation = parseFloat(rawElevation);

      if (!isNaN(parsedElevation)) { //aggiorna elevazione
          volcanoElevation = parsedElevation;
      } else {
          volcanoElevation = 0; 
      }
      
      elevation = volcanoElevation; 
    } else {
        //se non viene trovata 1 riga univoca (vulcani Unnamed hanno tutti stesso nome)
        selectedVolcano = null;
        volcanoElevation = 0;
        elevation = 0;
        console.warn("Nessun vulcano trovato con i parametri completi (Nome, Latitudine, Longitudine).");
    }
  } else {
    //se parametri non sono presenti nell'URL
    selectedVolcano = null;
    volcanoElevation = 0;
    elevation = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#713f2cff");

  push(); //scheda grafico

  rectMode(CENTER);
  noStroke();
  fill("#4b2a1cff");
  rect(windowWidth / 2, windowHeight / 2, 300, 450, 35);

  stroke("#000000ff");
  line(
    windowWidth / 2 - 150,
    windowHeight / 2,
    windowWidth / 2 + 150,
    windowHeight / 2
  );

  pop();

  peakY = null; //resetta picco Y

  //grafico vulcano
  if (selectedVolcano) {
    const elevation = volcanoElevation;
    const maxGraphHeight = 150; //max altezza/profondità grafico in pixel (x stare nel riquadro)

    //grafico positivo rosso
    if (elevation >= 0) {
      //mappa elevazione (0 - 7000m) a un'altezza in pixel (0 - maxGraphHeight)
      const graphHeight = map(
        elevation,
        0,
        maxElevation,
        0,
        maxGraphHeight,
        true
      );
      //calcola Y vetta (grafico si estende verso alto)
      peakY = windowHeight / 2 - graphHeight;

      push();

      stroke("#ff0000ff");
      strokeWeight(5);
      line(windowWidth / 2 - 100, windowHeight / 2, windowWidth / 2, peakY);
      line(windowWidth / 2, peakY, windowWidth / 2 + 100, windowHeight / 2);

      pop();
    }
    //grafico negativo blu
    else if (elevation < 0) {
      //mappa elevazione (0 - -6000m) a un'altezza in pixel (0 a maxGraphHeight)
      const graphDepth = map(
        abs(elevation),
        0,
        abs(minElevation),
        0,
        maxGraphHeight,
        true
      );
      //calcola Y vetta (grafico si estende verso basso)
      peakY = windowHeight / 2 + graphDepth;

      push(); //grafico negativo (blu)

      stroke("#0000ffff");
      strokeWeight(5);
      line(windowWidth / 2 - 100, windowHeight / 2, windowWidth / 2, peakY);
      line(windowWidth / 2, peakY, windowWidth / 2 + 100, windowHeight / 2);

      pop();
    }

    if (peakY !== null) {
      //linea tratteggiata e stringa Elevation

      push(); //linea tratteggiata

      setLineDash([4, 10]); //tratti lunghi 4px con spazi tra loro di 10px
      stroke("#ffffffff");
      strokeWeight(4);
      line(windowWidth / 2, peakY, windowWidth / 2 + 150, peakY);
      pop();

      push(); //stringa Elevation

      fill("#fffb00ff");
      noStroke();
      textAlign(LEFT, CENTER);
      textStyle(BOLD);
      textSize(16);
      text(elevation.toFixed(0) + "m", windowWidth / 2 + 190, peakY); //mostra valore sotto colonna Elevation

      pop();
    }
  }

  push(); //barra sfumata rossa

  const lightRed = color("#ff9b7cff");
  const darkRed = color("#8c0a0aff");

  const redBarX = windowWidth / 2 + 165;
  const redBarY = windowHeight / 2 - 112.5;
  const redBarW = 30;
  const redBarH = 225;

  //sfumatura rossa
  for (let i = 0; i < redBarH; i++) {
    const colorRatioRed = map(i, 0, redBarH, 1, 0); //mappa posizione verticale (i) da 0 a redBarH a valore da 1 a 0
    volcanoColor = lerpColor(lightRed, darkRed, colorRatioRed); //lerpColor calcola colore x riga corrente

    stroke(volcanoColor);
    line(
      redBarX - redBarW / 2,
      redBarY - redBarH / 2 + i,
      redBarX + redBarW / 2,
      redBarY - redBarH / 2 + i
    ); //linea lunga 1px che viene aumentata durante ciclo sempre di i, suo colore ogni volta gradato, così tutte righe insieme creano sfumatura
  }

  //colore "volcanoColor" finale sarà quello a ultimo i (quello di 0m)
  const colorRatioRed_value = map(elevation, 0, maxElevation, 0, 1, true);
  volcanoColor = lerpColor(lightRed, darkRed, colorRatioRed_value);

  pop();

  push(); //barra sfumata blu

  const lightBlue = color("#7cd1ffff");
  const darkBlue = color("#221ba0ff");

  const blueBarX = windowWidth / 2 + 165;
  const blueBarY = windowHeight / 2 + 112.5;
  const blueBarW = 30;
  const blueBarH = 225;

  //sfumatura blu
  for (let i = 0; i < blueBarH; i++) {
    const colorRatioBlue = map(i, 0, blueBarH, 0, 1); //mappa posizione verticale (i) da 0 a blueBarH a valore da 0 a 1
    volcanoColor = lerpColor(lightBlue, darkBlue, colorRatioBlue); //lerpColor calcola colore x riga corrente, mantiene sfumatura da chiaro a scuro

    stroke(volcanoColor);
    line(
      blueBarX - blueBarW / 2,
      blueBarY - blueBarH / 2 + i,
      blueBarX + blueBarW / 2,
      blueBarY - blueBarH / 2 + i
    ); //linea lunga 1px che viene aumentata durante ciclo sempre di i, suo colore ogni volta gradato, così tutte righe insieme creano sfumatura
  }

  //colore "volcanoColor" finale sarà quello a ultimo i (quello di -6000m)
  const colorRatioBlue_value = map(elevation, minElevation, 0, 0, 1, true);
  volcanoColor = lerpColor(darkBlue, lightBlue, colorRatioBlue_value);

  pop();

  //coordinate stringhe bianche Elevation
  const y7000m = windowHeight / 2 - 210;
  const y0m = windowHeight / 2;
  const y6000m = windowHeight / 2 + 210;
  const fixedTextX = windowWidth / 2 + 190;
  const textHeight = 14;

  //x nascondere testi fissi se testo dinamico li copre
  let show7000m = true;
  let show0m = true;
  let show6000m = true;

  if (peakY !== null) {
    //controllo sovrapposizione, se Y stringa gialla è vicina a Y stringa bianca
    if (abs(peakY - y7000m) < textHeight * 1.5) show7000m = false;
    if (abs(peakY - y0m) < textHeight * 1.5) show0m = false;
    if (abs(peakY - y6000m) < textHeight * 1.5) show6000m = false;
  }

  push();

  fill("#ffffffff");
  noStroke();
  textAlign(LEFT);
  textStyle(NORMAL);
  textSize(14);
  if (show7000m) text("7000m", fixedTextX, y7000m);
  if (show0m) text("0m", fixedTextX, y0m);
  if (show6000m) text("-6000m", fixedTextX, y6000m);

  pop();

  push(); //scheda informazioni vulcano

  rectMode(CENTER);
  noStroke();
  fill("#4b2a1cff");
  rect(windowWidth / 2 + 450, windowHeight / 2, 300, 220, 10);

  pop();

  //dati vulcano
  let volcanoName = "";
  let country = "";
  let type = "";
  let typeCategory = "";
  let status = "";
  let lastEruptionCode = "";

  if (selectedVolcano) {
    volcanoName = selectedVolcano.getString("Volcano Name");
    country = selectedVolcano.getString("Country");
    type = selectedVolcano.getString("Type");
    typeCategory = selectedVolcano.getString("TypeCategory");
    status = selectedVolcano.getString("Status");
    lastEruptionCode = selectedVolcano.getString("Last Known Eruption");
  }

  push();

  fill("#ffffffff");
  noStroke();
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(20);
  text(volcanoName, windowWidth / 2 + 315, windowHeight / 2 - 75);

  pop();

  push();

  fill("#ffffffff");
  noStroke();
  textAlign(LEFT);
  textStyle(NORMAL);
  textSize(16);
  text("Country: " + country, windowWidth / 2 + 315, windowHeight / 2 - 35);
  text("Type: " + type, windowWidth / 2 + 315, windowHeight / 2 + 5);
  text(
    "Type cateogry: " + typeCategory,
    windowWidth / 2 + 315,
    windowHeight / 2 + 45
  );
  text("Status: " + status, windowWidth / 2 + 315, windowHeight / 2 + 85);

  pop();

  push();

  rectMode(CENTER); //scheda linea tempo
  noStroke();
  fill("#4b2a1cff");
  rect(windowWidth / 2, windowHeight / 2 + 285, 950, 100, 10);

  pop();

  push(); //linea tempo

  stroke("#ffffffff");
  strokeWeight(5);
  line(
    windowWidth / 2 - 200,
    windowHeight / 2 + 275,
    windowWidth / 2 + 400,
    windowHeight / 2 + 275
  );
  line(
    windowWidth / 2 - 200,
    windowHeight / 2 + 285,
    windowWidth / 2 - 200,
    windowHeight / 2 + 265
  );
  line(
    windowWidth / 2 - 100,
    windowHeight / 2 + 285,
    windowWidth / 2 - 100,
    windowHeight / 2 + 265
  );
  line(
    windowWidth / 2,
    windowHeight / 2 + 285,
    windowWidth / 2,
    windowHeight / 2 + 265
  );
  line(
    windowWidth / 2 + 100,
    windowHeight / 2 + 285,
    windowWidth / 2 + 100,
    windowHeight / 2 + 265
  );
  line(
    windowWidth / 2 + 200,
    windowHeight / 2 + 285,
    windowWidth / 2 + 200,
    windowHeight / 2 + 265
  );
  line(
    windowWidth / 2 + 300,
    windowHeight / 2 + 285,
    windowWidth / 2 + 300,
    windowHeight / 2 + 265
  );
  line(
    windowWidth / 2 + 400,
    windowHeight / 2 + 285,
    windowWidth / 2 + 400,
    windowHeight / 2 + 265
  );

  pop();

  push(); //last known eruption

  fill("#ffffffff");
  noStroke();
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(20);
  text("Last known eruption", windowWidth / 2 - 320, windowHeight / 2 + 280);

  pop();

  //linea temporale
  let showUnknown = false;
  let eruptionX = null;
  let xOffset = null;
  let labelText = ""; //x semplificare stampa etichetta gialla

  if (lastEruptionCode) {
    if (lastEruptionCode === "U") {
      showUnknown = true;
    } else if (lastEruptionCode.startsWith("D")) {
      //mappa valori tabella dati sotto colonna last known eruption (D1-D7) a coordinata X linea temporale
      const segment = parseInt(lastEruptionCode.substring(1));

      switch (segment) {
        case 7:
          xOffset = -200;
          labelText = "D7 \n(b.C.)";
          break;
        case 6:
          xOffset = -100;
          labelText = "D6 \n(1 - 1499)";
          break;
        case 5:
          xOffset = 0;
          labelText = "D5 \n(1500 - 1699)";
          break;
        case 4:
          xOffset = 100;
          labelText = "D4 \n(1700 - 1799)";
          break;
        case 3:
          xOffset = 200;
          labelText = "D3 \n(1800 - 1899)";
          break;
        case 2:
          xOffset = 300;
          labelText = "D2 \n(1900 - 1963)";
          break;
        case 1:
          xOffset = 400;
          labelText = "D1 \n(1964 - 2025)";
          break;
        default:
          xOffset = null;
      }

      if (xOffset !== null) {
        eruptionX = windowWidth / 2 + xOffset;
      }
    }
  }

  //anni bianchi linea temporale
  //se si conosce anno ultima eruzione, salta disegno sua etichetta bianca
  push(); 
  fill("#ffffffff");
  noStroke();
  textAlign(CENTER);
  textStyle(NORMAL);
  textSize(14);
    
  if (xOffset !== -200) text("D7 \n(b.C.)", windowWidth / 2 - 200, windowHeight / 2 + 310); 
  if (xOffset !== -100) text("D6 \n(1 - 1499)", windowWidth / 2 - 100, windowHeight / 2 + 310);
  if (xOffset !== 0) text("D5 \n(1500 - 1699)", windowWidth / 2, windowHeight / 2 + 310);
  if (xOffset !== 100) text("D4 \n(1700 - 1799)", windowWidth / 2 + 100, windowHeight / 2 + 310);
  if (xOffset !== 200) text("D3 \n(1800 - 1899)", windowWidth / 2 + 200, windowHeight / 2 + 310);
  if (xOffset !== 300) text("D2 \n(1900 - 1963)", windowWidth / 2 + 300, windowHeight / 2 + 310);
  if (xOffset !== 400) text("D1 \n(1964 - 2025)", windowWidth / 2 + 400, windowHeight / 2 + 310);

  pop();
  
  //linea verticale gialla
  if (eruptionX !== null) {
    push();

    stroke("#fffb00ff");
    strokeWeight(8);
    line(eruptionX, windowHeight / 2 + 285, eruptionX, windowHeight / 2 + 265);

    pop();
    
    //anno giallo
    push(); 
    fill("#fffb00ff"); 
    noStroke();
    textAlign(CENTER);
    textStyle(BOLD); 
    textSize(14);
    text(labelText, windowWidth / 2 + xOffset, windowHeight / 2 + 310);
    pop();
  }

  //disegna "Unknown" se è valore vulcano scelto
  if (showUnknown) {
    push(); //unknown

    fill("#fffb00ff");
    noStroke();
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(14);
    text("Unknown", windowWidth / 2 - 320, windowHeight / 2 + 310);

    pop();
  }
  //altrimenti (se è data nota D1-D7), "Unknown" non compare
  else {
  }
}

function setLineDash(list) {
  //funzione x rendere a righe linea
  drawingContext.setLineDash(list);
}