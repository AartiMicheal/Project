using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiExamApplication
{
    //creating a class so that we can store a user's product list(multiple product)
    public class BillDTO
    {
        //propertis of Bill dto
            public int UserID { get; set; }
            public List<BillDetailDTO> Details { get; set; }//detail of product list will be stored
        
    }
    //BillDetail Dto in which we store the each product which is selected by individual user
    public class BillDetailDTO
    {
        //declarting property of Bill Detail
        public int ProductId { get; set; }
        public int BillQuantity { get; set; }
        public int BillAmount { get; set; }
    }
}