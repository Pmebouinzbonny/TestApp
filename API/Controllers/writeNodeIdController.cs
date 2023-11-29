using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public  class WriteNodeIdController : BaseApiController
    {
        public static string nodeIdRead = "";
        [HttpPost]
        public IActionResult WriteNodeValue([FromBody] ChangeValuesRequest request)
        {
            nodeIdRead = request.NodeId;
            Console.WriteLine("nodeId", nodeIdRead);
            //myClient.Disconnect();
            return Ok();
        }

        public class ChangeValuesRequest
        {
            public string Value { get; set; }
            public string DataType { get; set; }
            public string NodeId { get; set; }

        }

    }
}