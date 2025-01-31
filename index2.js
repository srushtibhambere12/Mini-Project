$(document).ready(function () {
  const columnsToDisplay = [
    "AccountNumber",
    "AccountID",
    "AccountName",
    "Email",
    "Ownership",
    "CreatedTime",
    "Telephone",
    "Action",
  ];
  let data = [];
  let currentPage = 1;
  let pageSize = 10;
  let currentSortColumn = null;
  let currentSortOrder = "asc";
  let searchQuery = {};
  let timer = null;
  const accountNameFilter = "AccountName,sw,a"; 

   // Debounce Function Definition
   function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // ShowLoading
  function showOverlayLoading() {
    $('#table-body').hide();
    $("#pagination-controls").hide();
    $("#loading-overlay").css("display","flex");
  }

  // HideLoading
  function hideOverlayLoading() {
    $('#table-body').show();
    $("#pagination-controls").show();
    $("#loading-overlay").css("display", "none");
  }

  // Data fetched by url
  function fetchData(page = null, size = null, searchQuery = {}) {
    try {
      page = !page ? 1 : page;
      size = !size ? 10 : size;

      // extract the value from Object Data
      const searchParams = Object.entries(searchQuery)
      .map(([key, value]) => `${value}`) 
      .join(";");

      // Initial filter for AccountName to start with 'a'
      const combinedFilter = searchParams
        ? `${accountNameFilter};${searchParams}`
        : accountNameFilter;

      showOverlayLoading();

      const url = `https://360logicasb17mysqli.agiliron.net/agiliron/api-40/Accounts?filter=${combinedFilter}&page=${page}&pageSize=${size}&key=j0hlKhSfnAXFxPtqPQehzKmonTmbtShgF8ObV0bI9gw,`;
      $.ajax({
        url: url,
        type: "GET",
        headers: { "content-type": "application/json" },
        success: function (response) {
          const accountData = response.Accounts?.Account;
          if (accountData && Array.isArray(accountData)) {
            data = accountData;
            currentPage = page;
            renderTableRows(data);
            setUpPagination(response.Accounts.TotalRecords, size);
          } else {
            $("#table-body").html(
              "<tr><td colspan='6'>No data available</td></tr>"
            );
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching data:", error);
          $("#table-body").html(
            "<tr><td colspan='6'>Error fetching data</td></tr>"
          );
        },
        complete: hideOverlayLoading,
      });
    } catch (error) {
      console.log("Error :", error);
    }
  }

  // Display Header and Search 
  function renderHeaderAndSearch() {
    try {
      const headerRow = columnsToDisplay
        .map(
          (column) => 
              `<th data-column = "${column}" class="${
              currentSortColumn === column ? currentSortOrder : ""
              }">${column}</th>`  
            )
            .join("");

      const searchRow = columnsToDisplay
        .map(
          (column) => {
            if (column === "Action") {
              return `<th style="pointer-events: none;"></th>`
            } 
            return  `<th><input type="text" class="search-input" data-column="${column}" placeholder="Search..."/></th>`
          }
            
        )
      .join("");

      $("#table-header").html(headerRow);
      $("#search-row").html(searchRow);

      //   Sorting the data
      $("th").on("click", function () {
        const column = $(this).data("column");
        sortTable(column);
      });
    } catch(error) {
      console.log("Error : ", error);
    }
  }

  // Event listener for search input
  $(document).on("input", ".search-input", function () {
    clearTimeout(timer);
   try {
    timer = setTimeout(() => {
      const column = $(this).data("column");
      const value = $(this).val().trim();

      // Change the search query based on the column and input value
      if (value) {
        searchQuery[column] = `${column},cs,${encodeURIComponent(value)}`;
      } else {
        delete searchQuery[column]; 
      }

      // Check if all search inputs are empty
      const allInputsEmpty = $(".search-input").toArray().every((input) => $(input).val().trim() === "");
      if (allInputsEmpty) {
        showOverlayLoading();
        searchQuery = {}; 
       fetchData(currentPage, pageSize); 
      } 
      else {
        fetchData(1, pageSize, searchQuery); 
      }
    }, 1000)
   } catch(error) {
    console.log("Error :", error)
   }
  });

  // render data into rows
  function renderTable(data) {
    try {
      const paginatedData = data;
      const rows = paginatedData
        .map((item) => {
          return `<tr>${columnsToDisplay
            .map((column) => `<td>${item[column] || "N/A"}</td>`)
            .join("")}</tr>`;
        })
        .join("");
        $("#table-body").html(rows);
    } catch (error) {
      console.log("Error :", error);
    }
  }

  function renderTableRows(filteredData) {
    try {
      const rows = filteredData
        .map((item) => {
          return `
          <tr>
            ${columnsToDisplay.map((column) =>{
                if (column === "Action"){
                  return `
                    <td>
                      <button class="view-btn" data-id="${item.AccountID}"><i class="fa-regular fa-eye"></i></button>
                      <button class="edit-btn" data-id="${item.AccountID}"><i class="fa-solid fa-pen-to-square"></i></button>
                    </td>
                  `
                } else {
                  return `<td>${item[column] || "N/A"}</td>`;
                }
              }).join('')
            }
          </tr>
        `;
        }).join("");

      if (rows) {
        $("#table-body").html(rows);
      } else {
        $("#table-body").html("<tr><td colspan='6'>No matching data</td></tr>");
      }

      // View Data
      $(".view-btn").on("click", function () {
        const accountId = $(this).data("id");
        window.location.href = `viewDetail.html?id=${accountId}`;
      });

      // Edit Data
      $(".edit-btn").on("click", function() {
        const accountId = $(this).data("id");
        window.location.href = `viewDetail.html?id=${accountId}`
      });

    } catch (error) {
      console.log("Error :", error);
    }
  }

  // function for sorting
  function sortTable(column) {
    try {
        if (column === "Action") {
          return;
        }
        else {
          if (currentSortColumn === column) {
            currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
          } else {
            currentSortColumn = column;
            currentSortOrder = "asc";
          }
        }
      
        // Sort the data
        data.sort((a, b) => {
          const valueA = a[column] || "";
          const valueB = b[column] || "";

          if (currentSortOrder === "asc") {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
          } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
          }
        });
        renderTable(data);
    } catch (error) {
        console.log("Error : ", error);
    }
  }

  // Set up pagination controls
  function setUpPagination(totalRecords, size) {
    try {
      console.log('testing');
      const totalPages = Math.ceil(totalRecords / size);
      $("#pagination-controls").html("");
      for (let i = 1; i <= totalPages; i++) {
        const button = `<button class="page-btn" data-page="${i}">${i}</button>`;
        $("#pagination-controls").append(button);
      }

      // Handle page button clicks
      $(".page-btn").off("click").on("click", function () {
        $(".page-btn").removeClass("active");
        $(this).addClass("active");
        const selectedPage = parseInt($(this).data("page"));
        currentPage = selectedPage;
        fetchData(currentPage, pageSize,searchQuery);
      });

      $(`.page-btn[data-page="${currentPage}"]`).addClass("active");

      // Handle page-size Dropdown change
      $("#page-size-dropdown").off("change").on("change", debounce (function () {
        console.log('testing2', parseInt($(this).val()));
        pageSize = parseInt($(this).val());
        currentPage = 1;
        fetchData(currentPage, pageSize,searchQuery);
      },300));
    } catch (error) {
      console.log("Error :", error);
    }
  }

  renderHeaderAndSearch();
  clearTimeout(this.timer);
  timer = setTimeout(() => {
    fetchData(currentPage, pageSize,{ "AccountName": "AccountName,sw,a" },searchQuery);
  }, 1000)

});
