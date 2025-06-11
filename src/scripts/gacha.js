const items = [
    { name: "Item", rarity: "★"},
    { name: "Item", rarity: "★★" },
    { name: "Item", rarity: "★★★" },
    { name: "Item", rarity: "★★★★" },
    { name: "Item ", rarity: "★★★★★" }
];

let spinCount = 0;
let pityHistory = [];

function drawItemWithPity() {
    spinCount++;
    if (spinCount >= 90) {
        pityHistory.push(spinCount); // Salva quantos giros foram necessários
        spinCount = 0;
        return items.find(item => item.rarity === "★★★★★");
    }
    const item = drawItem();
    if (item.rarity === "★★★★★") {
        pityHistory.push(spinCount); // Salva quantos giros foram necessários
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
        results.push(drawItemWithPity());
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

document.getElementById("draw-button").addEventListener("click", function() {
    const drawnItem = drawItem();
    displayResult(drawnItem);
});

// Novo botão para girar 10 vezes
document.getElementById("draw-ten-button").addEventListener("click", function() {
    drawTenItems();
});
function drawItem() {
    // Exemplo de chances
    const chances = [50, 26.40, 15, 8, 0.60]; // soma 100
    const rand = Math.random() * 100;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        sum += chances[i];
        if (rand < sum) return items[i];
    }
    return items[0];
}