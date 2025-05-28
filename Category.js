//------------------------------------------category management------------------------------

//function to display all the category when the show category is clicked
$(document).ready(function () {
  // When the Show Category card is clicked
  $("#showCategory").click(function (e) {
    //prevent the default behaviour of browser
    e.preventDefault();
    $("#addCategoryForm").hide();
    $.ajax({
      type: "GET",
      url: "http://localhost:50622/Api/Category", // base URL
      success: function (data) {
        // Clear existing rows
        $("#categoryTableBody").empty();
        
        //iterate and dynamically Append each category row
        data.map(function (item) {
          $("#categoryTableBody").append(`
                        <tr>
                            <td>${item.CategoryId}</td>
                            <td>${item.CategoryName}</td>
                            <td><button type="button" class="btn btn-dark btn-delete" data-catid=${item.CategoryId} disabled>Delete</button></td>
                        </tr>
          `);
        });
        // Show the table
        $("#categoryTableContainer").show();
      },
      error: function (xhr) {
          if (xhr.status === 409) {
        alert("Warning: " + xhr.responseText); // "Category already exists"
      } else {
        alert("An unexpected error occurred: " + xhr.responseText);
      }
      },
    });
  });

  //Jquery to delete the Category by the Id.
  $(document).on("click", ".btn-delete", function (event) {
    //prevent default behavior 
    event.preventDefault();

    const id = $(this).data("catid"); // Get the Category ID from data attribute

    if (!confirm("Are you sure you want to delete " + id + " category?"))
      return;

    $.ajax({
      type: "DELETE", //  "DELETE"  it
      url: "http://localhost:50622/Api/Category/CategoryId?id="+id, //url with id of the category
      success: function () {
        //successfullly category is deleted
        alert("Category deleted successfully");
        // Optionally remove the row from the table
        $(event.target).closest("tr").remove();
      },
      error: function (err) {
        //failed to delte
        console.error("Failed to delete", err);
        alert("Failed to delete the category");
      },
    });
  });
//-------------------------------------------------------------------------------------------
  //jquery to add the new Category
  $("#addCategory").click(function (e) {
    e.preventDefault();
    $("#categoryTableContainer").hide();//hide other tables
    $("#addCategoryForm").show();//showing only the add category form
  });

  //let's add the new Category in database
  $(".btn-addProduct").click(function (event) {
    event.preventDefault();
    const name = $("#categoryName").val().trim();
  //store the category Name 
    const categoryName = { CategoryName: $("#categoryName").val() };

    //check if category name is not null
    if (!name) {
      //show alerat if category is empty 
      alert("Category Name cannot be empty.");
      return;
    }

    //validation for string of category
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      //show alert if category doen't containe string
      alert("Category Name must contain only letters.");
      return;
    }

    //add new category to categoy table
    $.ajax({
      type: "POST",
      url: "http://localhost:50622/Api/Category/Add",  //url to add new product
      //tell the server that the data is in json format
      contentType: "application/json", 
      // as the content type is json then converting js objcet to json string format
      data: JSON.stringify(categoryName),
      success: function () {
        //successfully added the category
        alert("Category added");
        //setting the text empty stirng using val function
        $("#categoryName").val("");
      },
      error: function () {
        //if any error occured
        console.log("Failed to ADd");
        alert("Failed to Add new Category");
      },
    });
  });
});

//---------------------------------------------------------------------------------------------------------

//This  will be executed when the search button is clicked for searching category

//shorthand for the document is ready
$(function(){
  //as click on the search button for categoryName
$("#searchCategory").click(function(e) {
  //preventing default behaviour of browser when the event is triggered
  e.preventDefault();
  //hide the add categroy form
  $("#addCategoryForm").hide();
  //store the value of text box category and trim the space
  const category_name = $("#category-name").val().trim();
  console.log(category_name)
  //string validation
  const regex = /^[a-zA-Z\s]+$/;

  //validate the name check if it empty or not 
  if (category_name == "") {
    //show alert if it's empty
    alert("Enter Category Name");
    return;
  }//check if it's string or not 
  else if (!regex.test(category_name)) {
    //alert the suer and display the message
    alert("Make sure to enter a valid Category");
    return;
  }
   //--if validation successfull---
  //call ajax to fetch the detail by name of category
  $.ajax({
    type: "GET",
    url: "http://localhost:50622/Api/Category/SearchByName?categoryName=" + category_name,//url with category Name
    success: function(response) {
      //successfully show the category name in table
      $("#categoryTableContainer").show();
      $("#categoryTableBody").empty();
      //append the category to the table or searched category
      $("#categoryTableBody").append(
        `
        <tr>
            <td>${response.CategoryId}</td>
            <td>${response.CategoryName}</td>
            <td><button type="button" class="btn btn-dark btn-delete" data-catid="${response.CategoryId}"><i class="fa-solid fa-trash"></i></button></td>
          </tr>
        `
      )
      
    },
    error: function() {
      //showing alret if error occured
      alert("Error fetching category data.");
      //if error occur then don't show the table hide it
      $("#categoryTableContainer").hide();
    }
  });
  //it's to clear the category name once the category is searched
$("#category-name").val("")
})
})
//---------------------------------------------------------------------------------------------------------------
