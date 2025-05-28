//calling ajax to show all the products at onece

//showing the product
$("#showProduct").click(function (event) {
  event.preventDefault();

  //Hiding other form
  $("#addProductForm").hide();
  $("#productTableContainer").show();

  //fetching data and displaying in the table form using the ajax 
  $.ajax({
    type: "GET",
    url: "http://localhost:50622/Api/Product/AllProduct",
    success: function (data) {
      const categoryTableBody = $("#productTableBody");
      categoryTableBody.empty();

      //check if data is not null
      if(data==null){
        alert("Data is not present")
        return;
      }
      //iterating over the data
      data.map((element) => {
        categoryTableBody.append(`
          <tr>
            <td>${element.ProductId}</td>
            <td>${element.ProductName}</td>
            <td>${element.ProductPrice}</td>
            <td><img src="${'/ImagesJewellery/'+element.ProductImage}" alt="Product Image" style="width: 60px; height: auto;"></td>
            <td>${element.ProductDescription}</td>
            <td>${element.ProductQuantity}</td>
            <td>${element.CategoryId}</td>
            <td>--</td>
            <td>--</td>
          </tr>
        `);
      });
    },
    error: function (error) {

      //error displaying
      alert("Failed to fetch product data.");
      console.error(error);
    }
  });
});

//---------------------------------------------------------------------------------------
//search by Product Name

//This  will be executed when the search button is clicked for searching category
$(function(){
$("#searchProduct").click(function(e) {
    $("#productTableContainer").hide();
    $("#addProductForm").hide();
  e.preventDefault();
  const product_name = $("#product-name").val().trim();
  console.log(product_name)
  //string validation
  const regex = /^[a-zA-Z\s]+$/;

  if (product_name == "") {
    alert("Enter Product Name");
    return;
  } else if (!regex.test(product_name)) {
    alert("Make sure to enter a valid Product");
    return;
  }

  //search the category by given input value
  $.ajax({
    type: "GET",
    url: "http://localhost:50622/Api/Product/SearchByName?productName=" + product_name,
    success: function(element) {
      $("#productTableContainer").show();
      $("#productTableBody").empty();
      //show by the response has came
      $("#productTableBody").append(
        `
       <tr>
            <td>${element.ProductId}</td>
            <td>${element.ProductName}</td>
            <td>${element.ProductPrice}</td>
            <td><img src="${'/ImagesJewellery/'+element.ProductImage}" alt="Product Image" style="width: 60px; height: auto;"></td>
            <td>${element.ProductDescription}</td>
            <td>${element.ProductQuantity}</td>
            <td>${element.CategoryId}</td>
            <td><button type="button" class="btn btn-dark btn-deleteProduct" data-prodid="${element.ProductId}">Delete</button></td>
            <td><button type="button" class="btn btn-dark btn-updateProduct" data-prodid="${element.ProductId}">Update</button></td>
          </tr>
        `
      )//-----appending the particular product detail by theri name
      
    },
    error: function() {
      alert("not found product data.");
      $("#productTableContainer").hide();
    }
  });
 $("#product-name").val()
})
})

//------------------------------------------------------------
//redirecting to another page for updating 
$(document).on("click",".btn-updateProduct", function(e){
  console.log("Clicked");
  e.preventDefault();
  const updateId = $(this).data("prodid");//storing particular product id which is get clicked
  sessionStorage.removeItem("updateProductId");//if alredy any id present so removing it
  sessionStorage.setItem("updateProductId", updateId); // Store with a key to fetch product detail on another page
  window.location.href="UpdateProduct.html";//redirecting to another page 
})
//----------------------------------------------------------------

// Show and hide of table content (here add product form will visible)
$(".addProductDiv").click(function () {
  $("#addProductForm").show();
  $("#productTableContainer").hide();
});

// While clicking on the Submit form this event will perform
$("#btnAddProduct").click(async function (event) {
  
  // Prevent default form submission
  event.preventDefault();

  // Storing value of fields of the form in variables
  const name = $("#productName").val().trim();
  const price = $("#price").val().trim();
  const image = $("#productImage")[0].files[0]; // Getting the image file
  const description = $("#description").val().trim();
  const quantity = $("#quantity").val().trim();
  const category = $("#category").val();
  
  // === VALIDATION ===
  // Check for product name
  if (name === "") {
    alert("Product name is required.");
    return;
  }

  const isValid = /^[A-Za-z\s]+$/.test(name); // Regex: Only alphabets and spaces allowed

  if (!isValid) {
    alert("Product name must only contain letters and spaces.");
    return;
  }

  // Check for price, Number is in-bult function to convert into number
  if (price === "" || isNaN(price) || Number(price) <= 0) {
    alert("Please enter a valid price.");
    return;
  }

  // Check for image
  if (!image) {
    alert("Please select a product image.");
    return;
  }

  // Check for product description
  if (description === "") {
    alert("Product description is required.");
    return;
  }

  // Check for quantity
  if (quantity === "" || isNaN(quantity) || Number(quantity) <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  // Check for category selection
  if (!category || category === "Select Category") {
    alert("Please select a valid category.");
    return;
  }

  //---------------------------------------- Validation Finished ----------------------

  try {
    // Wait for the check if the product already exists
    const productExists = await checkIfProductExists(name);

    //check if product already exist
    if (productExists) {
      alert("Product already exists.");
      return; // Stop further execution if the product exists
    }

    // Store all the information of the new product in a variable as an object
     const newProduct = {
      ProductName: name,
      ProductPrice: price,
      ProductImage: image.name, //  sending the image name
      ProductDescription: description,
      ProductQuantity: quantity,
      CategoryId: category
    }

    // Call the AJAX to send the object of new product data to store in Database table
    $.ajax({
      type: "POST",
      url: "http://localhost:50622/Api/Product/Add",
      data: newProduct,
      success: function () {
        alert("New Product is Added");
        // Clear the form fields after successful addition
        $("#productName").val("");
        $("#price").val("");
        $("#productImage").val("");
        $("#description").val("");
        $("#quantity").val("");
        $("#category").val("");
      },
      error: function (error) {
        alert("Product is not added");
        console.log(error);
      }
    });

  } catch (error) {
    console.error("Error checking product:", error);
    alert("An error occurred while checking product existence.");
  }
});

// Function to check if the product exists
async function checkIfProductExists(name) {
  return new Promise((resolve, reject) => {//promise to handle the asynchronous operation
    $.ajax({
      type: "GET",
      url: "http://localhost:50622/Api/Product/AllProduct",
      success: function (response) {
        const productExists = response.some(element => element.ProductName.toLowerCase() === name.toLowerCase());
        resolve(productExists); // Resolve the promise with the result
      },
      error: function (error) {
        reject(error); // Reject the promise in case of an error
      }

    });
  });
  
}

//------------------------------Fetching the Category as soon as click on the Category dropdown list-----------------------


//This is function used to show all the category on drop dwon list while  user click on the list
$("#category").click(function(e){
    e.preventDefault();
    //get the data and store the category type in dropdwo list
   $.ajax({
    type: "GET",
    url: "http://localhost:50622/Api/Category",
    success: function (data) {
      const category = $("#category");
      //category.empty();
     if (category.children("option").length > 1) return;
      data.forEach((element) => {
        //append the category name
        category.append(
        `
          <option value=${element.CategoryId}>${element.CategoryName}</option>
        `);
      });
    },
    error: function (error) {
      alert("Failed to fetch product data.");
      console.error(error);
    }})
})

//---------------------------------------------------------------------------
