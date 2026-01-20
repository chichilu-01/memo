"use strict";

// ページ読み込み時に実行
window.addEventListener("DOMContentLoaded", function () {

    if (typeof localStorage === "undefined") {
        Swal.fire({
            title: "Memo app",
            text: "このブラウザはLocal Storage機能が実装されていません",
            type: "error",
            allowOutsideClick: false
        });
        return;
    }

    viewStorage();
    saveLocalStorage();
    selectTable();
    delLocalStorage();
    allClearLocalStorage();
    // [Version-up 5] Gọi hàm xử lý Event Delegation
    autoDelLocalStorage();
});


// 1. 保存（save）
function saveLocalStorage() {
    const save = document.getElementById("save");

    save.addEventListener("click", function (e) {
        e.preventDefault();

        const key = document.getElementById("textKey").value;
        const value = document.getElementById("textMemo").value;

        // Validation Check
        if (key === "" || value === "") {
            Swal.fire({
                title: "Memo app",
                html: "Key, Memoはいずれも必須です。",
                type: "error",
                allowOutsideClick: false
            });
            return;
        }

        // SweetAlert2 Confirm
        Swal.fire({
            title: "Memo app",
            html: "LocalStorageに<br>" +
                  "キー：" + key + "<br>" +
                  "メモ：" + value + "<br>" +
                  "を保存（save）しますか？",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            allowOutsideClick: false
        }).then(function(result) {
            if (result.value === true) {
                localStorage.setItem(key, value);
                viewStorage(); 
                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";
                Swal.fire({
                    title: "Memo app",
                    html: "LocalStorageに <br> キー：" + key + " <br> メモ：" + value + " <br> を保存（save）しました。",
                    type: "success",
                    allowOutsideClick: false
                });
            }
        });

    }, false);
}


// 2. 表示処理 [Version-up 5 Modified]
function viewStorage() {
    const list = document.getElementById("list");
    while (list.firstChild) list.removeChild(list.firstChild);

    for (let i = 0; i < localStorage.length; i++) {
        let w_key = localStorage.key(i);
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        // [Change 1] Tạo thêm td4
        let td4 = document.createElement("td");

        td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
        td2.textContent = w_key;
        td3.textContent = localStorage.getItem(w_key);
        // [Change 2] Thêm icon trash vào td4. 
        // Hãy chắc chắn bạn có file ảnh 'img/trash_icon.png' hoặc sửa đường dẫn cho đúng
        td4.innerHTML = "<img src='img/trash_icon.png' class='trash'>";

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        // [Change 3] Thêm td4 vào row
        tr.appendChild(td4);
        
        list.appendChild(tr);
    }

    $("#table1").tablesorter({
        sortList: [[1, 0]]
    });
    $("#table1").trigger("update");
}


// 3. チェックボックス選択
function selectTable() {
    const select = document.getElementById("select");
    select.addEventListener("click", function (e) {
        e.preventDefault();
        selectCheckBox("select");
    }, false);
}


// 選択行の Key / Memo をセット
function selectCheckBox(mode) {
    let w_cnt = 0;
    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");
    let w_textKey = "";
    let w_textMemo = "";

    for (let i = 0; i < chkbox1.length; i++) {
        if (chkbox1[i].checked) {
            if(w_cnt === 0) {
                w_textKey = table1.rows[i + 1].cells[1].textContent;
                w_textMemo = table1.rows[i + 1].cells[2].textContent;
            }
            w_cnt++;
        }
    }

    document.getElementById("textKey").value = w_textKey;
    document.getElementById("textMemo").value = w_textMemo;

    if (mode === "select") {
        if (w_cnt === 1) {
            return w_cnt;
        } else {
            Swal.fire({
                title: "Memo app",
                html: "1つ選択（select）してください。",
                type: "error",
                allowOutsideClick: false
            });
        }
    }

    if (mode === "del") {
        if (w_cnt >= 1) {
            return w_cnt;
        } else {
            Swal.fire({
                title: "Memo app",
                html: "1つ以上選択（select）してください。",
                type: "error",
                allowOutsideClick: false
            });
        }
    }
    
    return w_cnt;
}


// 4. 選択した行を削除 (Delete)
function delLocalStorage() {
    const del = document.getElementById("del");

    del.addEventListener("click", function (e) {
        e.preventDefault();
        
        const chkbox1 = document.getElementsByName("chkbox1");
        const table1 = document.getElementById("table1");
        let w_cnt = selectCheckBox("del");

        if (w_cnt >= 1) {
            Swal.fire({
                title: "Memo app",
                html: w_cnt + "件を削除（delete）しますか？",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                allowOutsideClick: false
            }).then(function(result) {
                if (result.value === true) {
                    for(let i = 0; i < chkbox1.length; i++) {
                        if(chkbox1[i].checked) {
                            let key = table1.rows[i+1].cells[1].textContent;
                            localStorage.removeItem(key);
                        }
                    }

                    viewStorage();
                    
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";

                    Swal.fire({
                        title: "Memo app",
                        html: "LocalStorageから" + w_cnt + "件を削除（delete）しました。",
                        type: "success",
                        allowOutsideClick: false
                    });
                }
            });
        }
    }, false);
}


// 5. 全件削除 (All Clear)
function allClearLocalStorage() {
    const allClear = document.getElementById("allClear");

    allClear.addEventListener("click", function (e) {
        e.preventDefault();

        Swal.fire({
            title: "Memo app",
            html: "LocalStorageのデータをすべて削除（all clear）します。<br>よろしいですか？",
            type: "question",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            allowOutsideClick: false
        }).then(function(result) {
            if (result.value === true) {
                localStorage.clear();
                viewStorage();
                document.getElementById("textKey").value = "";
                document.getElementById("textMemo").value = "";
                Swal.fire({
                    title: "Memo app",
                    html: "LocalStorageのデータをすべて削除しました。",
                    type: "success",
                    allowOutsideClick: false
                });
            }
        });

    }, false);
}

// [Version-up 5] Event Delegation Logic (Theo slide 9/11)
function autoDelLocalStorage() {
    const table1 = document.getElementById("table1");

    table1.addEventListener("click", function(e) {
        // Class "trash" chứa icon thùng rác
        if (e.target.classList.contains("trash")) {
            
            // Tìm tr cha
            let tr = e.target.parentNode.parentNode;
            
            // Lấy key (cell index 1)
            let key = tr.cells[1].textContent;
            let memo = tr.cells[2].textContent;

            // Xác nhận xóa
            Swal.fire({
                title: "Memo app",
                html: "LocalStorageから<br>" +
                      "キー：" + key + "<br>" +
                      "メモ：" + memo + "<br>" +
                      "を削除（delete）しますか？",
                type: "question",
                showCancelButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                allowOutsideClick: false
            }).then(function(result) {
                if (result.value === true) {
                    localStorage.removeItem(key);
                    viewStorage(); // Refresh table
                    
                    Swal.fire({
                        title: "Memo app",
                        html:"LocalStorageから<br>" +
                        "キー：" + key + "<br>" +
                        "メモ：" + memo + "<br>" + 
                        "を削除しました。",
                        type: "success",
                        allowOutsideClick: false
                    });
                }
            });
        }
    });
}