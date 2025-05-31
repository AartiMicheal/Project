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
    public class ProductController : ApiController
    {
        //creating objectof  db-Databse context  
        JewelleryDBEntities dbContext = new JewelleryDBEntities();
        
        //http method to get all Product 
        [HttpGet]
        [Route("Api/Product/AllProduct")]
        public IHttpActionResult GetAllProduct()
        {
            try
            {
                //fetch all the product
                var product = dbContext.ProductMasters.ToList();
                //return ok status with product detail
                return Ok(product);

            }catch(Exception ex)
            {
                //return badrequest if any exception occur
                return BadRequest(ex.Message);
            }

        }


        //http method to fetch product by product ID
        [HttpGet]
        [Route("Api/Product/ById")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                //searching and storing the Product by id
                //temp is a parameter name representing each item in the ProductMasters
                var product = dbContext.ProductMasters.Where(temp => temp.ProductId == id).FirstOrDefault(); 
               if (product != null)
                {
                    //return if Product is found
                    return Ok(product);
                }
                else
                {
                    //return 404 not founc
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                //return if any exceptin occur
                return BadRequest(ex.Message);
            }
        }

        //http method to Add new Data to Product Table
        [HttpPost]
        [Route("Api/Product/Add")]
        public IHttpActionResult PostAdd(ProductMaster newProduct)
        {
            try
            {
                //if product is null then stop here
                if (newProduct == null)
                {
                    //return response that user side error is occured
                    return BadRequest();
                }

                //check if the same name product is alredy exist.
                var isProductExist = dbContext.ProductMasters.Where(product => product.ProductName == newProduct.ProductName).FirstOrDefault();
                //check if product present already or not
                if (isProductExist == null)
                {
                    //if product is not already present then add new product
                    dbContext.ProductMasters.Add(newProduct);
                    //save the changes
                    dbContext.SaveChanges();
                    //give ok response after adding the product successfully(200)
                    return Ok();
                }
                else
                {
                    //if product is already exist don't add
                    HttpContext.Current.Response.Write("Product not added");
                    //return that conflict is generated because product is already present (409)
                    return Conflict();
                }
            }
            catch (Exception ex)
            {
                //show the exception message
                HttpContext.Current.Response.Write(ex.Message);
                //send server side issue is occured (500)
                return InternalServerError();
            }
        }


        //http method to delete product by id
        [HttpDelete]
        [Route("Api/Product/ByIdDelete")]
        public IHttpActionResult DeleteByIdDelete(int id)
        {
            try
            {
                //deleting the product by finidng thier id in product master table.
                var product = dbContext.ProductMasters.Where(products => products.ProductId == id).FirstOrDefault();
                //check if we found the product id details or not
                if (product != null)
                {
                    //remove the product
                    dbContext.ProductMasters.Remove(product);
                    //save the changes
                    dbContext.SaveChanges();
                    //returning ok response to show product delted successfully\
                    return Ok();
                }
                else
                {
                    //show the product is not found
                    HttpContext.Current.Response.Write("Product id is not found.");
                    //if product id is not found(400)
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


        //http method to update the existing product by through Id refernece
        [HttpPut]
        [Route("Api/Product/Update")]
        public IHttpActionResult PutUpdate(ProductMaster updateProduct)
        {
            try
            {
                //let's check if which product we have to update 
                var product = dbContext.ProductMasters.Where(productItem => productItem.ProductId == updateProduct.ProductId).FirstOrDefault();
                //chek if product is exist of updateProduct in the Product master
                if (product != null)
                {
                    //assign new product value to the existing product
                    product.ProductName = updateProduct.ProductName;
                    product.ProductPrice = updateProduct.ProductPrice;
                    product.ProductQuantity = updateProduct.ProductQuantity;
                    product.ProductDescription = updateProduct.ProductDescription;
                    product.ProductImage = updateProduct.ProductImage;
                    product.CategoryId = updateProduct.CategoryId;
                    //save the changes
                    dbContext.SaveChanges();
                    //show the success status
                    return Ok();
                }
                else
                {
                    //product is not found in the product master
                    return NotFound();
                }
            }
            catch(Exception ex)
            {
                //printng the error at server side
                HttpContext.Current.Response.Write(ex.Message);
                //showing server side error occur (500)
                return InternalServerError();
            }
        }


        //finding Product by name
        [HttpGet]
        [Route("Api/Product/SearchByName")]
        public IHttpActionResult GetSearchByName(string productName)
        {
            try
            {
                //checking in table whether the Name of category present or not
                var productExist = dbContext.ProductMasters.Where(catItems => catItems.ProductName == productName).FirstOrDefault();
                //check if product exist or not
                if (productExist != null)
                {
                    //if found then return ok and product of that name
                    return Ok(productExist);
                }
                else
                {
                    //if not found then return no found
                    return NotFound(); 
                }

            }
            catch (Exception ex)
            {
                //printng the error at server side
                HttpContext.Current.Response.Write(ex.Message);
                //shwoing server side error occured
                return InternalServerError();
            }
        }
    }
}
