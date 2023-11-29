using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class TestDataResult
    {
        public Guid Id {get; set;}
       public string TestName {get;set;} 
      
       public string Expected_Value {get;set;} 
       public string ResultFromServer {get;set;} 
        public string ResultComparison {get;set;} 

    }
}