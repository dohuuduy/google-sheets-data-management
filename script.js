const apiUrl = 'https://script.google.com/macros/s/AKfycbwTaZfyZr834zutleId9HHfDulV8d2K6PdmY83IG4sQc9oYVtJwSymdCOUrkRbhKVV5/exec'; // URL của Apps Script

// Lấy dữ liệu từ API
async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}?action=getData`);
        const result = await response.json();
        if (result.status === 'success') {
            renderTable(result.data);
        } else {
            Swal.fire('Error', 'Failed to fetch data', 'error');
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

// Hiển thị bảng dữ liệu
function renderTable(data) {
    if (!data || data.length === 0) {
        $('#dataTable').html('<p class="text-danger">No data found</p>');
        return;
    }

    let tableHtml = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach((row, index) => {
        tableHtml += `
            <tr>
                <td>${row.name}</td>
                <td>${row.amount}</td>
                <td>${row.category}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editRecord(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRecord('${row.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    tableHtml += '</tbody></table>';
    $('#dataTable').html(tableHtml);
}

// Thêm dữ liệu mới
async function addRecord() {
    const name = $('#name').val();
    const amount = $('#amount').val();
    const category = $('#category').val();

    const payload = { action: 'addData', data: JSON.stringify({ name, amount, category }) };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: new URLSearchParams(payload),
        });

        const result = await response.json();
        if (result.status === 'success') {
            Swal.fire('Success', 'Record added successfully', 'success');
            $('#dataForm')[0].reset();
            fetchData();
        } else {
            Swal.fire('Error', 'Failed to add record', 'error');
        }
    } catch (error) {
        console.error('Error adding record:', error.message);
    }
}

// Xóa bản ghi
async function deleteRecord(id) {
    Swal.fire({
        title: 'Confirm Deletion',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const payload = { action: 'deleteData', data: JSON.stringify({ id }) };
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: new URLSearchParams(payload),
                });
                const result = await response.json();
                if (result.status === 'success') {
                    Swal.fire('Success', 'Record deleted successfully', 'success');
                    fetchData();
                } else {
                    Swal.fire('Error', 'Failed to delete record', 'error');
                }
            } catch (error) {
                console.error('Error deleting record:', error.message);
            }
        }
    });
}

// Khởi chạy ứng dụng
$(document).ready(() => {
    fetchData();
    $('#btnAdd').click(addRecord);
});
