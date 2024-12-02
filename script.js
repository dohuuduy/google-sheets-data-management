// API URL từ Apps Script
const apiUrl = 'https://script.google.com/macros/s/AKfycbwTaZfyZr834zutleId9HHfDulV8d2K6PdmY83IG4sQc9oYVtJwSymdCOUrkRbhKVV5/exec';

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
function renderTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    data.slice(1).forEach(row => {
        const [id, name, amount, category] = row;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${amount}</td>
            <td>${category}</td>
            <td>
                <button onclick="editData(${id})">Edit</button>
                <button onclick="deleteData(${id})">Delete</button>
            </td>`;
        tableBody.appendChild(tr);
    });
}

// Thêm dữ liệu mới
async function addData() {
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    if (!name || !amount || !category) {
        alert('Please fill in all fields');
        return;
    }

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'addData',
                data: { name, amount, category }
            })
        });
        alert('Data added successfully!');
        loadData();
    } catch (error) {
        console.error('Error adding data:', error);
    }
}

// Sửa dữ liệu
function editData(id) {
    const row = document.querySelector(`tr td:first-child:contains('${id}')`).parentNode;
    const name = row.children[1].textContent;
    const amount = row.children[2].textContent;
    const category = row.children[3].textContent;

    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editAmount').value = amount;
    document.getElementById('editCategory').value = category;

    document.getElementById('editSection').style.display = 'block';
    document.getElementById('addSection').style.display = 'none';
}

// Lưu thay đổi khi chỉnh sửa
async function saveEdit() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const amount = document.getElementById('editAmount').value;
    const category = document.getElementById('editCategory').value;

    if (!name || !amount || !category) {
        alert('Please fill in all fields');
        return;
    }

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'editData',
                data: { id, editName: name, editAmount: amount, editCategory: category }
            })
        });
        alert('Data updated successfully!');
        cancelEdit();
        loadData();
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

// Hủy chỉnh sửa
function cancelEdit() {
    document.getElementById('editSection').style.display = 'none';
    document.getElementById('addSection').style.display = 'block';
}

// Xóa dữ liệu
async function deleteData(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'deleteData',
                data: { deleteId: id }
            })
        });
        alert('Data deleted successfully!');
        loadData();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}
