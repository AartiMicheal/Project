//This dashboard is used here to show the registered customer detail------------------------------------

//as soon as document is ready 
$(document).ready(function () {

  // When the Show Category card is clicked
  $(".showCustomer").click(function () {

   console.log("Clicked")//--->checkpoint to know if it's clicked
    $.ajax({
      type: "GET",
      url: "http://localhost:50622/Api/Customer/AllCustomer", // base URL
      success: function (data) {
        // Clear existing rows
        $("#customerTableBody").empty();

        // iterate and Append each category row of user details table
        data.map(function (item) {
          //dynamically table row is creating and appendig to the table 
          $("#customerTableBody").append(`
                        <tr>
                            <td>${item.CustomerId}</td>
                            <td>${item.CustomerName}</td>
                            <th>${item.CustomerAddress}</th>
                            <th>${item.CustomerPhone}</th>
                            <th>${item.UserId}</th>
                        </tr>
          `);
        });
        // Show the table with user details
        $("#customerTableContainer").show();
      },
      error: function (err) {
        //if user detail is not able to load
        console.error("Failed to fetch Customer:", err);
        //alerting the user detail is not able to load
        alert("Failed to load Customer.");
      },
    });
  });
});
