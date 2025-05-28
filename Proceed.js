//------------------------------checkout funcationality----------------------------
//creating a from as soon as user enter into the page;
$(document).ready(function () {
  const cartItemsDiv = $(`
        <h3>Checkout</h3>
    <form id="checkoutForm" onsubmit="event.preventDefault();">
      <label for="cardName">Name on Card:</label><br>
      <input type="text" id="cardName" placeholder="John Doe" required /><br><br>

      <label for="cardNumber">Credit Card Number:</label><br>
      <input type="text" id="cardNumber" placeholder="xxxxxxxxxxxxxxxx" maxlength="16" required /><br><br>

      <label for="expiry">Expiry Date (MM/YY):</label><br>
      <input type="text" id="expiry" placeholder="MM/YY" maxlength="5" required /><br><br>

      <label for="cvv">CVV:</label><br>
      <input type="text" id="cvv" placeholder="123" maxlength="3" required /><br><br>

      <div id="error" style="color: red; margin-bottom: 10px;"></div>

      <button type="submit" class="final_pay">Pay Now</button>
      <button type="button" onclick="window.location.href='cart.html'" style="margin-left: 10px;">Back to Cart</button>
    </form>
        `);

  //append to the div of class process
  $("#process").append(cartItemsDiv);

  //let's write the functioality to count the cart itme of particular usr so first
  //of all let's fetch the who is logged in

  const loggedIn = sessionStorage.getItem("loggedInUser");//get item of key logged in 
  //check for null
  if (loggedIn != null) {
    //then convert it into javascript object
    const loggedUser = JSON.parse(loggedIn);
    //fetch the id from the object
    const userid = loggedUser.userid;
    console.log(userid);
    //now let's call the ajax function to fetch all the cart info of logged user
    $.ajax({
      type: "GET",
      url: "http://localhost:50622/Api/Cart/ByUserId?userId=" + userid,
      success: function (cartInfo) {
        console.log(cartInfo);
        const cartArr = Object.values(cartInfo); //converting object into array so that we can iterate over the value
        let totalAmount = 0;

        //let's create a local storage for storing particular product id and --quantity and total amount of each product

        if (Array.isArray(cartArr)) {
          //storing product id
          const productIds = cartArr.map((cartItem) => cartItem.productId);
          console.log("Product IDs:", productIds);

          //calculationg total Amount of all product selectedby user
          totalAmount = cartArr.reduce(
            (sum, cartItem) => sum + cartItem.SubTotal,0);//currentvlaue sum start with 0
            onsole.log("Total Amount:", totalAmount);
        } else {
          console.error(
            "cartInfo is not a valid object or does not contain values."
          );
        }
      },
      //function to show the error  and xhr-XMLHttpRequeset used to show the status of reuqest
      error: function (xhr, error) {
        console.log(error);
        if (xhr.status == 404) {//404 for not found
          console.log("Userid not present");
        } else if (xhr.status == 400) {//something went wrong
          console.log("BadRequerst");
        }
      },
    });
  }
});

//let's write the functioality to count the cart itme of particular usr so first
//of all let's fetch the who is logged in

$(document).on("click", ".final_pay", function () {
  const regex = /^[A-Za-z\s]+$/; //validation of string
  const name = $("#cardName").val().trim();
  if (!regex.test(name)) {
    alert("Please Enter Character in Name field");
  }
  //let's first check the validation for input fields
  const cardNumber = $("#cardNumber").val().trim();

  const expiryDate = $("#expiry").val().trim(); // Assumes an input with id="expiryDate"

  //split the entered date
  //converting the string in int (decimal base 10)
  const [monthStr, yearStr] = expiryDate.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt("20" + yearStr, 10);

  //fetching current date to validate the entered date of user
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
  const currentYear = today.getFullYear();

  //compare the years whether it's crossed the today's day or not
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    alert("The expiry date is in the passed. Please use a valid card.");
    return;
  }

  // Validate expiry date format MM/YY and if it's not expired
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    alert("Please enter a valid expiry date in MM/YY format.");
    return;
  }

  //Now let's pay as well as create order and storing in the bill
  //let's first store all the product id of cart
  // Collect user detail updates
  const loggedIn = sessionStorage.getItem("loggedInUser");
  const loggedUser = JSON.parse(loggedIn);
  const userid = loggedUser.userid; //we get the user id
  //it's time to get the product id of user

  //making key as of cart using logged user
  const cartKey = `cart_${loggedUser.email}`

  //retriving the logged user cart list
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  console.log(cart)

  //store all product in bill detail
  const billDetails = cart.map((item) => ({
    ProductId: item.productId,
    BillQuantity: item.quantity, // quantity of product
    BillAmount: item.price,      //unit price
  }));

  //store information of bill dto
  const billDto = {
    UserID: userid,    // user id
    Details: billDetails,//list of product --> belong to user id
  };

  //now let's call the ajax to transfer the userdetail

  $.ajax({
    url: "http://localhost:50622/Api/BillDetails/Add",   // Update actual bill details table using  url
    type: "POST",
    data: billDto,                                       //passing data
    success: function (response) {
      alert("Bill added successfully! Bill ID: " + response.BillID);
      // Optionally clear the cart
      localStorage.removeItem(`cart_${loggedUser.email}`);

      //removing from the Cart table as well
      $.ajax({
        type:"DELETE",
        url:"http://localhost:50622/Api/Cart/ByUserId?userid="+userid,
        success:function(){
          //after successfullly removing the added cart detail
            console.log("Removed carts from the cart table");
        },
        error:function(){
          //display error message
            console.log("Error occured while deletingfrom the Cart table.");
        }
      })
    },//if error occur print the text of occur. 
    error: function (xhr) {
      //error response 
      alert("Error: " + xhr.responseText);
    },
  });
});
//--------------------------------------------------------------------------------------