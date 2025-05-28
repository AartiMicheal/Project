
//---------------Function for displaying the Ordered of user to the admin-------------------------

$(document).ready(function () {
    //click event to load the order detail in table container
    $(".showOrder").click(function(){
        console.log("Clicked")
        //let's write the ajax call to fetch the order 
        $.ajax({
            type:"GET",
            url:"http://localhost:50622/Api/BillDetails/AllDetails",
            success:function(response){
                //ensuring data is coming
                console.log(response)
                //iteratie over the response
                response.map(orders => {
                    //storing each row in tRow variable representing table row
                     const tRow = $(`
                        <tr>
                            <td> ${orders.BillDetailsID} </td>
                            <td>${orders.BillID}</td>
                            <td>${orders.ProductId}</td>
                            <td>${orders.BillQuatity}</td>
                            <td>${orders.BillAmount}</td>
                        </tr>
                        `)
                        console.log(tRow)
                        //appendng each row 
                        $("#orderTableBody").append(tRow);
                        //after that the table of order is visible using show method
                        $("#orderTableContainer").show();
                });
            },
            error:function(){
                //error if not able to load the order details
                console.log("Failed to fetch the order details.");
            }
        })
    })
});