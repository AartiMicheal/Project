const id = sessionStorage.getItem("updateProductId");
console.log("Updating product ID:", id);

//let's fetch data by id
$(document).ready(function (e) {
  //let's call the js to fetch product by their Id
  $.ajax({
    type: "GET",
    url: "http://localhost:50622/Api/Product/ById?id=" + id,
    success: function (data) {
      $("#productName").val(data.ProductName);
      $("#price").val(data.ProductPrice);
      $("#quantity").val(data.ProductQuantity);
      $("#description").val(data.ProductDescription);

      //fetching categories
      $.ajax({
        type: "GET",
        url: "http://localhost:50622/Api/Category",
        success: function (data) {
          const category = $("#category");
          //category.empty();
          if (category.children("option").length > 1) return;
          data.forEach((element) => {
            category.append(
              `
                <option value=${element.CategoryId}>${element.CategoryName}</option>
              `
            );
          });
        },
        error: function (error) {
          alert("Failed to fetch product data.");
          console.error(error);
        },
      });
      $("#category").val(data.CategoryId);
      $("#productImage").val(data.ProductImage);
    },
    error: function (err) {
      console.log(err);
    },
  });
});

//While clicking on the Submit form this event will perform
$("#btnUpdateProduct").click(function (event) {
  //storing value of fileds of form in variables
  const name = $("#productName").val();
  const price = $("#price").val().trim();
  const image = $("#productImage")[0].files[0];
  const description = $("#description").val().trim();
  const quantity = $("#quantity").val().trim();
  const category = $("#category").val();
  console.log(category);

  //let's apply vlaidation for each field.
  // === VALIDATION ===
  if (name === "") {
    alert("Product name is required.");
    return;
  }
  //on price
  if (price === "" || isNaN(price) || Number(price) <= 0) {
    alert("Please enter a valid price.");
    return;
  }
  //on image
  if (!image) {
    alert("Please select a product image.");
    return;
  }
  //on product description
  if (description === "") {
    alert("Product description is required.");
    return;
  }
  //on Quantity
  if (quantity === "" || isNaN(quantity) || Number(quantity) <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }
  //on category selection
  if (!category || category === "Select Category") {
    alert("Please select a valid category.");
    return;
  }

  event.preventDefault();
  //store all the information of new product in variable as object form
  const updateProduct = {
    productId:id,
    ProductName: name,
    ProductPrice: price,
    ProductImage: image.name,
    ProductDescription: description,
    ProductQuantity: quantity,
    CategoryId: category,
  };
  //calling the ajax to send the object of new product data to store in Database table.
  $.ajax({
    type: "PUT",
    url: "http://localhost:50622/Api/Product/Update",
    data: updateProduct,
    success: function () {
      alert("Product is Updated");
      $("#productName").val("");
      $("#price").val("");
      $("#productImage").val("");
      $("#description").val("");
      $("#price").val("");
      $("#quantity").val("");
      $("#category").val("");
    },
    error: function (error) {
      alert("Product is not Updated");
      console.log(error);
      //clear the form fields
    },
  });
});

//Button to Go back to the Admin Produt page
$("#btnBack").click(function(e){
    e.preventDefault();
    window.location.href= "Product.html";
})