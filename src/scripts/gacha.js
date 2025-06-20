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
    totalSpins++;
    if (spinCount >= 89) {
        pityHistory.push(spinCount + 1);
        const fiveStar = getRandomFiveStar();
        pityHistory[(pityHistory.length - 1) + "_who"] = fiveStar.name; // Salva quem foi
        spinCount = 0;
        countFive++;
        if (fiveStar.name === "qiqi") countQiqi++;
        if (fiveStar.name === "mavuika") countMavuika++;
        return fiveStar;
    }

    const item = drawItem();
    if (item.rarity === "★★★★★") {
        pityHistory.push(spinCount + 1);
        pityHistory[(pityHistory.length - 1) + "_who"] = item.name; // Salva quem foi
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
document.getElementById("luck-level").addEventListener("click", function() {
    // Fecha o histórico de giros, se estiver aberto
    document.getElementById("history-screen").style.display = "none";
    // Mostra a tela de sorte
    document.getElementById("luck-screen").style.display = "flex";
    renderLuckGraph();
});

document.getElementById("close-luck").addEventListener("click", function() {
    document.getElementById("luck-screen").style.display = "none";
});

function renderLuckGraph() {
    const graph = document.getElementById("luck-graph");
    const summary = document.getElementById("luck-summary");
    graph.innerHTML = "";

    if (pityHistory.length === 0) {
        summary.textContent = "Nenhum 5 estrelas ainda para calcular o nível de sorte.";
        return;
    }

    // Cria barras para cada 5 estrelas
    let total = 0;
    let qiqiCount = 0;
    let mavuikaCount = 0;
    let unlucky = 0;
    let bars = pityHistory.map((pity, i) => {
        let barClass = "luck-bar normal";
        let label = "5★";
        // Descobre quem foi o personagem
        let who = "";
        if (pityHistory[i + "_who"]) who = pityHistory[i + "_who"];
        if (who === "qiqi") {
            barClass = "luck-bar qiqi";
            label = "qiqi";
            qiqiCount++;
        } else if (who === "mavuika") {
            barClass = "luck-bar mavuika";
            label = "mavuika";
            mavuikaCount++;
        }
        if (pity > 75) unlucky++;
        total += pity;
        return `<div class="${barClass}" style="height:${Math.min(pity * 2, 200)}px" title="Giro #${i+1}: ${pity}">${label}<br>${pity}</div>`;
    });

    graph.innerHTML = bars.join("");

    // Cálculo de sorte
    const media = total / pityHistory.length;
    let sorte = 100 - (media * 1.2); // Quanto menor a média, maior a sorte
    sorte -= qiqiCount * 10; // Cada qiqi abaixa a sorte
    if (sorte < 0) sorte = 0;
    if (sorte > 100) sorte = 100;

    let mensagem = "";
    if (media <= 30) mensagem = "Incrível! Você está com muita sorte!";
    else if (media <= 60) mensagem = "Boa sorte!";
    else mensagem = "Continue tentando, sua sorte vai melhorar!";
    if (unlucky > 0) mensagem += `<br><span style="color:#ffb300;">Você demorou muito para conseguir ${unlucky} vez(es)!</span>`;
    if (qiqiCount > 0) mensagem += `<br><span style="color:#a259ec;">Pegou qiqi ${qiqiCount} vez(es), isso abaixou sua sorte!</span>`;

    summary.innerHTML = `
        <strong>Média de giros para cada 5 estrelas:</strong> ${media.toFixed(2)}<br>
        <strong>Sorte geral:</strong> ${sorte.toFixed(1)} / 100<br>
        <strong>5★ obtidos:</strong> ${pityHistory.length} (qiqi: ${qiqiCount}, mavuika: ${mavuikaCount})<br>
        ${mensagem}
    `;
}