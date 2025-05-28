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
    public class CategoryController : ApiController
    {
        //creating db-Databse context  
        JewelleryDBEntities dbContext = new JewelleryDBEntities();

        //http method to get all the category
        [HttpGet]
        [Route("Api/Category")]
        public IHttpActionResult GetCategory()
        {
            try
            {
                //returning all category in order of ID
                List<Category> category = dbContext.Categories.OrderBy(catitems => catitems.CategoryId).ToList();
                if (category != null)
                {
                    //if category is not null returning list of category table records
                    return Ok(category);
                }
                else
                {
                    //if not found categories (404)
                    return NotFound();
                }
            }
            catch(Exception ex)
            {
                //show the exception message
                HttpContext.Current.Response.Write(ex.Message);
                //send server side issue is occured (500)
                return InternalServerError();

            }

        }

        
        //http method to delete the category by ID
        [HttpDelete]
        [Route("Api/Category/CategoryId")]
        public IHttpActionResult DeleteCategoryId(int id)
        {
            try
            {
                //find out the category which have to be delete by given id
                var category = dbContext.Categories.Where(catItem => catItem.CategoryId == id).FirstOrDefault();
                //check if category is found by id
                if(category != null)
                {
                    //remove the category from the Table category
                    dbContext.Categories.Remove(category); 
                    //save the changes
                    dbContext.SaveChanges();
                    //return success  response
                    return Ok();
                }
                else
                {
                    //if category not found
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

        //Add category by name
        [HttpPost]
        [Route("Api/Category/Add")]
        public IHttpActionResult PostAdd(Category categoryName)
        {
            try
            {
                //filter out the if the category name is already in category table or not
                var isCategoryExist = dbContext.Categories.Where(catItems => catItems.CategoryName == categoryName.CategoryName).FirstOrDefault();
                //check if category is present or not
                if (isCategoryExist == null)
                {
                    //add new Category 
                    dbContext.Categories.Add(categoryName);
                    //save the changes
                    dbContext.SaveChanges();
                    //return successful if product is added
                    return Ok();
                }
                else
                {
                    //if the match alredy present in the Category Table
                    return Content(HttpStatusCode.Conflict, "Category already exist");
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

        //search category by name
        [HttpGet]
        [Route("Api/Category/SearchByName")]
        public IHttpActionResult GetSearchByName(string categoryName)
        {
            try
            {
                //checking in table whether the Name of category present or not
                var categoryExist = dbContext.Categories.Where(catItems => catItems.CategoryName == categoryName).FirstOrDefault();
                if (categoryExist != null)
                {
                    //if found then return ok and product of that name
                    return Ok(categoryExist);
                }
                else
                {
                    //if not found then return no found
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

        //Fetch category by name for product showing
        [HttpGet]
        [Route("Api/Category/FetchByName")]
        public IHttpActionResult GetFetchByName(string categoryName)
        {
            try
            {
                //checking in table whether the Name of category present or not
                var isCategoryExist = dbContext.Categories.Where(catItems => catItems.CategoryName == categoryName).FirstOrDefault();
                //check if category found or not
                if (isCategoryExist != null)
                {
                    var productByCategory = dbContext.ProductMasters.Where(product => product.Category.CategoryName == categoryName).ToList();
                    //send the product by the category requested
                    return Ok(productByCategory);
                }
                else
                {
                    //if not found then return no found -404
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
    }
}
