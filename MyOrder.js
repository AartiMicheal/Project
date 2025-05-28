//Code to fetch the Bill details to show user Order---------------------------------------------
console.log("Enter into page");

//let's fetch logged in uer Id to fetch the bill details by their Id
const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')) || []
const userId = loggedInUser.userid;
console.log(userId)
//check wether user is logged in or not
if(loggedInUser == null){
  alert("Log in first") // show login message
}
else{
$(document).ready(function () {
  //let's check if the order is empty or not
  $.ajax({
    type: "GET",
    //url with userid of logged in user
    url: "http://localhost:50622/Api/BillDetials/Details/ByUserId?userId="+userId,
    //success response
    success: function (response) {
      console.log(response);
      if (response.length === 0) {
        //if no order detail is com show the message below
        $("#card-body").append(`
                    <h1>No order is made Yet.<br/> You can purchase Now.</h1>
                `);
      } else {
        //otherwise iterate over the response and append the each order detail in table
        response.map(function (order) {
          $("#orderTableBody").append(`
             <tr>
               <td>${order.BillDetailsID}</td>
                <td>${order.BillID}</td>
                <td>${order.ProductId}</td>
                <td>${order.BillQuatity}</td>
                <td>${order.BillAmount}</td>
             </tr>
            `);
        });
      }
    },
    error: function (xhr) {
      //xhr xml http request to check the status
        if(xhr.status == 404){
            console.log("NO order is placed")
        }
    },
  });
});

}
