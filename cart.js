
///---------------------------jqquery------------------------

// as soon as document is ready show the cart of specific user
$(document).ready(function () {
  updateCartDisplay();
});
//---------------------------------------------------------------------
// Update cart display on Cart page
function updateCartDisplay() {
  const cartItemsDiv = $('#cartItems');
  //fetch the logged user so that we can know what product is selected by the user
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  //if user is not logged in redirect them to the login page
  if (!loggedInUser) {
    //showing the logging aleart 
    alert('Please login first');
    //specifying the login page
    window.location.href = 'Login.html';
    return;
  }

  //making logged in user as key to store cart value here we are getting the user cart
  const userEmail = loggedInUser.email;
  const cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

  //div that will store the cart items clearing the cart container first
  cartItemsDiv.empty();

  //if the cart lenght is 0 meas user have not selected any product.
  if (cart.length === 0) {
    //show that the cart is empty
    cartItemsDiv.html('<p>Your cart is empty.</p>');
    return;
  }

  //variable to store the total value of all product which is selected 
  let total = 0;

  // Fetch product details from your API
  $.ajax({
    type: 'GET',
    url: 'http://localhost:50622/Api/Product/AllProduct',  // url for get all cart details of user
    success: function (products) {

      //iterationg the cart items and checking with wether product is present in the Product Table or not
      cart.map(cartItem => {
        //find the current cart item with stored in cart (find method return the first satisfied element)
        const product = products.find(p => p.ProductId === cartItem.productId);
        //if product is matched
        if (!product) return;

        //per item total value of price
        const itemTotal = product.ProductPrice * cartItem.quantity;
        //storing each itemToal in total to know all price 
        total += itemTotal;

        //appending cart
        const productDiv = $(`
          <div class="cart-item">
            <div class="each-cart">
              <img src="${'/ImagesJewellery/'+product.ProductImage}" class="cart-img">
              <p><strong>${product.ProductName}</strong></p>
              <p class="para-total">
                Unit Price: ₹${product.ProductPrice.toFixed(2)} 
                <br/>SubTotal: ₹${itemTotal.toFixed(2)}
              </p>
              <div class="quantity-control">
                <button class="qty-btn" data-action="decrease" data-id="${product.ProductId}">-</button>
                <span>${cartItem.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${product.ProductId}">+</button>
              </div>
              <i class="fa-solid fa-trash remove-icon" data-id="${product.ProductId}" style="cursor: pointer;"></i>
            </div>
          </div>
        `);
        //append the founded product in the cart- container
        cartItemsDiv.append(productDiv);
      });
      //after all the cart itme is appended, append the bottom part which contains the total price and proceed button
      const totalDiv = $(`
        <div class="cart-total">
          <hr>
          <p><strong>Total: ₹${total.toFixed(2)}</strong></p>
          <button type="submit" class="proceed" onclick="window.location.href='Proceed.html'">Proceed</button>
        </div>
      `);
      //append it to the last of cart div container
      cartItemsDiv.append(totalDiv);
    },
    error: function (err) {
      //if error occure 
      console.error("Error fetching products:", err);
      //, show that failed to load cart details
      cartItemsDiv.html('<p>Failed to load cart products.</p>');
    }
  });
}
//-----------------------------------------------------------------------------------------------------------
// Change quantity of the product ( + , - )

//when uer click on the dynamicallyl created quantity button 
$(document).on("click", ".qty-btn", function () {
  //ths action variable store the value of custome attribut of action (increase  or decrease)
  const action = $(this).data("action");
  //store the id of prodcut
  const productId = $(this).data("id");
  //to fetch user Id 
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  //if user is not logged in then return
  if (!loggedInUser) return;

  //makeing key as of cart using logged user
  const cartKey = `cart_${loggedInUser.email}`;
  //retriving the logged user cart list
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // finding the index at which user clicked this is to update local storage quantity 
  const productIndex = cart.findIndex(item => item.productId === productId);

  //it it return -1 index means product doesn't exit and return
  if (productIndex === -1) return;
   //let's store which value is coming whether increased or decreased 
  let quantity=0;
  if (action === "increase") {
    //if increase assign 1
    quantity=1;
    cart[productIndex].quantity += 1;//cart value
  } else if (action === "decrease") {
    //if decrease assign -1
    quantity= -1;
    cart[productIndex].quantity -= 1;//cart value

    //after doing subtraction if cart quanitiy become 0 then remove the product
    //this functionality also done in backend
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1);//splice method which is used to add remove item -- take (start index, remvoe no. of item, add eleemnt)
    }
  } 
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartDisplay();//update the cart display simulatneously
  updateCartCount(); // Optional function to update count badge

  //now we have to do same changes in the table of cart same we have to send the userid and productid
  //but this time with value(increse of decrese) quantity
  $.ajax({
    type:"PUT",
    url:"http://localhost:50622/Api/Cart/Quantity?id="+productId+"&userid="+loggedInUser.userid+"&quantity="+quantity,
    success:function(){
      //successfully updated the quantity
      console.log("quantity updated");
    },
    error: function(){
      //error occured while doing updation in quantity
      console.log("not able to update")
    }
  })

});
//-------------------------------------------------------------------------------------------------------------

//Remove item --> jquery to delete the product from database and also from local storage

//whern user click on the dynamically created remove icon
$(document).on("click", ".remove-icon", function () {
  const productId = $(this).data("id"); //fetch id of product
  //fetch the logged in user
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  
  //checki if user is logged in or not
  if (!loggedInUser) return;
  //store the id of logged in user
  const userid = loggedInUser.userid;

  //this is for the cart updating that is present in the Local storage.
  const cartKey = `cart_${loggedInUser.email}`;
  //fetch cart of logged user
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  //filtering the product from the cart of selected product (remvoing through filter)
  cart = cart.filter(item => item.productId !== productId);
  localStorage.setItem(cartKey, JSON.stringify(cart));

  //now let's also remove from the cart Table
  $.ajax({
    type:"DELETE",
    url:"http://localhost:50622/Api/Cart/DeleteId?id="+productId+"&userid="+userid,  //url with product id and user id
    success:function(){
      //after successfull deletion
      console.log("deleted")
    },
    error:function(xhr){
      //check the status of error
      if(xhr.status === 404){
        //if product id not found not able to delete
        console.log("item not found")
      }else{
        //print the error messae
        console.log(xhr.responseText)
      }
    }

  })
  //show the update cart items in container
  updateCartDisplay();
  //show updated cart count number
  updateCartCount();
});

//----------------------------------------------------------------------------------------------------------
//Let's display the category on the dropdwon list

//dropdown list load the data as user hover the dropdown
$(function(){
  //on hover call ajax to store the category name 
  $(".dropdown").hover(function(){
       $("#dropdown-content").empty();//empty the container
    $.ajax({
      type:"GET",
      url:"http://localhost:50622/Api/Category", // url for getting the category
      success: function(response){
        //iteratie over the each respone item and append to the dropdwon container
        response.map(function(item){
          $("#dropdown-content").append(
            `
            <li>${item.CategoryName}</li>
            `
          )
        })
      },
      error:function(){
        //not able to store the category name in drop down list
        console.log("Dropdown list Failed")
      }
    })
  })
})
//----------------------------------------------------------------------------------------------------------



//----->jquery---------------------------
// Update Cart Count on Badge on the cart icon
function updateCartCount() {
  //fetch the logged user
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  //if it null return
  if (!loggedInUser) return;

  //if not null then using their email fetch the cart detail
  const cart = JSON.parse(localStorage.getItem(`cart_${loggedInUser.email}`)) || [];
  //using reduce method sum the all quantity to dispaly on cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  //target the cartCount element
  const $cartCount = $('#cartCount');

  //if cart count is greatetr than 0 then dispaly the counting
  if (totalItems > 0) {
    $cartCount.css('display', 'inline-block').text(totalItems);
  } else {
    //hide the element of count
    $cartCount.css('display', 'none');
  }
}
//--------------------------------------------------------------------------------------------------------------
// Close Cart Div / Go Back to Clothes Page
$("#closeDivcart").click(function(){
    window.location.href= "JewelleryWeb.html";
})
//---------------------------------------------------------------------------------------------------------------
//logout through jquery  from the website
$("#logOutJewell").click(function () {
  console.log("logout clicked");
  //fetch logged in user
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  //clear from the session
  sessionStorage.clear(loggedUser);
  //redirect toward the login page
  window.location.href = "./Login.html";
});
//----------------------------------------------------------------------------------------------------------

/* From here another functioanlity*/
//This functionality we are going to use show the uername on navbar and logout option
$(document).ready(function () {
  // Retrieve user email from session storage
  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser);
  //check if user is null then return
  if (currentUser == null) return;
  //if not null then
  if (currentUser) {
    // If user is logged in
    $("#signin").hide();            // hide the login link
    $("#signout").show();         //show signout option
    $("#userId").text(currentUser.name);// show current logged in user name
  } else {
    // If not logged in
    $("#signin").show();        // show to signin
    $("#signout").hide();        //hide logout 
    updateCartCount();
  }
//-------------------------------------------------------------------------------------
  // LOGIN click go to Login.html
  $("#signin").click(function () {
    window.location.href = "./Login.html";  //login page href
  });
});
//-------------------------------------------------------------------------