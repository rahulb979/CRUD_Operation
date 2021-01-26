// Next id for adding a new Product
var numRecords = 0;
var numAddedRecords = 0;
var numEditedRecords = 0;
var numDeletedRecords = 0;
var recordArray = new Array(
    ["Test1 First Name", "Test1 Last Name", 12, "Male", "Test1 Country"],
    ["Test2 First Name", "Test2 Last Name", 123, "Male", "Test2 Country"],
    ["Test3 First Name", "Test3 Last Name", 345, "Male", "Test3 Country"],
    ["Test4 First Name", "Test4 Last Name", 12, "Male", "Test4 Country"],
    ["Test5 First Name", "Test5 Last Name", 123, "Male", "Test5 Country"],
    ["Test6 First Name", "Test6 Last Name", 123, "Male", "Test6 Country"]
    );

var curPage = 1;
var pageSize = 5;

function updateSummary() {
    numRecords = recordArray.length;
    document.getElementById('numRecords').innerText = numRecords;
}

function getFormObject(arr) {
    var formData = {};
    formData["firstName"] = arr[0];
    formData["lastName"] = arr[1];
    formData["age"] = arr[2];
    formData["gender"] = arr[3];
    formData["country"] = arr[4];
    return formData;

}

function removeCurrentDisplay() {
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var rowCount = table.rows.length;
    for (var j = 0; j < rowCount; j++) {
        table.deleteRow(0);
    }
}


function displayRecords(pageNumber, pageSize) {
    removeCurrentDisplay();
    paginatedArr = paginate(recordArray, pageSize, pageNumber);
    for (var i = 0; i < paginatedArr.length; i++) {
        formObj = getFormObject(paginatedArr[i]);
        insertNewRecord((pageNumber-1)*pageSize+(i+1),formObj, false);
    }

}

function loadDefaultTableAndUpdateSummary() {
    updateSummary();
    displayRecords(curPage, pageSize);
}

function appendInArray(formData) {
    recordArray.push([formData.firstName, formData.lastName, formData.age, formData.gender, formData.country]);
}

function editInArray(formData, selectedRow) {
    var rowId = selectedRow.getAttribute("rowid");
    recordArray[rowId-1] = [formData.firstName, formData.lastName, formData.age, formData.gender, formData.country];
}

function validateFormData(formData) {
    if (isNaN(formData["age"]) || formData["age"] <=0 ) {
        return "Age should positve number";
    }

    if(formData['gender'] != "Male" && formData['gender'] != "Female" && formData['gender'] != "Other") {
        return "Gender can be Male or Female or Other";
    }    
}

var selectedRow = null;
function onFormSubmit(e){
    event.preventDefault();
    var formData = readFormData();
    var error = validateFormData(formData);
    if (error) {
        alert(error);
        resetForm();
        return;
    }

    if(selectedRow === null){
        appendInArray(formData);
        updateAddedRecord(true);
        displayRecords(curPage, pageSize);
    }else{
        editInArray(formData, selectedRow);
        updateEditedRecord(selectedRow);
        displayRecords(curPage, pageSize);
    }
    resetForm();
    }

// Read operation using this function
function readFormData(){
    var formData = {};
    formData["firstName"] = document.getElementById("firstName").value;
    formData["lastName"] = document.getElementById("lastName").value;
    formData["age"] = document.getElementById("age").value;
    formData["gender"] = document.getElementById("gender").value;
    formData["country"] = document.getElementById("country").value;
    return formData;
}

// Create operation
function insertNewRecord(rowid, data, fl){

    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    var cell1 = newRow.insertCell(0);
        cell1.innerHTML = "<div class=\"td1\">" + data.firstName + "</div";
    var cell2 = newRow.insertCell(1);
        cell2.innerHTML = "<div class=\"td1\">" + data.lastName + "</div";
    var cell3 = newRow.insertCell(2);
        cell3.innerHTML = "<div class=\"td1\">" + data.age + "</div";
    var cell4 = newRow.insertCell(3);
        cell4.innerHTML = "<div class=\"td1\">" + data.gender + "</div";
    var cell5 = newRow.insertCell(4);
        cell5.innerHTML = "<div class=\"td1\">" + data.country + "</div";
    var cell6 = newRow.insertCell(5);
        cell6.innerHTML = `<a href="#" onClick='onEdit(this)'>Edit</a>
                        <a href="#" onClick='onDelete(this)'>Delete</a>`;
    newRow.setAttribute("rowid", rowid);
    updateAddedRecord(fl);
}

// To Reset the data of fill input
function resetForm(){
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('country').value = '';
    selectedRow = null;
}

// For Edit operation
function onEdit(td){
    selectedRow = td.parentElement.parentElement;
    document.getElementById('firstName').value = selectedRow.cells[0].innerText;
    document.getElementById('lastName').value = selectedRow.cells[1].innerText;
    document.getElementById('age').value = selectedRow.cells[2].innerText;
    document.getElementById('gender').value = selectedRow.cells[3].innerText;
    document.getElementById('country').value = selectedRow.cells[4].innerText;
}
function updateRecord(formData){
    selectedRow.cells[0].innerHTML = "<div class=\"td1\">" + formData.firstName + "</div";
    selectedRow.cells[1].innerHTML = "<div class=\"td1\">" + formData.lastName + "</div";
    selectedRow.cells[2].innerHTML = "<div class=\"td1\">" + formData.age + "</div";
    selectedRow.cells[3].innerHTML = "<div class=\"td1\">" + formData.gender + "</div";
    selectedRow.cells[4].innerHTML = "<div class=\"td1\">" + formData.country + "</div";
    updateEditedRecord(selectedRow);
}


function onDelete(td){
    if(confirm('Are you sure you want to delete this record?')){
        var row = td.parentElement.parentElement;
        var rowId = row.getAttribute("rowid");
        console.log(row);
        removeFromArray(rowId-1);
        displayRecords(curPage,pageSize);
        // document.getElementById('employeeList').deleteRow(row.rowIndex);
        resetForm();
        updateDeleteRecord();
    }
}

function updateAddedRecord(fl) {
    if (!fl) {
        return;
    } 
    numAddedRecords+=1;
    numRecords+=1;
    document.getElementById('numAdded').innerText = numAddedRecords;
    document.getElementById('numRecords').innerText = numRecords;
}

function updateEditedRecord(selectedRow) {
    if (!selectedRow.getAttribute("edited")) {
        selectedRow.setAttribute("edited", true)
        numEditedRecords+=1;
        document.getElementById('numEdited').innerText = numEditedRecords;
    }
}

function updateDeleteRecord() {
    numDeletedRecords+=1;
    numRecords-=1;
    document.getElementById('numRecords').innerText = numRecords;
    document.getElementById('numDeleted').innerText = numDeletedRecords;
}

function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

function previousButtonClicked(){
    if (curPage <= 1) {
        return;
    }

    displayRecords(curPage-1, pageSize);
    updateCurPageValue(-1);
}

function nextButtonClicked() {
    if ( curPage > numRecords/pageSize) {
        return;
    }
    
    displayRecords(curPage+1, pageSize);
    updateCurPageValue(1);
}

function updateCurPageValue(offset) {
    curPage+=offset;
    document.getElementById('curPage').innerText = curPage;    
}

function removeFromArray(index) {
    recordArray.splice(index,1);
}

function updateTableRowCount(newPageSize) {
    pageSize = newPageSize;
    curPage = 1;
    displayRecords(curPage, pageSize);
}

function searchWithFirstName() {

}
