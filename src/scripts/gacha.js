const items = [
    { name: "Item", rarity: "★"},
    { name: "Item", rarity: "★★" },
    { name: "Item", rarity: "★★★" },
    { name: "Item", rarity: "★★★★" },
    { name: "Item ", rarity: "★★★★★" }
];

function drawItem() {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function displayResult(item) {
    const resultDiv = document.getElementById("result");
    const rarityClass = item.rarity === "★★★★★" ? "rarity-five" : "";
    resultDiv.innerHTML = `voçe ganhou: <strong>${item.name}</strong> (<span class="${rarityClass}">${item.rarity}</span>)`;
}

document.getElementById("draw-button").addEventListener("click", function() {
    const drawnItem = drawItem();
    displayResult(drawnItem);
});
function drawTenItems() {
    const results = [];
    for (let i = 0; i < 10; i++) {
        results.push(drawItem());
    }
    displayTenResults(results);
}

function displayTenResults(items) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = items.map(item => 
        `voçe ganhou: <strong>${item.name}</strong> (${item.rarity})`
    ).join("<br>");
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