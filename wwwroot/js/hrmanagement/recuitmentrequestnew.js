let steps = [];
let formDetail = [];
let id_Form;
let id_Station;
let flowSign = [];
const now = new Date();

const day = String(now.getDate()).padStart(2, "0");
const month = String(now.getMonth() + 1).padStart(2, "0");
const year = now.getFullYear();

const date = `${day}/${month}/${year}`;

const generateNo =
    "BS" +
    now
        .toISOString()
        .replace(/[-:T.Z]/g, "")
        .slice(2, 12);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generateNo").innerText = generateNo;
    document.getElementById("date").innerText = date;

    async function GetTable() {
        const param = [
            {
                name: "Parameter",
                value: {
                    Action: "GetFormByQrCode",
                    Data: {
                        QrCode: "DN-BS-NSM",
                    },
                },
            },
        ];

        const resultTable = await callApiHRM("USP_HR_LaborRelations", param);
        id_Form = resultTable[0].id_form;
        id_Station = resultTable[0].id_station;
        if (!resultTable || resultTable.length === 0) {
            console.error("id Form null");
            return;
        }

        GetProcess(id_Form);
        renderTable(resultTable);
    }

    async function GetProcess(idForm) {
        const param = [
            {
                name: "Parameter",
                value: {
                    Action: "GetProcessFlow",
                    Data: {
                        IdForm: idForm,
                        IdUser: "265",
                    },
                },
            },
        ];

        const resultProcesss = await callApiHRM("USP_HR_LaborRelations", param);
        const data = resultProcesss;

        buildSignFlowFromApi(data);

        console.log("process", resultProcesss);
        renderProcessTable(resultProcesss);
    }

    async function PostForm() {

        console.log("Form Detail before validation:", formDetail);
        const emptyRows = validateFormDetail(formDetail);

        if (emptyRows.length > 0) {
            alert("❌ Vui lòng nhập đầy đủ ở STT: " + emptyRows.join(", "));
            formDetail = [];
            emptyRows = [];
            return;
        }

        const param = [
            {
                name: "Parameter",
                value: {
                    Action: "CreateForm",
                    Data: {
                        Code: generateNo,
                        CreatedBy: "265",
                        IdForm: id_Form,
                        IdStation: id_Station,
                        FormDetail: formDetail,
                        SignFlow: flowSign,
                    },
                },
            },
        ];
        try {
            const resultProcesss = await callApiHRM("USP_HR_LaborRelations", param);
            console.log("FULL RESPONSE:", resultProcesss);
            const message = resultProcesss?.[0]?.message;

            if (message === "success") {
                alert("✅ Tạo đơn thành công");
                clearData();
            } else {
                alert("❌ " + (message || "Không tạo được dữ liệu"));
            }
        } catch (error) {
            console.log("system error", error);
            alert("❌ Lỗi hệ thống");
        }
    }
    function validateFormDetail(formDetail) {
        const emptyRows = [];

        formDetail.forEach((row, rowIndex) => {
            const hasEmpty = row.some(item => {
                const value = item.ValueContent;
                return value === null || value === undefined || value.toString().trim() === "";
            });

            if (hasEmpty) {
                emptyRows.push(rowIndex + 1); 
            }
        });

        return emptyRows;
    }

    //function renderTable(data) {
    //    const tableContainer = document.getElementById("tableContainer");

    //    // group theo category
    //    const categories = Object.values(
    //        data.reduce((acc, item) => {
    //            if (!acc[item.cate_num]) {
    //                acc[item.cate_num] = [];
    //            }
    //            acc[item.cate_num].push(item);
    //            return acc;
    //        }, {}),
    //    );

    //    categories.forEach((cate) => cate.sort((a, b) => a.sort - b.sort));

    //    steps = data.sort((a, b) => a.sort - b.sort);

    //    let html = `
    //<table class="table">
    //<thead>
    //  <tr>
    //        <th rowspan="2" class="text-center align-middle">STT</th>
    //`;

    //    // header tầng 1
    //    categories.forEach((cate, index) => {
    //        const isLast = index === categories.length - 1;
    //        html += `
    //        <th colspan="${cate.length + (isLast ? 1 : 0)}" >
    //            ${cate[0].cate_name}
    //        </th>
    //    `;
    //    });

    //    html += `
    //<th rowspan="2" class="text-center align-middle">Hành động</th>
    //</tr><tr>

    //`;

    //    // header tầng 2
    //    steps.forEach((step, index) => {
    //        html += `<th class="text-center align-middle p-1">${step.step_name} </th>`;

    //        if (index === steps.length - 1) {
    //            html += `<th class="text-center align-middle">Tổng</th>`;
    //        }
    //    });

    //    html += `</tr></thead><tbody id="tableBody">`;

    //    // body (1 row mẫu)
    //    html += `<tr><td class="text-center align-middle">1</td>`;

    //    steps.forEach((step) => {
    //        let type = "text";
    //        if (step.sort == 2 || step.sort == 11) type = "date";
    //        if (step.sort == 3) type = "text";

    //        let cssClass =
    //            step.sort == 6
    //                ? "auto-width"
    //                : step.sort >= 12
    //                    ? "fixed-width-salary"
    //                    : "fixed-width";

    //        const defaultValue = step.sort >= 12 ? "0" : "";
    //        if (step.sort == 2 || step.sort == 11) {
    //            html += `
    //            <td>
    //                <div class="input-group date-picker">
    //                    <input type="text"
    //                           data-sort="${step.sort}"
    //                           data-step="${step.sort}"
    //                           value="${defaultValue}"
    //                           placeholder="dd/MM/yyyy"
    //                           class="form-control form-control-sm ${cssClass}">
    //                    <span class="input-group-text">
    //                        <i class="fa-regular fa-calendar"></i>
    //                    </span>
    //                </div>
    //            </td>`;
    //                }
    //                // ✅ NORMAL COLUMNS
    //                else {
    //                    html += `
    //            <td>
    //                <input type="text"
    //                       data-sort="${step.sort}"
    //                       data-step="${step.sort}"
    //                       value="${defaultValue}"
    //                       class="form-control form-control-sm ${cssClass}">
    //            </td>`;
    //            initDatePicker();

    //        }
    //    });

    //    html += `
    //    <td class="total-cell text-center align-middle">0</td>
    //    <td>
    //        <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Xóa</button>
    //    </td>
    //</tr>`;

    //    html += `</tbody id="tableBody"></table></div>`;

    //    tableContainer.innerHTML = html;
    //}

    function renderTable(data) {
        const tableContainer = document.getElementById("tableContainer");

        const categories = Object.values(
            data.reduce((acc, item) => {
                if (!acc[item.cate_num]) {
                    acc[item.cate_num] = [];
                }
                acc[item.cate_num].push(item);
                return acc;
            }, {})
        );

        categories.forEach((cate) => cate.sort((a, b) => a.sort - b.sort));

        steps = data.sort((a, b) => a.sort - b.sort);

        let html = `
    <table class="table">
    <thead>
      <tr>  
        <th rowspan="2" class="text-center align-middle">STT</th>
    `;

        // header tầng 1
        categories.forEach((cate, index) => {
            const isLast = index === categories.length - 1;
            html += `
        <th colspan="${cate.length + (isLast ? 1 : 0)}">
            ${cate[0].cate_name}
        </th>
        `;
        });

        html += `
        <th rowspan="2" class="text-center align-middle">Hành động</th>
      </tr>
      <tr>
    `;

        // header tầng 2
        steps.forEach((step, index) => {
            html += `<th class="text-center align-middle p-1">${step.step_name}</th>`;

            if (index === steps.length - 1) {
                html += `<th class="text-center align-middle">Tổng</th>`;
            }
        });

        html += `</tr></thead><tbody id="tableBody">`;

        // body
        html += `<tr><td class="text-center align-middle">1</td>`;

        steps.forEach((step) => {

            let cssClass =
                step.sort == 6
                    ? "auto-width"
                    : step.sort >= 12
                        ? "fixed-width-salary"
                        : "fixed-width";

            const defaultValue = step.sort >= 12 ? "0" : "";

            // ✅ DATE COLUMN
            if (step.sort == 2 || step.sort == 11) {
                html += `
            <td>
                <div class="input-group date-picker">
                    <input type="text"
                           data-sort="${step.sort}"
                           data-step="${step.sort}"
                           value="${defaultValue}"
                           placeholder="dd/MM/yyyy"
                           class="form-control form-control-sm ${cssClass}">
                    <span class="input-group-text">
                        <i class="fa-regular fa-calendar"></i>
                    </span>
                </div>
            </td>`;
            }
            // ✅ NORMAL COLUMN
            else {
                html += `
            <td>
                <input type="text"
                       data-sort="${step.sort}"
                       data-step="${step.sort}"
                       value="${defaultValue}"
                       class="form-control form-control-sm ${cssClass}">
            </td>`;
            }
        });

        html += `
        <td class="total-cell text-center align-middle">0</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Xóa</button>
        </td>
    </tr>`;

        html += `</tbody></table>`;

        tableContainer.innerHTML = html;

        // ✅ INIT SAU KHI RENDER XONG
        initDatePicker();
    }

    const tableContainer = document.getElementById("tableContainer");

    tableContainer.addEventListener("input", function (e) {
        const input = e.target;
        if (input.tagName !== "INPUT") return;

        handleInput(input);
    });

    function handleInput(input) {
        const sort = parseInt(input.dataset.sort);

        if (sort == 3) {
            input.value = input.value.replace(/\D/g, "").slice(0, 12);

            // ❗ kiểm tra đủ 12 số
            if (input.value.length < 12) {
                input.style.border = "3px solid red";
            } else {
                input.style.border = "";
            }
        }

        // format số tiền
        if (sort >= 12) {
            formatNumber(input);
        }

        // tính total row
        calcRowTotal(input);

        // optional: total toàn bảng
        calcTableTotal();
    }

    function formatNumber(input) {
        let value = input.value.replace(/,/g, "").replace(/\D/g, "");

        if (!value) {
            input.value = "";
            return;
        }

        input.value = Number(value).toLocaleString("en-US");
    }

    function calcRowTotal(el) {
        const row = el.closest("tr");
        let sum = 0;

        row.querySelectorAll("[data-sort]").forEach((input) => {
            const sort = parseInt(input.dataset.sort);

            if (sort >= 12) {
                const val = parseFloat(input.value.replace(/,/g, "")) || 0;
                sum += val;
            }
        });

        const totalCell = row.querySelector(".total-cell");
        if (totalCell) {
            totalCell.innerText = sum.toLocaleString("en-US");
        }
    }

    function addRow() {
        const tbody = document.getElementById("tableBody");
        const rowCount = tbody.rows.length + 1;

        let newRow = `<tr>
    <td class="text-center align-middle">${rowCount}</td>`;

        steps.forEach((step) => {
            let cssClass =
                step.sort == 6
                    ? "auto-width"
                    : step.sort >= 12
                        ? "fixed-width-salary"
                        : "fixed-width";

            const defaultValue = step.sort >= 12 ? "0" : "";

            // ✅ CỘT DATE
            if (step.sort == 2 || step.sort == 11) {
                newRow += `
            <td>
                <div class="input-group date-picker">
                    <input type="text"
                           data-sort="${step.sort}"
                           data-step="${step.sort}"
                           value="${defaultValue}"
                            placeholder="dd/MM/yyyy"

                           class="form-control form-control-sm ${cssClass}">
                    <span class="input-group-text">
                        <i class="fa-regular fa-calendar"></i>
                    </span>
                </div>
            </td>`;
            }
            // ✅ CỘT BÌNH THƯỜNG
            else {
                newRow += `
            <td>
                <input type="text"
                       data-sort="${step.sort}"
                       data-step="${step.sort}"
                       value="${defaultValue}"
                       class="form-control form-control-sm ${cssClass}">
            </td>`;
            }
        });

        newRow += `
    <td class="total-cell text-center align-middle">0</td>
    <td class="text-center">
        <button class="btn btn-danger btn-sm" onclick="deleteRow(this)">Xóa</button>
    </td>
</tr>`;

        tbody.insertAdjacentHTML("beforeend", newRow);

        initDatePicker();
    }

    function initDatePicker() {
        document.querySelectorAll(".date-picker").forEach(wrapper => {
            const input = wrapper.querySelector("input");

            if (!input._flatpickr) {
                flatpickr(input, {
                    dateFormat: "d/m/Y",
                    allowInput: true,
                    clickOpens: true // click input mở calendar
                });
            }

            // click icon cũng mở calendar
            const icon = wrapper.querySelector(".input-group-text");
            if (icon) {
                icon.addEventListener("click", () => {
                    input._flatpickr.open();
                });
            }
        });
    }
    function deleteRow(btn) {
        const row = btn.closest("tr");
        row.remove();

        updateRowNumbers();
        calcTableTotal();
    }

    function updateRowNumbers() {
        document.querySelectorAll("#tableBody tr").forEach((row, index) => {
            row.children[0].innerText = index + 1;
        });
    }

    function renderProcessTable(data) {
        const tbody = document.getElementById("tableBodyProcess");

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center">No data</td></tr>`;
            return;
        }

        let html = "";

        data.forEach((item, index) => {
            html += `
        <tr>
            <td class="text-center">${index + 1}</td>
            <td class="text-center">${item.dept_name ?? ""}</td>
            <td class="text-center">${item.badgeID ?? ""}</td>
            <td class="text-center">${item.fullName ?? ""}</td>
            <td class="text-center">${item.emailStr ?? ""}</td>
        </tr>
        `;
        });

        tbody.innerHTML = html;
    }

    function buildFormDetail() {
        const rows = document.querySelectorAll("#tableBody tr");

        rows.forEach((row) => {
            let rowArray = [];

            row.querySelectorAll("input").forEach((input) => {
                const idStep = parseInt(input.dataset.step || input.dataset.sort);

                rowArray.push({
                    IdStep: idStep,
                    ValueContent: input.value || "",
                });
            });

            const totalCell = row.querySelector(".total-cell");
            const totalValue = totalCell
                ? totalCell.innerText.replace(/,/g, "")
                : "0";

            rowArray.push({
                IdStep: 23,
                ValueContent: totalValue,
            });

            formDetail.push(rowArray);
        });
        return formDetail;
    }

    function buildSignFlowFromApi(data) {
        flowSign = data.map((item, index) => ({
            IdUser: item.id_user,
            Level: item.level,
            Sequence: index + 1,
        }));
        return flowSign;
    }

    function submitData() {
        buildFormDetail();
        PostForm();
    }

    function clearData() {
        const inputs = document.querySelectorAll("#tableBody input");

        inputs.forEach((input) => {
            input.value = "";
        });

        // reset total
        document.querySelectorAll("#tableBody .total-cell").forEach((cell) => {
            cell.innerText = "";
        });
    }

    window.addRow = addRow;
    window.clearData = clearData;
    window.submitData = submitData;
    window.deleteRow = deleteRow;
    window.buildFormDetail = buildFormDetail;

    //   buildFormDetail();
    GetTable();
});
