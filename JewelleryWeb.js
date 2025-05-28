//This is used to display products in cart-----------------------------------------------
$(document).ready(function () {
  const apiUrl = "http://localhost:50622/Api/Product/AllProduct";
  //calling function at time of page reload if in cart there is any product shown
  updateCartCount();
  $.ajax({
    type: "GET",
    url: apiUrl,  //url
    //if data is fetched
    success: function (data) {
      //target the container id where we have to show all the products
      const container = $("#MainContainer");
      console.log(data); //----->display data in console

      // Clear existing cards if needed
      container.empty();
      //iterate over the data to display each product in main container
      data.map((product) => {
        //storing each product info on card and appending it to the main branch
        const card = $(`
          <div class="card">
            <div class="item-design">
              <img src="${'/ImagesJewellery/'+product.ProductImage}" alt="${product.ProductName}" class="imgstyle">
              <h3>${product.ProductName}</h3>
              <p>Price: ₹${product.ProductPrice}</p>
              <button class="add" type="button" data-prodid="${product.ProductId}">ADD</button>
            </div>
          </div>
        `);
        //appending each div card in main container
        container.append(card);
      });
    },
    error: function (err) {
      console.error("Error fetching product data:", err);
      //alert the user that the data is not able to load of products
      alert("Failed to load products from the database.");
    },
  });
});
//----------------------------------------------------------------------------------------------------------


// Add to Cart click  event handler-----------------------------------------------------------------------------
$(document).on("click", ".add", function () {
  //store the id of product which get clicked using customer data attribute
  const productId = $(this).data("prodid");
  console.log(productId); //----> check if product id is coming or not after clicking

  //Check for logged-in user
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  //check if looged in user is null or not
  if (!loggedInUser) {
    //if null then redirect to the login page
    alert("Please login first");
    window.location.href = "./Login.html";
    return;//return because before logging user should not able to add to cart
  }

  //  Fetch the product by ID from the API to store in the cart-local storage and table of cart
  $.ajax({
    type: "GET",
    url: `http://localhost:50622/Api/Product/ById?id=${productId}`,//url with particular product id
    success: function (product) {
      //Get cart from localStorage
      let cart = JSON.parse(localStorage.getItem(`cart_${loggedInUser.email}`)) || [];

      let loggedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
      console.log(loggedUser.userid);
      // Check if product already in cart and get the index
      const index = cart.findIndex(
        (item) => item.productId === product.ProductId
      );

      //increase in quantity if user have have the item in cart already else 
      //  create new Cart in local storage if user is does not have already cart 
      if (index >= 0) {
        cart[index].quantity += 1;//increase quantity by 1
        updateCartCount();
      } else {
        //if new product is being added
        cart.push({
          productId: product.ProductId,
          name: product.ProductName,
          price: product.ProductPrice,
          image: product.ProductImage,
          quantity: 1,
          userId: loggedUser.userid,
          TotalPrice: product.ProductPrice * 1,
        });
        //call the updatecart count method
        updateCartCount();
      }
    
      //Save updated cart
      localStorage.setItem(`cart_${loggedInUser.email}`, JSON.stringify(cart)); //-------------->key value format
      console.log("Updated Cart:", cart);
      updateCartCount(); // Optional function to refresh cart badge

      //let's create an object which will send via http method  and add the data into the cart----
      //if product alredy exist in the cart table then it'll be done by the server side
      const newCart = { // creating a object to store all infomation of product and cart
        UserId: loggedUser.userid,
        ProductId: product.ProductId,
        CartQuantity: 1,
        UnitPrice: product.ProductPrice,
        SubTotal: product.ProductPrice * 1,
      };
        console.log(newCart)
      //let's add the cart details in the Cart table
      $.ajax({
        //put method to insert into the cart
        type: "POST",
        url: "http://localhost:50622/Api/Cart/InsertCart",
        data: newCart,   //data
        success: function () {
          //success if data is added
          console.log("Added");
        },
        error: function () {
          console.log("not added")
        },
      });
    },
    error: function (err) {
      console.error("Error fetching product by ID:", err);
      alert("Unable to add product to cart.");
    },
  });
});

//--------------------------------------------------------------------------------------------------------
      
//Let's display the category on the dropdwon list

//targeting the dropdwon list container and attaching hover event
  $(".dropdown").hover(function(){
   //when hover on dropdwon list ajax call is made to fetch the category of Jewellery 
    $.ajax({
      type:"GET",
      url:"http://localhost:50622/Api/Category", //url
      success: function(response){
        //on success first empty the dropdwon container
        $("#dropdown-content").empty();
        //iterate over the response and append each category name in dropdwon list
        response.map(function(item){
          $("#dropdown-content").append(
            `
            <li class='dropdown-li-style'>${item.CategoryName}</li>
            `
          )
        })
      },
      error:function(){
        //failed to load the category data
        console.log("Dropdown list Failed")
      }
    })
  })

//----------------------------------------------------------------------------------------------
  //let's write the code to fetch the category cart based on the  Category clicked or selected

  //as category name in dropdwon list dynamically added we are using on method
  $(document).on("click",".dropdown-li-style", function(){
    //let's store the selected list name
    const categoryName = $(this).text(); //text methhod is used to get or set the  text here we are getting the text
    console.log(categoryName)
    //make ajax call base on the category name got clicked
    $.ajax({
      type:"GET",
      url:"http://localhost:50622/Api/Category/FetchByName?categoryName="+categoryName,//url with category text
      success:function(response){
      //check the response
      console.log(response)
      //first empty the main container if other category product is visible
      $("#MainContainer").empty();
      console.log("ajax");//----> check point that we are in
      //check response length means if that category product is available or not
      if (response.length === 0){
        //if not then append heading that the product is not avaialble.
      $("#MainContainer").append(`
        <h3> Product is not available...</h3>
        `)
        return;
     }else{
      //otherwise iterate over the response and display each product of selected category
      response.map((item)=>{
        console.log(item)
        //appending each product of category
         $("#MainContainer").append(`
            <div class="card">
              <div class="item-design">
              <img src="${'/ImagesJewellery/'+item.ProductImage}" alt="${item.ProductName}" class="imgstyle">
              <h3>${item.ProductName}</h3>
              <p>Price: ₹${item.ProductPrice}</p>
              <button class="add" type="button" data-prodid="${item.ProductId}">ADD</button>
            </div>
          </div>
          `)
      })
    }
      },//check for other status like not found, bad request
      error:function(xhr){
        if(xhr.status == 400){
          //check for the bad request
          console.log("Bad Request")
        }else if ( xhr.status == 404){
          //check if not found 
          console.log("Not found")
        }else{
          //show other error
          console.log("Somethng went wrong")
        }
      }
    
    })
  })
//-------------------------------------------------------------------------------------------------------
  

//count the no. of product in the cart
//specially using to display the no. of product in the cart
function updateCartCount() {
  //first fetch who is logged in
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  //if no login then not displying product in the cart
  if (!user) return;

  //if logged in then fetch that users products detail from the local storage suffix of it's email
  const cart = JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];

  //using reduce method count the quantity of item
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update UI
  if (totalItems > 0) {
    //showing the total quantity of product in cart
    $("#cartCount").text(totalItems).show();
  } else {
    //if not greater than 0 then cart count is hidden
    $("#cartCount").hide();
  }
}
//-----------------------------------------------------------------------------------------------------
//to see the user order redirect to the My order page
$("#myOrder").click(function(){
   const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
   //check for user logged in or not 
   if(loggedInUser!=null){
    //if logged in then redirect to my order page to see theirs  order details.
  window.location.href = "MyOrder.html";
   }
   else{
    //other wise show them to logging message
    alert("Please login First")
   }
})
//----------------------------------------------------------------------------------------------------------
//logout through Jwellery page
$("#logOutJewell").click(function () {
  console.log("logout clicked");
  //target the logged in user and  then logout from the website also delete it's session 
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  sessionStorage.clear(loggedUser);//---->removing from session storage
  //redirect them to logging page
  window.location.href = "./Login.html";
});
//----------------------------------------------------------------------------------------------------------


/* From here another functioanlity*/
//This functionality we are going to use show the uername on navbar and logout option
$(document).ready(function () {
  // Retrieve user email from session storage
  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  console.log(currentUser);
  //check if user is logged in or not
  if (currentUser == null) return;
  //if logged in then show and hide functionality of login and logout 
  if (currentUser) {
    // If user is logged in
    $("#signin").hide();
    $("#signout").show();
    $("#userId").text(currentUser.name);//displaying user name 
    $("#myOrder").text("My Orders");//also my order will be visible
  } else {
    // If not logged in
    $("#signin").show();
    $("#signout").hide();
    updateCartCount();//show updated count
  }

  $(document).ready(function () {
  // LOGIN click event
  $("#signin").click(function () {
    window.location.href = "./Login.html";
  });
});

});
//--------------------------------------------------------------------------------------------------------