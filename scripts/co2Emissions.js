// Daten aus JSON-Datei laden
async function getJsonData() {
  const response = await fetch("../resources/data/co2Emissions.json");
  return await response.json();
}

function populateTable(data) {
  const tableBody = document.querySelector("#tbody");

  // Tabelleninhalt leeren
  while (tableBody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Zeilen erstellen und der Tabelle hinzufügen
  data.items.forEach((item, index) => {
    const row = document.createElement("tr");

    ["index", "company", "country", "emissions"].forEach((key) => {
      const cell = document.createElement("td");
      cell.textContent = key === "index" ? index + 1 : item[key];
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
}

function populateCountrySelector(data) {
  const select = document.querySelector("#countrySelector");
  const countries = Array.from(
    new Set(data.items.map((item) => item.country))
  ).sort((a, b) => b - a);

  const option = document.createElement("option");
  option.value = "Alle Länder";
  option.textContent = option.value;
  select.appendChild(option);

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = option.value;
    select.appendChild(option);
  });
}

async function filterByCountry(data, countryFilter) {
  if (countryFilter !== "Alle Länder") {
    data.items = data.items.filter((item) => item.country === countryFilter);
  }
}

async function filterByCompany(data, companyFilter) {
  if (companyFilter !== "") {
    data.items = data.items.filter((item) =>
      item.company.toLowerCase().includes(companyFilter.toLowerCase())
    );
  }
}

function sanitizeInput(input) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '/': '&#47;',
    '\\': '&#92;'
  };
  return input.replace(/[&<>"'`\/\\]/g, (match) => map[match]);
}

async function handleFilter(data) {
  const countryFilter = document.getElementById("countrySelector").value;
  const companyFilter = sanitizeInput(
    document.getElementById("companyFilter").value
  );

  filterByCountry(data, countryFilter);
  filterByCompany(data, companyFilter);
}

async function sortByCompanyCol(data, changeSortMode) {
  const companyCol = document.getElementById("companyCol");
  let sortOrder = companyCol.getAttribute("data-sort-order") || "sortAsc";

  if (changeSortMode) {
    sortOrder = sortOrder === "sortAsc" ? "sortDesc" : "sortAsc";
    companyCol.setAttribute("data-sort-order", sortOrder);
  }

  data.items.sort((a, b) =>
    sortOrder === "sortAsc"
      ? b.company.localeCompare(a.company)
      : a.company.localeCompare(b.company)
  );
}

async function sortByCountryCol(data, changeSortMode) {
  const countryCol = document.getElementById("countryCol");
  let sortOrder = countryCol.getAttribute("data-sort-order") || "sortAsc";

  if (changeSortMode) {
    sortOrder = sortOrder === "sortAsc" ? "sortDesc" : "sortAsc";
    countryCol.setAttribute("data-sort-order", sortOrder);
  }

  data.items.sort((a, b) =>
    sortOrder === "sortAsc"
      ? b.country.localeCompare(a.country)
      : a.country.localeCompare(b.country)
  );
}

async function sortByEmissionCol(data, changeSortMode) {
  const emissionColumn = document.getElementById("emissionCol");
  let sortOrder = emissionColumn.getAttribute("data-sort-order") || "sortAsc";

  if (changeSortMode) {
    sortOrder = sortOrder === "sortAsc" ? "sortDesc" : "sortAsc";
    emissionColumn.setAttribute("data-sort-order", sortOrder);
  }

  data.items.sort((a, b) =>
    sortOrder === "sortAsc"
      ? b.emissions - a.emissions
      : a.emissions - b.emissions
  );
}

async function handleSort(data, sortColId) {
  let changeSortMode = true;
  const thead = document.getElementById("thead");

  if (!sortColId) {
    sortColId = thead.getAttribute("data-sort-col");
    changeSortMode = false;
  } else {
    thead.setAttribute("data-sort-col", sortColId);
  }

  if (sortColId === "companyCol") {
    sortByCompanyCol(data, changeSortMode);
  } else if (sortColId === "countryCol") {
    sortByCountryCol(data, changeSortMode);
  } else {
    sortByEmissionCol(data, changeSortMode);
  }
}

async function handleFilterAndSort(data, sortColId) {
  const tempData = structuredClone(data);
  handleFilter(tempData);
  handleSort(tempData, sortColId);

  populateTable(tempData);
}

getJsonData().then((data) => {
  populateCountrySelector(data);
  handleFilterAndSort(data);

  // Event-Listener für Benutzerinteraktionen
  document
    .getElementById("countrySelector")
    .addEventListener("change", () => handleFilterAndSort(data));

  document
    .getElementById("companyFilter")
    .addEventListener("input", () => handleFilterAndSort(data));

  document
    .getElementById("companyCol")
    .addEventListener("click", () => handleFilterAndSort(data, "companyCol"));

  document
    .getElementById("countryCol")
    .addEventListener("click", () => handleFilterAndSort(data, "countryCol"));

  document
    .getElementById("emissionCol")
    .addEventListener("click", () => handleFilterAndSort(data, "emissionCol"));
});
