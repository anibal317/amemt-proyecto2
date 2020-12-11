window.addEventListener("load", () =>{
    createRow(itemsTable);
    resetFilters();
    filter.addEventListener("click", filters);

    listFilters.addEventListener("click", () => inputSearch.value = "")

    btnBuscar.addEventListener("click", () => {
        isFiltered = true;
        if (listFilters.value === "selectAction" || inputSearch.value==="") {
            alert("Debes seleccionar un filtro");
        } else {
            arrFiltered = generalSearch(listFilters.value,inputSearch.value);
            createRow(arrFiltered);
        }
    });
    
})

