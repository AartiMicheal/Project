using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApiExamApplication.Models;
namespace WebApiExamApplication.ApiControllers
{
    //Enabling cors
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "SampleHeader")]
    public class BillDetailsController : ApiController
    {       
        //creating object of Database Entity
        JewelleryDBEntities database = new JewelleryDBEntities();


        // POST: method to add bill details 
        [HttpPost]
        [Route("Api/BillDetails/Add")]
        public IHttpActionResult PostAdd(BillDTO billDto)
        {
            //check if coming object of billDto is null or not and also check the Details property contains atleaser one product object
            if (billDto == null || billDto.Details == null || !billDto.Details.Any()) {
                //return badrequest if anyone above condition is satisfied
                return BadRequest("Invalid bill data.");
            }
              
            //create the variable of Bill to store into the Bill Table
            var bill = new Bill
            {
                //store value which is required by the Bill Table
                UserID = billDto.UserID,
                //current Date 
                BillDate = DateTime.Now
            };
            //add new bill
            database.Bills.Add(bill);
            //save the changes 
            database.SaveChanges();

            //now iterate over the Bill Details property which contains the list of Product
            foreach (var item in billDto.Details)
            {
                //creating object of Bill details 
                var detail = new BillDetail
                {
                    BillID = bill.BillID,
                    ProductId = item.ProductId,
                    BillQuatity = item.BillQuantity,
                    BillAmount = item.BillAmount
                };
                //add the bill details to the BillDetail Table
                database.BillDetails.Add(detail);
            }
            //save the changes
            database.SaveChanges();
            //return the ok response with newly created bill id
            return Ok(new { BillID = bill.BillID });
        }


        // GET:method to get the details of bill by their id
        [HttpGet]
        [Route("Api/BillDetials/DetailById")]
        public IHttpActionResult GetDetailById(int billId)
        {
            try
            {
                //finding bill details using bill id
                var details = database.BillDetails
                    .Where(detail => detail.BillID == billId)//find the bill id
                    .Select(detailID => new                  // select the all bill id in bill details table
                    {
                        detailID.BillDetailsID,
                        detailID.BillID,
                        detailID.ProductId,
                        detailID.BillQuatity,
                        detailID.BillAmount
                    })
                    .ToList();//storing in list format

                return Ok(details); // Always return 200 with empty array if no details
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);//if any error occur show the message 
            }
        }

        //get all bill details
        //Http method to fetch the all Bill details
        [HttpGet]
        [Route("Api/BillDetails/AllDetails")]
        public IHttpActionResult GetAllDetails()
        {
            //try to fetch all details of bill detail and store into the List of Cart variable
            try
            {
                List<BillDetail> billDetail = database.BillDetails.ToList();//--->storing list of Bill detail
               if(billDetail != null)
                {
                    //sending the BillDetail with Ok Response
                    return Ok(billDetail);
                }
                else
                {
                    //returning status code 404 not found
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                //else send the bad request
                return BadRequest(ex.Message);
            }

        }

        //let's write a method fetch the bill details of particular User Id 
        // GET:method to get the details of bill by their user id
        [HttpGet]
        [Route("Api/BillDetials/Details/ByUserId")]
        public IHttpActionResult GetByUserId(int userId)
        {
            try
            {
                //Get all bills for the specified user
                var userBills = database.Bills.Where(bill => bill.UserID == userId).ToList();
                //check if it is empty or not
                if (userBills != null && userBills.Any())
                {
                    // List to hold bill details
                    var billDetailsList = new List<BillDetail>();

                    //iterate over the user Bill list
                    foreach (var bill in userBills)
                    {
                        // Get all details related to the current bill
                        var billDetails = database.BillDetails
                                                  .Where(detail => detail.BillID == bill.BillID)
                                                  .ToList();

                        //adding into the defined list of BillDetailList
                        billDetailsList.AddRange(billDetails);
                    }
                    //returing the bill details of specific user
                    return Ok(billDetailsList);
                }
                else
                {
                    //if Bill Id is not found
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                //if something is went wrong
                return BadRequest(ex.Message);
            }

        }
    }
}
    