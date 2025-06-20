const items = [
    { name: "Item", type: "item", rarity: "★" },
    { name: "Item", type: "item", rarity: "★★" },
    { name: "Item", type: "item", rarity: "★★★" },
    { name: "Item", type: "item", rarity: "★★★★" },
    { name: "qiqi", tipy: "personagem", rarity: "★★★★★" },
    { name: "mavuika", tipy: "personagem", rarity: "★★★★★" }
    
];
let lastSpinWasTen = false;

let countQiqi = 0;
let countMavuika = 0;

let countFourGuaranteed = 0;
let countFive = 0;
let countFour = 0;
let countThree = 0;
let countTwo = 0;
let countOne = 0;

let spinCount = 0;
let pityHistory = [];
let totalSpins = 0;

function getRandomFiveStar() {
    // 50% chance para cada personagem 5 estrelas
    const fiveStars = items.filter(item => item.rarity === "★★★★★");
    return Math.random() < 0.5 ? fiveStars[0] : fiveStars[1];
}

function drawItem() {
    const chances = [50, 20.40, 12, 8, 0.60]; // soma 100
    const rand = Math.random() * 100;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        sum += chances[i];
        if (rand < sum) {
            // Se for 5 estrelas, sorteia entre os dois personagens
            if (items[i].rarity === "★★★★★") {
                return getRandomFiveStar();
            }
            return items[i];
        }
    }
    return items[0]; ty
}


// No pity também:
function drawItemWithPity() {
    totalSpins++; // Adicione esta linha no início da função
    if (spinCount >= 89) {
    pityHistory.push(spinCount + 1);
    const fiveStar = getRandomFiveStar();
    spinCount = 0;
    countFive++;
    if (fiveStar.name === "qiqi") countQiqi++;
    if (fiveStar.name === "mavuika") countMavuika++;
    return fiveStar;
}

const item = drawItem();
if (item.rarity === "★★★★★") {
    pityHistory.push(spinCount + 1);
    spinCount = 0;
    countFive++;
    if (item.name === "qiqi") countQiqi++;
    if (item.name === "mavuika") countMavuika++;
} else {
    spinCount++;
    if (item.rarity === "★★★★") countFour++;
    else if (item.rarity === "★★★") countThree++;
    else if (item.rarity === "★★") countTwo++;
    else if (item.rarity === "★") countOne++;
}
return item;
}

function displayResult(item) {
    const resultDiv = document.getElementById("result");
    const rarityClass = item.rarity === "★★★★★" ? "rarity-five" : "";
    resultDiv.innerHTML = `voçe ganhou: <strong>${item.name}</strong> (<span class="${rarityClass}">${item.rarity}</span>)`;
}


// Altere o drawTenItems para usar o drawItemWithPity:
function drawTenItems() {
    const results = [];
    for (let i = 0; i < 10; i++) {
        const item = drawItemWithPity();
        results.push(item);
    }

    // Só garante um 4 estrelas se NÃO houver nenhum 5 estrelas
    const hasFiveStar = results.some(item => item.rarity === "★★★★★");
    const hasFourStar = results.some(item => item.rarity === "★★★★");

    if (!hasFiveStar && !hasFourStar) {
        const fourStarItems = items.filter(item => item.rarity === "★★★★");
        const guaranteed = fourStarItems[Math.floor(Math.random() * fourStarItems.length)];
        results[results.length - 1] = guaranteed;
        countFour++;
        countFourGuaranteed++; // Conta o garantido
    }

    displayTenResults(results);
}
function displayTenResults(items) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = items.map(item => {
        const rarityClass = item.rarity === "★★★★★" ? "rarity-five" : item.rarity === "★★★★" ? "rarity-four" : "";
        return `voçe ganhou: <strong>${item.name}</strong> (<span class="${rarityClass}">${item.rarity}</span>)`;
    }).join("<br>");
}

// ...existing code...

function updatePityDisplay() {
    document.getElementById("pity-value").textContent = `Pity atual: ${spinCount}`;
}

// Listener para giro único
document.getElementById("draw-button").addEventListener("click", function() {
    lastSpinWasTen = false;
    const drawnItem = drawItemWithPity();
    displayTenResults([drawnItem]);
    updatePityDisplay();
});

document.getElementById("draw-ten-button").addEventListener("click", function() {
    lastSpinWasTen = true;
    drawTenItems();
    document.getElementById("meu-video").play();
    updatePityDisplay();
});

function displayTenResults(items) {
    const resultScreen = document.getElementById("result-screen");
    const resultList = document.getElementById("result-list");
    resultList.innerHTML = items.map(item => {
        const rarityClass = item.rarity === "★★★★★" ? "rarity-five" : item.rarity === "★★★★" ? "rarity-four" : "";
        return `voçe ganhou: <strong>${item.name}</strong> (<span class="${rarityClass}">${item.rarity}</span>)`;
    }).join("<br>");
    resultScreen.style.display = "flex";
    updatePityDisplay(); // <-- Adicione aqui!
}

// Botão para fechar a tela de resultados
document.getElementById("close-result").addEventListener("click", function() {
    document.getElementById("result-screen").style.display = "none";
});
document.getElementById("draw-again").addEventListener("click", function() {
    if (lastSpinWasTen) {
        drawTenItems();
    } else {
        const drawnItem = drawItemWithPity();
        displayTenResults([drawnItem]);
    }
    updatePityDisplay();
});
document.getElementById("show-history").addEventListener("click", function() {
    const historyScreen = document.getElementById("history-screen");
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = `
    <div style="margin-bottom:10px;">
        De ${totalSpins} giros você pegou:<br> <br>
        
        <strong>${countFive}</strong> ★★★★★ (sendo qiqi: ${countQiqi}, mavuika: ${countMavuika})<br>
        <strong>${countFour}</strong> ★★★★ (sendo ${countFourGuaranteed} garantidos)<br>
        <strong>${countThree}</strong> ★★★ <br>
        <strong>${countTwo}</strong> ★★ <br>
        <strong>${countOne}</strong> ★ <br><br>
    </div>
`;
    historyScreen.style.display = "flex";
});

document.getElementById("close-history").addEventListener("click", function() {
    document.getElementById("history-screen").style.display = "none";
});