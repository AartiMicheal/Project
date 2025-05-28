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
    //enablie cors allows  web API to accept requests from different origins
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "SampleHeader")]

    public class UserDetailsController : ApiController
    {
        //creating db-Databse context entity 
        JewelleryDBEntities dbContext = new JewelleryDBEntities();

        //http method for Logging and returning which type of user is logging 
        [HttpPost]
        [Route("Api/LoginUser")]
        public IHttpActionResult PostLogin(UserDetail user)
        {
            try
            {
                //check if user's email  is present or not and matched with password
                var userFound = dbContext.UserDetails.Where(userT => userT.UserEmail == user.UserEmail
                && userT.UserPassword == user.UserPassword).FirstOrDefault();
                
                //if user found the and send the data with ok response
                if (userFound != null)
                {
                    //sending user detail  
                    var userDetail = new
                    {
                        //assigning value to the each variable
                        userName = userFound.UserName,
                        userEmail = userFound.UserEmail,
                        userId = userFound.UserID,
                        userTypeId = userFound.TypeId
                    };
                    //return ok status with userDetails
                    return Ok(userDetail);
                }
                else
                {
                    //else not found
                    return NotFound();
                }
            }catch(Exception ex)
            {
                //returning bad request if exception occur
                return BadRequest(ex.Message);
            }
        }

        //adding the new User
        //http post method for adding the new user
        [HttpPost]
        [Route("Api/AddUser")]
        public IHttpActionResult PostAddUser(UserDetail user)
        {
            try
            {
                //check if user's email id is present or not and matched with password
                var userFound = dbContext.UserDetails.Where(userT => userT.UserEmail == user.UserEmail
                && userT.UserPassword == user.UserPassword).FirstOrDefault();

                //if user is not present already add the user 
                if (userFound == null)
                {
                    //if user is not present le's add  user detail
                    dbContext.UserDetails.Add(user);
                    //save the chagnes
                    dbContext.SaveChanges();
                    //returing ok respnose 
                    return Ok();
                }
                else
                {
                    //else user found 404
                    return NotFound();
                }
            }catch(Exception ex)
            {
                //showing internal server error occur 500
                return InternalServerError();
            }
        }
    }
}
