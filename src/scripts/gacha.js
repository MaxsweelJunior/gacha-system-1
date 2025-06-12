const items = [
    { name: "Item", tipy: "item", rarity: "★" },
    { name: "Item", tipy: "item", rarity: "★★" },
    { name: "Item", tipy: "item", rarity: "★★★" },
    { name: "Item", tipy: "item", rarity: "★★★★" },
    { name: "qiqi", tipy: "personagem", rarity: "★★★★★" },
    { name: "mavuika", tipy: "personagem", rarity: "★★★★★" }
    
];

let spinCount = 0;
let pityHistory = [];

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
    return items[0];
}


// No pity também:
function drawItemWithPity() {
    spinCount++;
    if (spinCount >= 90) {
    pityHistory.push(spinCount);
    spinCount = 0;
    return getRandomFiveStar();
}
    
    const item = drawItem();
    if (item.rarity === "★★★★★") {
        pityHistory.push(spinCount);
        spinCount = 0;
    }
    return item;
}

function displayResult(item) {
    const resultDiv = document.getElementById("result");
    const rarityClass = item.rarity === "★★★★★" ? "rarity-five" : "";
    resultDiv.innerHTML = `voçe ganhou: <strong>${item.name}</strong> (<span class="${rarityClass}">${item.rarity}</span>)`;
}

// Altere o evento do botão de giro único:
document.getElementById("draw-button").addEventListener("click", function() {
    const drawnItem = drawItemWithPity();
    displayResult(drawnItem);
});
// Altere o drawTenItems para usar o drawItemWithPity:
function drawTenItems() {
    const results = [];
    for (let i = 0; i < 10; i++) {
        const item = drawItemWithPity();
        results.push(item);
        // Se o pity foi ativado, spinCount já foi resetado dentro de drawItemWithPity
        // Não precisa fazer nada extra aqui
    }

    // Garante pelo menos um ★★★★ (exatamente quatro estrelas)
    const hasFourStar = results.some(item => item.rarity === "★★★★");
    if (!hasFourStar) {
        const fourStarItems = items.filter(item => item.rarity === "★★★★");
        const guaranteed = fourStarItems[Math.floor(Math.random() * fourStarItems.length)];
        results[results.length - 1] = guaranteed;
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

// Listener correto para giro único (apenas UMA VEZ)
document.getElementById("draw-button").addEventListener("click", function() {
    const drawnItem = drawItemWithPity();
    displayResult(drawnItem);
});

// Listener para giro 10x
document.getElementById("draw-ten-button").addEventListener("click", function() {
    drawTenItems();
    document.getElementById("meu-video").play();
});
document.getElementById("show-pity").addEventListener("click", function() {
    document.getElementById("pity-value").textContent = `Pity atual: ${spinCount}`;
});