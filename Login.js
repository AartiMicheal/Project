// Jquery for Logging page

//-----------------------------------------------------Submitting the Login form ---------
$("#btnSubmit").click(function (e) {
  e.preventDefault();
  //taking user input in one object
  var user = {
    UserEmail: $("#email").val(),
    UserPassword: $("#password").val(),
  }; 
  
  //Ajax call for Login
  $.ajax({

    type: "POST",                                 //for sending data
    url: "http://localhost:50622/Api/LoginUser", // url
    data: user,                                 // Send the login data 
    success: function (response) {

      // Handle success - display user info or token
      const id = response.userTypeId;
      //check which type of user Id is present 
      if (id === 1) {
        //if logged in as an admin navigating toward the admin panel
        alert("Welcome, " + response.userName +" Admin");
        location.href = "newAdminPanel.html";

      } else if (id === 2) {
        //if logged in as user type then redirecting toward the website
        alert("Welcome User: " + response.userName);
        window.location.href = "JewelleryWeb.html";
      }else{
        alert("Login failed")//if login failed
      }

      // Create an object to store both email and name as well as userid
      const loggedInUser = {
        email: response.userEmail,
        name: response.userName,
        userid:response.userId
      };

      // store logged in user in session storage to know who is logged in and useful for fetch on different pages
      sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    },
    error: function (err) {
      // Handle error - display error message
      if (err.status === 400) {
        alert("Invalid credentials.");
      } else if (err.status === 404) {
        alert("User not found.");
      } else {
        alert("An error occured.");
        console.log(err);
        
      }
    },
  });
});

