
//-----------------------------------------------------Registaration detail
$("#btnSubmit").click(function(event){
  event.preventDefault();//stop the default behavior of an event

  //storing into variable so that for validation no need to write long
  const name = $("#username").val().trim();  
  const email = $("#email").val().trim();
  const phone = $("#phone").val().trim();
  const address = $("#address").val().trim();
  const password = $("#password").val().trim();
  const confirmPassword = $("#confirm-password").val().trim();

  // === VALIDATION ===---------------------------------------
  if (name === "") {
    alert("Username is required.");
    return;
  }

  if (email === "") {
    alert("Email is required.");
    return;
  }

  if (phone === "" || isNaN(phone) || phone.length !== 10) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  if (address === "") {
    alert("Please enter an address.");
    return;
  }

  if (password === "") {
    alert("Password is required.");
    return;
  }

  if (confirmPassword === "") {
    alert("Please confirm your password.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  //creating the variable which store all information of new user and then sedn via http method
    const user = {
      UserName: name,
      UserEmail: email,
      Userpassword: password,
      TypeId: 2
    };

    //let's add into the userdetails as well
    $.ajax({
        type:"POST",
        url:"http://localhost:50622/Api/AddUser",
        data:user,
        success:function(){
          //if success come the user is registered successfull and redirecting for login
            alert("user Added Successfully")
            window.location.href="./Login.html"
        },
        error:function(xhr){
          if(xhr.status == 409){
            //show the user already exist
            alert("User already Exist")
        }
        else{
          //show the message that not able to register
          alert("Not able to Register")
        }
      }
    })

    //creating data to store new Customer
    const newCustomer ={
            CustomerName:name,
            CustomerPhone: phone,
            CustomerAddress: address,
            UserId:2
        }
    //Let's add customer in customr table
  $.ajax({
  type: "POST",
  url: "http://localhost:50622/Api/Customer/Add",//url
  data: newCustomer,
  success: function () {
    console.log("Customer added successfully");//message successfully added
  },
  error: function () {
    console.error("Error");//something went wrong
  }
});

});
