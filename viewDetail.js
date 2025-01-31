$(document).ready(function() {

  let accountId = getQueryParam('id');
  let accountData = {};

function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function showOverlayLoading() {
    $("#loading-overlay").css("display","flex");
}

function hideOverlayLoading() {
    $("#loading-overlay").css("display", "none");
}
  

function toggleInputFields(enable) {
  $("input,textarea, select").prop("disabled", !enable)
} 

  function fetchAccountData() {
    showOverlayLoading()
    $.ajax({
        url: `https://360logicasb17mysqli.agiliron.net/agiliron/api-40/Accounts?filter=AccountID,eq,${accountId}&key=j0hlKhSfnAXFxPtqPQehzKmonTmbtShgF8ObV0bI9gw,`,
        type: "GET",
        headers: { "content-type": "application/json" },
        success: function(response) {
          const accountData = response?.Accounts?.Account[0]
          console.log("accountData", accountData)
          if(accountData) {
            $("#AccountID").val(accountData.AccountID);
            $("#AccountNumber").val(accountData.AccountNumber);
            $("#ParentCompany").val(accountData.ParentCompany);
            $("#AccountName").val(accountData.AccountName);
            $("#Website").val(accountData.Website);
            $("#Telephone").val(accountData.Telephone);
            $("#Fax").val(accountData.Fax);
            $("#TicketSymbol").val(accountData.TicketSymbol);
            $("#OtherPhone").val(accountData.OtherPhone);
            $("#Email").val(accountData.Email);
            $("#Employees").val(accountData.Employees);
            $("#OtherEmail").val(accountData.OtherEmail);
            $("#OwnerShip").val(accountData.Ownership);
            $("#Rating").val(accountData.Rating);
            $("#Industry").val(accountData.Industry);
            $("#SICCode").val(accountData.SICCode);
            $("#Type").val(accountData.Type);
            $("#AnuualRevenue").val(accountData.AnuualRevenue);
            $("#SalesManager").val(accountData.SalesManager);
            $("#AssignedToUser").val(accountData.AssignedToUser);
            $("#CreatedTime").val(accountData.CreatedTime);
            $("#CreatedTimeUtc").val(accountData.CreatedTimeUTC);
            $("#ModifiedTime").val(accountData.ModifiedTime);
            $("#ModifiedTimeUTC").val(accountData.ModifiedTimeUTC);
            $("#TaxAuthority").val(accountData.TaxAuthority);
            $("#SalesArea").val(accountData.SalesArea);
            $("#SalesPerson").val(accountData.SalesPerson);
            $("#AccountStatus").val(accountData.AccountStatus);
            $("#Priority").val(accountData.Priority);
            $("#PaymentMethod").val(accountData.PaymentMethod);
            $("#TermsAndConditions").val(accountData.TermsAndConditions);
            $("#Carrier").val(accountData.Carrier);
            $("#ShippingMethod").val(accountData.ShippingMethod);
            $("#DeliverFrom").val(accountData.DeliverFrom);
            $("#BackorderHandling").val(accountData.BackorderHandling);
            $("#SpecialHandling").val(accountData.SpecialHandling);
            $("#BillingAddress").val(accountData.BillingAddress);
            $("#BillingSuburb").val(accountData.BillingSuburb);
            $("#BillingCity").val(accountData.BillingCity);
            $("#BillingPostcode").val(accountData.BillingPostCode);
            $("#BillingState").val(accountData.BillingState);
            $("#BillingCountry").val(accountData.BillingCountry);
            $("#ShippingAddress").val(accountData.ShippingAddress);
            $("#ShippingCity").val(accountData.ShippingCity);
            $("#ShippingPostcode").val(accountData.ShippingPostCode);
            $("#ShippingState").val(accountData.ShippingState);
            $("#ShippingCountry").val(accountData.ShippingCountry);
            $("#PriceBook").val(accountData.PriceBook);
            $("#SpecialsPriceBook").val(accountData.SpecialsPriceBook);
            $("#Discount").val(accountData.Discount);
            $("#CreditLimitExpires").val(accountData.CreditLimitExpires);
            $("#CreditLimit").val(accountData.CreditLimit);
            $("#TaxID").val(accountData.TaxID);
            $("#ResellerID").val(accountData.ResellerID);
            $("#DefaultCurrency").val(accountData.DefaultCurrency);
            $("#Credits").val(accountData.Credits); 
            $("#Description").val(accountData.Description);
            
            let CustomField = accountData.AccountCustomFields?.CustomField || [];

            if(CustomField){
              CustomField.forEach(field => {
                const inputElement = $(`[data-name="${field.Name}"]`);
                if(inputElement.length) {
                  inputElement.val(field.Value);
                } else {
                  console.warn(`Field with ID '${field.Name}' not found in HTML.`);
                }
              })
            }

          } else {
            $("#accountDetail").html("<p>Error fetching account data</p>");
          }
        },
        error: function(xhr, status, error) {
          console.error("Error fetching account data:", error);
          $("#account-details-container").html("<p>Error fetching account data</p>");
        }, 
        complete: hideOverlayLoading
      });
}

$("#editButton").click(function() {
  toggleInputFields(true);
  $(this).hide();
  $("#save-btn").show();
});

// Save Button Functionality
$("#save-btn").click(function() {
  let updatedData = { Accounts: { Account: [{}] }};
  let updatedCustomFields = [];


  $("input,textarea, select").each(function() {
    const fieldId = $(this).attr("id"); 
    const fieldValue = $(this).val();

    if (fieldId && fieldValue !== accountData[fieldId]) {
      if (fieldId.startsWith("CustomField_")) {
        updatedCustomFields.push({
          Name: fieldId.replace("CustomField_", ""),
          value: fieldValue,
        });
      } else {
        updatedData.Accounts.Account[0][fieldId] = fieldValue;
      }
    }
  })

  updatedData.Accounts.Account[0].AccountCustomFields = { CustomField: updatedCustomFields };

  console.log("Payload being sent to the server:", JSON.stringify(updatedData, null, 2));

  let payload = { ...accountData, ...updatedData };

  $.ajax({
    url: `https://360logicasb17mysqli.agiliron.net/agiliron/api-40/Accounts?key=j0hlKhSfnAXFxPtqPQehzKmonTmbtShgF8ObV0bI9gw,`,
    method: "PUT", 
    contentType: "application/json",
    data: JSON.stringify(payload), 
    success: function (response) {
        console.log("API Response:", response);
        if (response.MCM.parameters.results.message.status === "Success" || response.data) { 
            alert("Data updated successfully!");
            fetchAccountData();
            toggleInputFields(false);
            $("#save-btn").hide();
            $("#editButton").show();
        } else {
            alert("Error updating data. Please try again.");
        }
    },
    error: function (error) {
        console.error("API Error:", error);
        alert("Error updating data. Please try again.");
    }
  });
})

  $('#backButton').click(function () {
    window.location.href = "/Assignment/index2.html"; 
  });

  if (accountId) {
    fetchAccountData();
  } else {
    alert("Account id is missing")
  }
});