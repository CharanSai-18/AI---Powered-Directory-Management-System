let categories = {
    Images: [],
    Documents: [],
    Videos: [],
    Others: []
};

function saveData() {
    localStorage.setItem("fileCategories", JSON.stringify(categories));
}

function loadData() {
    const saved = localStorage.getItem("fileCategories");
    if (saved) categories = JSON.parse(saved);
}

function categorizeFile(file) {
    const type = file.type;

    if (type.startsWith("image")) return "Images";
    if (type.includes("pdf") || type.includes("text") || type.includes("word"))
        return "Documents";
    if (type.startsWith("video")) return "Videos";
    return "Others";
}

function uploadFiles() {
    const inputFiles = document.getElementById("fileInput").files;
    handleFiles(Array.from(inputFiles));
}

function handleFiles(files) {
    files.forEach(file => {
        const cat = categorizeFile(file);

        categories[cat].push({
            name: file.name,
            url: URL.createObjectURL(file)
        });
    });

    saveData();
    displayCategories();
}

function displayCategories() {
    const container = document.getElementById("categories");
    container.innerHTML = "";

    for (let cat in categories) {
        let div = document.createElement("div");
        div.className = "category-box";
        div.innerHTML = `<h3>${cat}</h3>`;

        categories[cat].forEach((file, index) => {
            div.innerHTML += `
            <div class="file-item">
                <span>📄 ${file.name}</span>
                <div>
                    <button class="action-btn open-btn" onclick="openPreview('${file.url}')">Open</button>
                    <button class="action-btn delete-btn" onclick="deleteFile('${cat}', ${index})">Delete</button>
                </div>
            </div>`;
        });

        container.appendChild(div);
    }
}

/* OPEN FILE IN MODAL */
function openPreview(url) {
    document.getElementById("modal").style.display = "block";
    document.getElementById("previewFrame").src = url;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

/* DELETE FILE */
function deleteFile(cat, index) {
    categories[cat].splice(index, 1);
    saveData();
    displayCategories();
}

/* SEARCH FILES */
function searchFiles() {
    const query = document.getElementById("searchInput").value.toLowerCase();

    document.querySelectorAll(".file-item").forEach(item => {
        const name = item.innerText.toLowerCase();
        item.style.display = name.includes(query) ? "flex" : "none";
    });
}

/* DRAG & DROP */
function dragOverHandler(e) {
    e.preventDefault();
}

function dropHandler(e) {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
}

/* INIT */
loadData();
window.onload = displayCategories;
