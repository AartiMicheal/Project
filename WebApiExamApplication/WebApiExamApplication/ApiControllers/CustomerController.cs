using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Web.Http.Cors;
using WebApiExamApplication.Models;

namespace WebApiExamApplication.ApiControllers
{
    //enablie cors allows  web API to accept requests from different origins
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "SampleHeader")]
    public class CustomerController : ApiController
    {
        //creating db-Databse context  
        JewelleryDBEntities dbContext = new JewelleryDBEntities();

        //---------let's store all the customer detail in Customer Table
        [HttpPost]
        [Route("Api/Customer/Add")]
        public IHttpActionResult PostAdd(CustomerMaster newCustomer)
        {
            //let's validate first wether the Phone of user already exist or not
            var isPhone = dbContext.CustomerMasters.Where(customer => customer.CustomerPhone == newCustomer.CustomerPhone).FirstOrDefault();
            try
            {
                //if phone number is already not present then add the new customer
                if (isPhone == null)
                {
                    var userid = dbContext.UserDetails.Where(user => user.UserName == newCustomer.CustomerName).FirstOrDefault();
                    //creating customer object 
                    var newDetailCustomer = new CustomerMaster
                    {
                       //store infromation of custome informatino
                        CustomerName = newCustomer.CustomerName,
                        CustomerAddress = newCustomer.CustomerAddress,
                        CustomerPhone = newCustomer.CustomerPhone,
                        UserId = userid.UserID
                    };
                    //add the new customer 
                    dbContext.CustomerMasters.Add(newDetailCustomer);
                    //save the changes
                    dbContext.SaveChanges();
                    //successfully added new customer
                    return Ok();
                }
                else
                {
                    //the product is already exist(409)
                    return Conflict();
                }
            }
            catch (Exception ex)
            {
                //show the exception message
                HttpContext.Current.Response.Write(ex.Message);
                //show somethng happened server side(500)
                return InternalServerError();
            }
        }
        
        //----------this is for fething all the Customer form Customer table
        //let's store all the customer detail in Customer Table
        [HttpGet]
        [Route("Api/Customer/AllCustomer")]
        public IHttpActionResult GetAllCustomer()
        {
            try
            {
                //send fetched customer 
                List<CustomerMaster> customer = dbContext.CustomerMasters.ToList();
                if (customer != null)
                {
                    //return ok with response list of customer
                    return Ok(customer);
                }
                else
                {
                    //404 not found status
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                //show the exception message
                HttpContext.Current.Response.Write(ex.Message);
                //return error if not able to fetch
                return InternalServerError();
            }
        }

        //----------http method to fetch customer by their ID
        [HttpGet]
        [Route("Api/Customer/CustomerIdByUserId")]
        public IHttpActionResult GetCustomerById(int userId)
        {
            try
            {
                //store the variable of Fetched userin CustomrId
                var cusotmerid = dbContext.CustomerMasters.Where(customer => customer.UserId == userId).FirstOrDefault();
                //check if found the id of customer in customer table or not
                if (cusotmerid != null)
                {
                    //returning ok status with customer which we found by thier id
                    return Ok(cusotmerid);
                }
                else
                {
                    //If usernot foun
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                //showing exception message
                HttpContext.Current.Response.Write(ex.Message);
                //showing error occured at server side
                return InternalServerError();
            }
        }

    }
}
