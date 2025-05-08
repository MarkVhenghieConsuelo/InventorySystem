loadProductData(); 

function loadProductData(){
    const API_URL = 'https://localhost:7150/api/Product'; // update this
    const rowsPerPage = 10;
    let currentPage = 1;
    let products = [];

    function fetchProducts() {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                products = data;
                renderTable();
                renderPagination();
            })
            .catch(err => console.error("Fetch error:", err));
    }

    function renderTable() {
        const tbody = document.querySelector("#productTable tbody");
        tbody.innerHTML = "";

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = products.slice(start, end);

        paginatedItems.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.productName}</td>
                <td>${product.productDescription}</td>
                <td>${product.productPrice}</td>
                <td>${product.productQty}</td>
                <td>${product.productCategory || ''}</td>
            `;
            tbody.appendChild(row);
        });
    }

    function renderPagination() {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";
        const pageCount = Math.ceil(products.length / rowsPerPage);

        // Previous button
        pagination.innerHTML += `
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `;

        // Numbered pages
        for (let i = 1; i <= pageCount; i++) {
            pagination.innerHTML += `
                <li class="page-item ${currentPage === i ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Next button
        pagination.innerHTML += `
            <li class="page-item ${currentPage === pageCount ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
            </li>
        `;

        // Click events
        document.querySelectorAll("#pagination .page-link").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const page = Number(e.target.getAttribute("data-page"));
                if (page >= 1 && page <= pageCount) {
                    currentPage = page;
                    renderTable();
                    renderPagination();
                }
            });
        });
    }

    // Init
    document.addEventListener("DOMContentLoaded", fetchProducts);

}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("productForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // ✅ prevents reload

        const data = {
            productName: form.productName.value,
            productDescription: form.productDescription.value,
            productQty: parseInt(form.productQty.value),
            productPrice: parseFloat(form.productPrice.value),
            productCategory: 1
        };

        fetch("https://localhost:7150/api/Product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            console.log("Product added", result);
            form.reset();
            loadProductData(); // refresh
        })
        .catch(err => {
            console.error("Error", err);
            alert("Something went wrong.");
        });
    });
});