let isFiltered = false;
let arrFiltered = [];




function resetFilters() {
    inputSearch.value = "";
    listFilters.value = "selectAction";
    isFiltered = false;
    createRow(itemsTable);
}

function createRow(itemsTable) {
    tbody.innerHTML = ""
    let insertData = (itemsTable, index) => {
        let tr = document.createElement("tr");
        let tdinicio = document.createElement("td");
        let tdanio = document.createElement("td");
        let tdfin = document.createElement("td");
        let tdacciones = document.createElement("td");
        let th = document.createElement("th");
        let deleteIcon = document.createElement("i");
        let editIcon = document.createElement("i");
        let separador = document.createTextNode(" - ");

        th.setAttribute("scope", "row");
        th.innerHTML = itemsTable.mes;
        tr.appendChild(th);

        tdanio.innerHTML = itemsTable.anio;
        tr.appendChild(tdanio);

        tdinicio.innerHTML = itemsTable.start;
        tr.appendChild(tdinicio);

        tdfin.innerHTML = itemsTable.end;
        tr.appendChild(tdfin);

        deleteIcon.setAttribute("class", "far fa-trash-alt");
        deleteIcon.setAttribute("data-action", "loadDelete");
        deleteIcon.setAttribute("data-target", "#deleteModal");
        deleteIcon.setAttribute("data-toggle", "modal");
        deleteIcon.setAttribute("data-id", index);
        deleteIcon.setAttribute("data-internalId", itemsTable.id);

        editIcon.setAttribute("class", "far fa-edit");
        editIcon.setAttribute("data-action", "loadEdit");
        editIcon.setAttribute("data-target", "#editModal");
        editIcon.setAttribute("data-toggle", "modal");
        editIcon.setAttribute("data-id", index);
        editIcon.setAttribute("data-InternalId", itemsTable.id);

        tdacciones.appendChild(deleteIcon);
        tdacciones.appendChild(separador);
        tdacciones.appendChild(editIcon);

        tdacciones.setAttribute("class", "acciones");
        tr.appendChild(tdacciones);

        tbody.appendChild(tr);
        crearListeners();
    };

    for (let i = 0; i < itemsTable.length; i++) {
        insertData(itemsTable[i], i);
    }
}

filter.addEventListener("click", filters);

function filters() {
    showFilters.classList.toggle("filter-display-none");
    resetFilters();
}

function getIndexOf(arr,element){
    return arr.map(e => e.id).indexOf(element)
}

btnBuscar.addEventListener("click", () => {
    isFiltered = true;
    if (listFilters.value === "selectAction" || inputSearch.value==="") {
        alert("Debes seleccionar un filtro");
    } else {
        if(listFilters.value === "month"){
            arrFiltered = searchByMonth(inputSearch.value);
        }else{
            arrFiltered = searchByYear(inputSearch.value);
        }
        createRow(arrFiltered);
    }
});

listFilters.addEventListener("click", () => inputSearch.value = "")


function crearListeners() {
    for (let i = 0; i < btnEditElement.length; i++) {
        btnEditElement[i].removeEventListener("click", actions)
        btnEditElement[i].addEventListener("click", actions);
    };
}

function clearInputs() {
    month.value = '';
    year.value = '';
    initialAmount.value = '';
    finalAmount.value = '';
    editMonth.value = '';
}

function searchByMonth(condition) {
    return itemsTable.filter(item => item.mes.toLowerCase().includes(condition.toLowerCase()));
}

function searchByYear(condition) {
    return itemsTable.filter(item => item.anio.toLowerCase().includes(condition.toLowerCase()));
}

function orderArrById(itemsTable) {
    return itemsTable.sort((a, b) => a.id - b.id);
}

function btnModalDelete(id, internal_id) {
    document.getElementById("btnDelete").setAttribute("data-elemento", id);
    document.getElementById("btnDelete").setAttribute("data-internalid", internal_id);
}

function actions(e) {
    jQuery.noConflict();
    switch (e.target.dataset.action) {
        case "loadEdit":
            editMonth.value = itemsTable[getIndexOf(itemsTable,parseInt(e.target.dataset.internalid))].mes;
            editYear.value = itemsTable[getIndexOf(itemsTable,parseInt(e.target.dataset.internalid))].anio;
            editInitialAmount.value = itemsTable[getIndexOf(itemsTable,parseInt(e.target.dataset.internalid))].start;
            editFinalAmount.value = itemsTable[getIndexOf(itemsTable,parseInt(e.target.dataset.internalid))].end;
            document.getElementById("btnEdit").setAttribute("data-elemento", getIndexOf(itemsTable,parseInt(e.target.dataset.internalid)));
            break;
        case "edit":
            itemsTable[e.target.dataset.elemento].mes = editMonth.value;
            itemsTable[e.target.dataset.elemento].anio = editYear.value;
            itemsTable[e.target.dataset.elemento].start = editInitialAmount.value;
            itemsTable[e.target.dataset.elemento].end = editFinalAmount.value;

            document.getElementById("btnEdit").setAttribute("data-elemento", e.target.dataset.id);
            createRow(itemsTable);

            mostrarCerrarBarrita(2);
            break;
        case "loadDelete":

            document.getElementById("data").innerText = itemsTable[e.target.dataset.id].mes;
            btnModalDelete(e.target.dataset.id, e.target.dataset.internalid);
            break;
        case "delete":

            itemsTable.splice(getIndexOf(itemsTable,e.target.dataset.internalid), 1);
            createRow(itemsTable);
            mostrarCerrarBarrita(2);
            resetFilters();
            createRow(itemsTable);
            break;
        case "add":

            let month = document.getElementById("month").value;
            let year = document.getElementById("year").value;
            let initialAmount = document.getElementById("initialAmount").value;
            let finalAmount = document.getElementById("finalAmount").value;
            
            itemsTable.push({
                id: itemsTable[itemsTable.length - 1].id + 1,
                mes: month,
                anio: parseInt(year),
                start: parseInt(initialAmount),
                end: parseInt(finalAmount)
            });

            createRow(itemsTable);
            mostrarCerrarBarrita(2);
            clearInputs();

        default:
            break;
    }
}

function mostrarCerrarBarrita(vueltas) {
    barrita.setAttribute("aria-valuenow", 0);
    barrita.style.width = `0%`;


    let tiempoFin = vueltas * 1000;
    let incremento = 100 / vueltas;
    // This function will be executed when you click the element
    // show the element you want to show
    jQuery("#progessBarModal").modal("show");

    // Set a timeout to hide the element again
    const intervalo = setInterval(function () {
        let value = parseInt(barrita.getAttribute("aria-valuenow"));

        if (value < parseInt(barrita.getAttribute("aria-valuemax"))) {

            value = value + incremento;
            barrita.setAttribute("aria-valuenow", value);
            barrita.style.width = `${value}%`;

        } else {

            clearInterval(intervalo);
            jQuery("#progessBarModal").modal("hide");

        }
    }, tiempoFin);
};

function showModal() {
    modal.classList.toggle("display-none");
}

createRow(itemsTable);
resetFilters();
