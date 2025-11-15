let table;
let volcanoColor;
let minElevation = -6000; //limiti altitudine (elevation) per scala di colore
let elevation = 0; //valore di altitudine da mappare
let maxElevation = 7000;


function setup() {

    createCanvas(windowWidth, windowHeight);
    
}

function draw() {

    background("#713f2cff");

    push(); //scheda grafico

    rectMode(CENTER);
    noStroke();
    fill("#4b2a1cff");
    rect(windowWidth / 2, windowHeight / 2, 300, 450, 35);

    stroke("#000000ff");
    line(windowWidth / 2 - 150, windowHeight / 2, windowWidth / 2 + 150, windowHeight / 2);

    pop();

    push(); //barra sfumata rossa

    const lightRed = color("#ff9b7cff");
    const darkRed = color("#8c0a0aff");
    const colorRatioRed = map(elevation, 0, maxElevation, 0, 1, true); //true costringe valore rimappato entro l'intervallo 0 - 1
    volcanoColor = lerpColor(lightRed, darkRed, colorRatioRed); //lerpColor() crea sfumatura tra due colori (primi 2 argomenti), in base al 3° argomento (valore min = 0, max = 1) per questo ho mappato in intervallo 0 - 1
    fill(volcanoColor);
    noStroke();
    rectMode(CENTER);
    rect(windowWidth / 2 + 165, windowHeight / 2 - 112.5, 30, 225);

    pop();

    push(); //barra sfumata blu

    const lightBlue = color("#7cd1ffff");
    const darkBlue = color("#221ba0ff");
    const colorRatioBlue = map(elevation, minElevation, 0, 0, 1, true); //true costringe valore rimappato entro l'intervallo 0 - 1
    volcanoColor = lerpColor(darkBlue, lightBlue, colorRatioBlue); //lerpColor() crea sfumatura tra due colori (primi 2 argomenti), in base al 3° argomento (valore min = 0, max = 1) per questo ho mappato in intervallo 0 - 1
    fill(volcanoColor);
    noStroke();
    rectMode(CENTER);
    rect(windowWidth / 2 + 165, windowHeight / 2 + 112.5, 30, 225);

    pop();

    push();

    fill("#ffffffff");
    textAlign(LEFT);
    textStyle(NORMAL);
    textSize(14);
    text("7000m", windowWidth / 2 + 190, windowHeight / 2 - 210);
    text("0m", windowWidth / 2 + 190, windowHeight / 2);
    text("-6000m", windowWidth / 2 + 190, windowHeight / 2 + 210);

    pop();

    push(); //scheda informazioni vulcano

    rectMode(CENTER);
    noStroke();
    fill("#4b2a1cff");
    rect(windowWidth / 2 + 450, windowHeight / 2, 300, 220, 10);

    pop();

    push();

    fill("#ffffffff");
    textAlign(LEFT);
    textStyle(BOLD);
    textSize(20);
    text("Name da cambiare", windowWidth / 2 + 315, windowHeight / 2 - 75);

    pop();

    push();

    fill("#ffffffff");
    textAlign(LEFT);
    textStyle(NORMAL);
    textSize(16);
    text("Country: ", windowWidth / 2 + 315, windowHeight / 2 - 35);
    text("Type: ", windowWidth / 2 + 315, windowHeight / 2 + 5);
    text("Type cateogry: ", windowWidth / 2 + 315, windowHeight / 2 + 45);
    text("Status: ", windowWidth / 2 + 315, windowHeight / 2 + 85);

    pop();

    push();

    rectMode(CENTER); //scheda linea tempo
    noStroke();
    fill("#4b2a1cff");
    rect(windowWidth / 2, windowHeight / 2 + 285, 950, 100, 10);

    pop();

    push(); //last known eruption

    fill("#ffffffff");
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(20);
    text("Last known eruption", windowWidth / 2 - 320, windowHeight / 2 + 280);

    pop();

    push(); //linea tempo

    stroke("#ffffffff");
    strokeWeight(5);
    line(windowWidth / 2 - 200, windowHeight / 2 + 275, windowWidth / 2 + 400, windowHeight / 2 + 275);
    line(windowWidth / 2 - 200, windowHeight / 2 + 285, windowWidth / 2 - 200, windowHeight / 2 + 265);
    line(windowWidth / 2 - 100, windowHeight / 2 + 285, windowWidth / 2 - 100, windowHeight / 2 + 265);
    line(windowWidth / 2, windowHeight / 2 + 285, windowWidth / 2, windowHeight / 2 + 265);
    line(windowWidth / 2 + 100, windowHeight / 2 + 285, windowWidth / 2 + 100, windowHeight / 2 + 265);
    line(windowWidth / 2 + 200, windowHeight / 2 + 285, windowWidth / 2 + 200, windowHeight / 2 + 265);
    line(windowWidth / 2 + 300, windowHeight / 2 + 285, windowWidth / 2 + 300, windowHeight / 2 + 265);
    line(windowWidth / 2 + 400, windowHeight / 2 + 285, windowWidth / 2 + 400, windowHeight / 2 + 265);

    pop();

    push(); //anni riga tempo

    fill("#ffffffff");
    textAlign(CENTER);
    textStyle(NORMAL);
    textSize(14);
    text("D7 \n(b.C.)", windowWidth / 2 - 200, windowHeight / 2 + 310); // \n x andare a capo nella stessa stringa 
    text("D6 \n(1 - 1499)", windowWidth / 2 - 100, windowHeight / 2 + 310);
    text("D5 \n(1500 - 1699)", windowWidth / 2, windowHeight / 2 + 310);
    text("D4 \n(1700 - 1799)", windowWidth / 2 + 100, windowHeight / 2 + 310);
    text("D3 \n(1800 - 1899)", windowWidth / 2 + 200, windowHeight / 2 + 310);
    text("D2 \n(1900 - 1963)", windowWidth / 2 + 300, windowHeight / 2 + 310);
    text("D4 \n(1964 - 2025)", windowWidth / 2 + 400, windowHeight / 2 + 310);

    pop();

}
