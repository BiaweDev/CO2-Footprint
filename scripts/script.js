async function getJsonData() {
  const response = await fetch("../resources/data/co2Emissions.json");
  return await response.json();
}

// Function to populate the table
function populateTable(data) {
  // Reference to the table body
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = "";

  data.items.forEach((item, index) => {
    const row = document.createElement("tr");

    // Create and append cells
    ["index", "company", "country", "emissions"].forEach((key) => {
      const cell = document.createElement("td");
      cell.textContent = key === "index" ? index + 1 : item[key];
      row.appendChild(cell);
    });

    // Append the row to the table body
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

function filterDataByCountry(data, country) {
  data.items = data.items.filter((item) => item.country === country);
}

function filterDataByCompany(data, company) {
  data.items = data.items.filter((item) =>
    item.company.toLowerCase().includes(company.toLowerCase())
  );
}

async function handleFilter() {
  const companyFilter = document.getElementById("companyFilter").value;
  const countryFilter = document.getElementById("countrySelector").value;

  const data = await getJsonData();

  filterByCountry(data, countryFilter);
  filterByCompany(data, companyFilter);

  // Sort the data by emissions
  data.items.sort((a, b) => b.emissions - a.emissions);

  populateTable(data);
}

async function filterByCountry(data, countryFilter) {
  if (countryFilter !== "Alle Länder") {
    filterDataByCountry(data, countryFilter);
  }
}

async function filterByCompany(data, companyFilter) {
  if (companyFilter !== "") {
    filterDataByCompany(data, companyFilter);
  }
}

async function sortByCompanyCol() {
  const data = await getJsonData();
  const companyCol = document.getElementById("companyCol");
  const sortOrder = companyCol.getAttribute("data-sort-order") || "sortAsc";

  const newSortOrder = sortOrder === "sortAsc" ? "sortDesc" : "sortAsc";
  companyCol.setAttribute("data-sort-order", newSortOrder);

  data.items.sort((a, b) =>
    newSortOrder === "sortAsc"
      ? b.company.localeCompare(a.company)
      : a.company.localeCompare(b.company)
  );

  populateTable(data);
}

async function sortByCountryCol() {
  const data = await getJsonData();
  const countryCol = document.getElementById("countryCol");
  const sortOrder = countryCol.getAttribute("data-sort-order") || "sortAsc";

  const newSortOrder = sortOrder === "sortAsc" ? "sortDesc" : "sortAsc";
  countryCol.setAttribute("data-sort-order", newSortOrder);

  data.items.sort((a, b) =>
    newSortOrder === "sortAsc"
      ? b.country.localeCompare(a.country)
      : a.country.localeCompare(b.country)
  );

  populateTable(data);
}

async function sortByEmissionCol() {
  const data = await getJsonData();
  const emissionColumn = document.getElementById("emissionCol");
  const sortOrder = emissionColumn.getAttribute("data-sort-order") || "sortAsc";

  const newSortOrder = sortOrder === "sortAsc" ? "sortDesc" : "sortAsc";
  emissionColumn.setAttribute("data-sort-order", newSortOrder);

  data.items.sort((a, b) =>
    newSortOrder === "sortAsc"
      ? b.emissions - a.emissions
      : a.emissions - b.emissions
  );

  populateTable(data);
}

getJsonData().then((data) => {
  populateCountrySelector(data);
  handleFilter();

  document
    .getElementById("countrySelector")
    .addEventListener("change", handleFilter);

  document
    .getElementById("companyFilter")
    .addEventListener("input", handleFilter);

  document
    .getElementById("companyCol")
    .addEventListener("click", sortByCompanyCol);

  document
    .getElementById("countryCol")
    .addEventListener("click", sortByCountryCol);

  document
    .getElementById("emissionCol")
    .addEventListener("click", sortByEmissionCol);
});
