// API URL từ Apps Script
const apiUrl = 'https://script.google.com/macros/s/AKfycbzU3Zi3S3yLVqk1KgvEPDbOckJiSajU77q7qMCBYsZVJKeNtVgOnfwmyLTdrbxc7ojo/exec';

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Gắn sự kiện cho nút Add
    document.getElementById('addBtn').addEventListener('click', addData);

    // Gắn sự kiện cho nút Save khi chỉnh sửa
    document.getElementById('saveBtn').addEventListener('click', saveEdit);

    // Gắn sự kiện cho nút Cancel khi chỉnh sửa
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
});

// Tải dữ liệu từ Google Sheet
async function loadData() {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getData' })
        });
        const { data } = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Hiển thị dữ liệu trong bảng HTML
// Biến toàn cục để lưu dữ liệu
let data = [];
let currentEditId = null;

// Hàm hiển thị dữ liệu lên bảng
function renderTable() {
    const tableBody = document.getElementById("dataTableBody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    data.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.name}</td>
            <td>${row.amount}</td>
            <td>${row.category}</td>
            <td>
                <button onclick="editData(${index})">Edit</button>
                <button onclick="deleteData(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Hàm thêm dữ liệu
function addData() {
    const name = document.getElementById("name").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const category = document.getElementById("category").value.trim();

    if (!name || !amount || !category) {
        alert("All fields are required!");
        return;
    }

    data.push({ name, amount: parseFloat(amount), category });
    renderTable();

    // Xóa dữ liệu sau khi thêm
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
}

// Hàm sửa dữ liệu
function editData(index) {
    const item = data[index];
    currentEditId = index;

    // Hiển thị thông tin cũ lên form edit
    document.getElementById("editId").value = index;
    document.getElementById("editName").value = item.name;
    document.getElementById("editAmount").value = item.amount;
    document.getElementById("editCategory").value = item.category;

    // Ẩn form thêm và hiển thị form sửa
    document.getElementById("addSection").style.display = "none";
    document.getElementById("editSection").style.display = "block";
}

// Hàm lưu dữ liệu sau khi sửa
function saveData() {
    const index = parseInt(document.getElementById("editId").value, 10);
    const name = document.getElementById("editName").value.trim();
    const amount = document.getElementById("editAmount").value.trim();
    const category = document.getElementById("editCategory").value.trim();

    if (!name || !amount || !category) {
        alert("All fields are required!");
        return;
    }

    // Cập nhật dữ liệu
    data[index] = { name, amount: parseFloat(amount), category };
    renderTable();

    // Reset form
    cancelEdit();
}

// Hàm hủy sửa
function cancelEdit() {
    document.getElementById("addSection").style.display = "block";
    document.getElementById("editSection").style.display = "none";
    document.getElementById("editId").value = "";
    document.getElementById("editName").value = "";
    document.getElementById("editAmount").value = "";
    document.getElementById("editCategory").value = "";
}

// Hàm xóa dữ liệu
function deleteData(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
        data.splice(index, 1);
        renderTable();
    }
}

// Gắn sự kiện vào các nút
document.getElementById("addBtn").addEventListener("click", addData);
document.getElementById("saveBtn").addEventListener("click", saveData);
document.getElementById("cancelEditBtn").addEventListener("click", cancelEdit);

