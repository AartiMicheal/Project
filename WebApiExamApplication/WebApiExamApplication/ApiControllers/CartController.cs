using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApiExamApplication.Models;
using System.Web;
using System.Web.Http.Cors;

namespace WebApiExamApplication.ApiControllers
{

    //enablie cors allows  web API to accept requests from different origins
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "SampleHeader")]
    public class CartController : ApiController
    {
        //creating object of  db-Databse context
        JewelleryDBEntities jewellDB = new JewelleryDBEntities();


        //Http method to fetch the all carts details
        [HttpGet]
        [Route("Api/Cart/AllCart")]
        public IHttpActionResult GetAllCart()
        {
            //try to fetch all details of cart and store into the List of Cart variable
            try
            {
                List<Cart> cartDetail = jewellDB.Carts.ToList();//--->storing list of cart detail
                //check if cart detail is empty or not
                if(cartDetail!=null)
                {
                    return Ok(cartDetail);//sending the cartdetail with Ok Response
                }
                else
                {
                    //return not found 404
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                //if exception occur show the message
                HttpContext.Current.Response.Write(ex.Message);
                //returning server side error occured(500)
                return InternalServerError();
            }

        }

        //Http method to fetch by Id to particular Cart
        [HttpGet]
        [Route("Api/Cart/ById")]
        public IHttpActionResult GetById(int id)
        {
            //let's find and return the cart according to the card id
            var cartById = jewellDB.Carts.Where(cart => cart.CartID == id).FirstOrDefault();
            try
            {
                //check if we found the particular cart or not
                if (cartById != null)
                {
                    return Ok(cartById);//-->if found return the result
                }
                else
                {
                    return NotFound();//-->if not found 
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);//-->something went wrong
            }
        }


        //Now let's create method to delete the particular cart by their product id and user  id matched
        [HttpDelete]
        [Route("Api/Cart/DeleteId")]
        public IHttpActionResult DeleteDeleteId(int id, int userid)
        {
            try
            {
                //le'ts check whether the particualr id present or not
                var cardId = jewellDB.Carts.Where(cart => cart.ProductId == id && cart.UserID == userid).FirstOrDefault();

                //let's see if it is not null means we found the Card Id in Cart
                if (cardId != null)
                {
                    //if we found the id then removing the particular cart detail from the Cart Table
                    jewellDB.Carts.Remove(cardId);
                    jewellDB.SaveChanges();//--> save the changes
                    return Ok(); //-->return successfully deleted.
                }
                else
                {
                    return NotFound();//not found 404 request
                }
            }
            catch (Exception ex)
            {
                //if exception occur show the message
                HttpContext.Current.Response.Write(ex.Message);
                return InternalServerError();//--> showing server side error occured
            }
        }

        //let's finally write for the Add cart details in the cart Table
        [HttpPost]
        [Route("Api/Cart/InsertCart")]
        public IHttpActionResult PostInsertCart(Cart newCart)
        {
            try
            {
                //check if the new Cart detail is null or not
                if (newCart == null)
                {
                    return BadRequest("Cart data is missing");//if null return the badrequest message(client side error)
                }

                // Check if a cart entry already exists for this user and product
                var existingCart = jewellDB.Carts
                    .FirstOrDefault(cart => cart.UserID == newCart.UserID && cart.ProductId == newCart.ProductId);

                //if we found the cart then update the quantity 
                if (existingCart != null)
                {
                    // Update quantity 
                    existingCart.CartQuantity += 1;
                    //update subtotal
                    existingCart.SubTotal = existingCart.UnitPrice * existingCart.CartQuantity;
                    //save the changes
                    jewellDB.SaveChanges();
                    return Ok("Cart updated");
                }
                else
                {
                    //as we don't found the newCart then  New cart entry
                    jewellDB.Carts.Add(newCart);
                    jewellDB.SaveChanges();//save the changes
                    //return successfull message
                    return Ok("Cart item added");
                }
            }
            catch (Exception ex)
            {
                //if exception occur show the message
                HttpContext.Current.Response.Write(ex.Message);
                //showing the error occured (500)
                return InternalServerError(); 
            }
        }

        //Let's write the method to update the quantity and total amount of existing product
        [HttpPut]
        [Route("Api/Cart/Quantity")]
        public void PutQuantity(int id, int userid, int quantity)//taking productid, userid, and quantity(1,-1)
        {
            //let's chek if the  product id of particular cart is present or not
            try
            {
                //this is for + and - button functionality of Frontend fetch user, product id and then update quantity
                var productId = jewellDB.Carts.Where(cartItem => cartItem.ProductId == id
                && cartItem.UserID == userid
                ).FirstOrDefault();//matching with product id and user id so quantity can be updated.
                //check if  product is present for particular user
                if (productId != null)
                {
                    // we have to update the quantity
                    productId.CartQuantity += quantity;
                    //updating subtotal
                    productId.SubTotal = productId.UnitPrice * productId.CartQuantity;
                    //checking if it become zero or less then remove from the cart
                    if (productId.CartQuantity <= 0)
                    {
                        //after updating cart Quantity if it become 0 then remove from the Database.
                        jewellDB.Carts.Remove(productId);
                        jewellDB.SaveChanges();//save the changes 
                        return;
                    }
                    jewellDB.SaveChanges();//save the changes
                    return;
                }
                else
                {
                    //message that product is not present
                    HttpContext.Current.Response.Write("The product id is not present");
                }
            }
            catch (Exception ex)
            {
                //showing the message the Exception is occured
                HttpContext.Current.Response.Write(ex.Message);
            }
        }

        // method to fetch all the product of particular userid but checking inside the cart table
        [HttpGet]
        [Route("Api/Cart/ByUserId")]
        public IHttpActionResult GetByUserId(int userId)
        {
            try
            {
                //check the userId in cart
                var isUserId = jewellDB.Carts.Where(cart => cart.UserID == userId).ToList();
                //checking if we found the userId then send the cart detail of that userId
                if (isUserId != null)
                {
                    //if found then 200 status
                    return Ok(isUserId);
                }
                else
                {
                    //return the not found status-->404
                    return NotFound();
                }
            }
            catch(Exception ex)
            {
                //method to return when the request is not fullfilled 
                return BadRequest(ex.Message); 
            }
        }

        //Now let's create method to delete the particular cart by their product id and user  id matched
        [HttpDelete]
        [Route("Api/Cart/ByUserId")]
        public IHttpActionResult DeleteByUserId(int userid)
        {
            try
            {
                //le'ts check whether the particualr id present or not
                var cartImes = jewellDB.Carts.Where(cart => cart.UserID == userid).ToList();

                //let's see if it is not null means we found the Card Id in Cart
                if (cartImes != null)
                {
                    //if we found the id then removing the particular cart detail from the Cart Table
                    jewellDB.Carts.RemoveRange(cartImes);
                    jewellDB.SaveChanges();//-->save changes
                    return Ok(); //-->return successfully deleted.
                }
                else
                {
                    return NotFound();//not found 404 request
                }
            }
            catch (Exception ex)
            {
                //if exception occur show the message
                HttpContext.Current.Response.Write(ex.Message);
                return InternalServerError();//respond a message if any exception occur
            }
        }
    }
}
