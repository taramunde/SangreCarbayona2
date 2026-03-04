/* ── State ── */
let currentId = null;
let data = { categories: [] };

const DEFAULT_CATS = [
    "Lácteos", "Panadería", "Bebidas", "Fruta y Verdura",
    "Carne y Pescado", "Snacks", "Despensa", "Otros"
];

/* ── Helpers ── */
function generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function encodeData(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function decodeData(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
}

function getShareUrl() {
    return window.location.origin + window.location.pathname + "?lista=" + encodeData(data);
}

/* ── Storage ── */
function saveData() {
    if (!currentId) return;
    try { localStorage.setItem("shoplist_" + currentId, JSON.stringify(data)); } catch (e) {}
}

function loadData(id) {
    currentId = id;
    let saved = null;
    try { saved = localStorage.getItem("shoplist_" + id); } catch (e) {}
    data = saved
        ? JSON.parse(saved)
        : { categories: DEFAULT_CATS.map(name => ({ name, items: [] })) };
    saveData();
}

/* ── Render ── */
function renderCategories() {
    const container = document.getElementById("categories-list");
    container.innerHTML = "";

    data.categories.forEach((cat, catIdx) => {
        const pending = cat.items.filter(i => !i.checked).length;

        const section = document.createElement("div");
        section.className = "category-section";

        // Header
        const header = document.createElement("div");
        header.className = "category-header";
        header.innerHTML = `
            <div class="category-title">
                <span>📦</span>
                <h3>${escHtml(cat.name)}</h3>
                <span class="category-count">${pending} pendiente${pending !== 1 ? "s" : ""}</span>
            </div>
            <button class="btn-add-item" onclick="openAddModal(${catIdx})">+ item</button>
        `;
        section.appendChild(header);

        // Items
        const itemsDiv = document.createElement("div");

        if (cat.items.length === 0) {
            itemsDiv.innerHTML = `<div class="empty-cat">vacío — añade un producto</div>`;
        } else {
            cat.items.forEach((item, itemIdx) => {
                const subtotal = (item.price * item.qty).toFixed(2);
                const row = document.createElement("div");
                row.className = "item-row";
                row.innerHTML = `
                    <input type="checkbox" class="item-check" ${item.checked ? "checked" : ""}
                        onchange="toggleCheck(${catIdx}, ${itemIdx}, this.checked)">
                    <div class="item-info">
                        <div class="item-name ${item.checked ? "done" : ""}">${escHtml(item.name)}</div>
                        <div class="item-detail">${item.qty} × $${parseFloat(item.price).toFixed(2)}</div>
                    </div>
                    <div class="item-price ${item.checked ? "done" : ""}">$${subtotal}</div>
                    <button class="btn-delete" onclick="deleteItem(${catIdx}, ${itemIdx})" title="Eliminar">×</button>
                `;
                itemsDiv.appendChild(row);
            });
        }

        section.appendChild(itemsDiv);
        container.appendChild(section);
    });

    updateGrandTotal();
}

function updateGrandTotal() {
    let total = 0;
    data.categories.forEach(cat => {
        cat.items.forEach(item => { if (!item.checked) total += item.price * item.qty; });
    });
    document.getElementById("grand-total").textContent = "$" + total.toFixed(2);
}

/* ── Actions ── */
function toggleCheck(catIdx, itemIdx, checked) {
    data.categories[catIdx].items[itemIdx].checked = checked;
    saveData();
    renderCategories();
}

function deleteItem(catIdx, itemIdx) {
    if (!confirm("¿Eliminar este producto?")) return;
    data.categories[catIdx].items.splice(itemIdx, 1);
    saveData();
    renderCategories();
}

function addCategory() {
    const name = prompt("Nombre de la nueva categoría:");
    if (name && name.trim()) {
        data.categories.push({ name: name.trim(), items: [] });
        saveData();
        renderCategories();
    }
}

/* ── Item Modal ── */
function openAddModal(catIdx) {
    if (catIdx === undefined) catIdx = 0;

    const select = document.getElementById("modal-category");
    select.innerHTML = "";
    data.categories.forEach((cat, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = cat.name;
        if (i === catIdx) opt.selected = true;
        select.appendChild(opt);
    });

    document.getElementById("modal-name").value = "";
    document.getElementById("modal-price").value = "";
    document.getElementById("modal-qty").value = "1";
    document.getElementById("item-modal").classList.remove("hidden");
    setTimeout(() => document.getElementById("modal-name").focus(), 100);
}

function hideItemModal() {
    document.getElementById("item-modal").classList.add("hidden");
}

function saveModalItem() {
    const catIdx = parseInt(document.getElementById("modal-category").value);
    const name   = document.getElementById("modal-name").value.trim();
    const price  = parseFloat(document.getElementById("modal-price").value) || 0;
    const qty    = parseInt(document.getElementById("modal-qty").value) || 1;

    if (!name) { alert("Ponle un nombre al producto"); return; }

    data.categories[catIdx].items.push({ name, price, qty, checked: false });
    saveData();
    hideItemModal();
    renderCategories();
}

function addItemGlobal() { openAddModal(0); }

/* ── Share Modal ── */
function showShare() {
    const url = getShareUrl();
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(url);
    document.getElementById("qr-code-img").src = qrUrl;
    document.getElementById("share-modal").classList.remove("hidden");
}

function hideShareModal() {
    document.getElementById("share-modal").classList.add("hidden");
}

function copyShareableLink() {
    const url = getShareUrl();
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url)
            .then(() => alert("✅ ¡Enlace copiado! Pégalo donde quieras."))
            .catch(() => prompt("Copia este enlace:", url));
    } else {
        prompt("Copia este enlace:", url);
    }
}

/* ── Navigation ── */
function createNewList() {
    currentId = generateId();
    loadData(currentId);
    showMainScreen();
}

function showMainScreen() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
    renderCategories();
}

function logout() {
    if (confirm("¿Salir de esta lista? Los datos quedan guardados en este dispositivo.")) {
        location.reload();
    }
}

/* ── Backdrop close ── */
function backdropClose(event, modalId) {
    if (event.target === event.currentTarget) {
        document.getElementById(modalId).classList.add("hidden");
    }
}

/* ── Keyboard shortcuts ── */
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        hideItemModal();
        hideShareModal();
    }
});

document.getElementById("modal-name").addEventListener("keydown", e => {
    if (e.key === "Enter") saveModalItem();
});

/* ── Init ── */
window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const lista = params.get("lista");

    if (lista) {
        try {
            data = decodeData(lista);
            currentId = generateId();
            saveData();
            history.replaceState(null, null, window.location.pathname);
            showMainScreen();
        } catch (e) {
            alert("El enlace no es válido o está dañado.");
        }
    }
    // Si no hay parámetro, se queda en la pantalla de login (comportamiento por defecto)
};
