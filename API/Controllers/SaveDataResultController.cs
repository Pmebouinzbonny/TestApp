using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class SaveDataResult : BaseApiController
    {
        private readonly DataContext _context;
        public SaveDataResult(DataContext context)
        {
            _context = context;
             
        }

         
        [HttpPost] // save data to Db
        public async Task< IActionResult> SaveData([FromBody] ChangeValuesRequest request)
        {
            Console.WriteLine(request);
            
            //if (_context.Tb_TestDataResults.Any()) return Ok();
            var dataToSave = new List<TestDataResult>
            {
                new TestDataResult{
                    TestName= request.Name,
                    Expected_Value= request.ExpectedValue,
                    ResultFromServer= request.ResultFromServer,
                    ResultComparison= request.ResultComparison
                }
             };
            try
            {
               await _context.DatabaseTestApp.AddRangeAsync(dataToSave);
               await _context.SaveChangesAsync();
                return Ok("Data saved successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        
        [HttpGet]// api/dataFromDb
        public async Task<ActionResult<List<TestDataResult>>> GetData_Informations()
        {
            return Ok(await _context.DatabaseTestApp.ToListAsync());
        }


        public class ChangeValuesRequest
        {
            public string Name { get; set; }
            public string ExpectedValue { get; set; }
            public string ResultComparison { get; set; }
            public string ResultFromServer { get; set; }

        }
    }
}