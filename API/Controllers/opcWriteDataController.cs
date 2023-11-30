using Microsoft.AspNetCore.Mvc;
using Opc.UaFx.Client;
using System.Globalization;
using System.Windows;




namespace API.Controllers
{

    /*[ApiController]
    [Route("api/[controller]")] // localhost 5000 / */
    public class OpcSample : BaseApiController
    {
        private static string urlServerEndPoint = "url";
        private static OpcClient myClient = null;

        [HttpPost]
        public IActionResult WriteData([FromBody] ChangeValuesRequest request)
        {
            // set the server adress
            urlServerEndPoint = request.urlServerEndPoint;
            // create and connect client to server
            if (myClient != null)
            {
                myClient.Disconnect();
            }
            myClient = new OpcClient(urlServerEndPoint);
            myClient.Connect();
            var nodeId = request.NodeId;
            string dataType = request.DataType;
            string value1 = request.NodeValue;
            //write the value through the node
            if (dataType == "Int16")
            {
                myClient.WriteNode(nodeId, Int16.Parse(value1));
            }
            else if (dataType == "String")
            {
                myClient.WriteNode(nodeId, value1);
            }
            else if (dataType == "Boolean")
            {
                myClient.WriteNode(nodeId, bool.Parse(value1));
            }
            else if (dataType == "Double")
            {
                myClient.WriteNode(nodeId, Double.Parse(value1));
            }
            else if (dataType == "Float")
            {
                myClient.WriteNode(nodeId, float.Parse(value1, CultureInfo.InvariantCulture.NumberFormat));
            }
            // disconnect from server
            myClient.Disconnect();
            //return ok
            return Ok();
        }
        // class to assign request value into the write method


        public class ChangeValuesRequest
        {
            public string NodeValue { get; set; }
            public string DataType { get; set; }
            public string NodeId { get; set; }
            public string urlServerEndPoint { get; set; }

        }
    }

}

