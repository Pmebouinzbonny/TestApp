using Microsoft.AspNetCore.Mvc;
using Opc.UaFx.Client;



namespace API.Controllers
{

    public class OpcReadData : BaseApiController
    {
        private static string nodeIdRead = "";
        private static OpcClient myClient = null;

        private static string urlEndPoint = "URL";

        [HttpPost]
        public IActionResult WriteNodeValue([FromBody] ChangeValuesRequest request)
        {
            // node to read and urlserveradress to connect
            nodeIdRead = request.NodeId;
            urlEndPoint = request.UrlServerEndPoint;
            return Ok();
        }

        public record OpcValue(object Value, string DataType, string NodeId);

        [HttpGet]
        public IActionResult GetDataFromOPCUaServer()
        {
            // if a client is connected, first deconnect
            if (myClient != null)
            {
                myClient.Disconnect();
            }
            // set the url-adress the server
            var _url = urlEndPoint;

            //create a new client and connect to server

            myClient = new OpcClient(urlEndPoint);//"opc.tcp://127.0.0.1:4840/"
            myClient.Connect();

            // node to read
            var nodeId = nodeIdRead;
            Console.WriteLine(nodeId);

            // read node informations
            var value = myClient.ReadNode(nodeId);
            // disconnect 
            myClient.Disconnect();

            // return the data in a modell form that content value, datatype, nodeId from a node
            if (value.DataType.ToString() == "Boolean")
            {
                return Ok(new OpcValue(value.Value.ToString(), value.DataType.ToString(), nodeId));
            }
            else if (value.DataType.ToString() == "Int16")
                return Ok(new OpcValue(value.Value, value.DataType.ToString(), nodeId));
            else if (value.DataType.ToString() == "Float")
                return Ok(new OpcValue(value.Value, value.DataType.ToString(), nodeId));
            else if (value.DataType.ToString() == "Double")
                return Ok(new OpcValue(value.Value, value.DataType.ToString(), nodeId));
            else
                return Ok();

        }


        public class ChangeValuesRequest
        {
            public string Value { get; set; }
            public string DataType { get; set; }
            public string NodeId { get; set; }
            public string UrlServerEndPoint { get; set; }

        }

    }
}