using Microsoft.AspNetCore.Mvc;
using Opc.UaFx;
using Opc.UaFx.Client;


namespace API.Controllers
{
    public class OpcUaRootServer : BaseApiController
    {
        private static OpcClient myClient = null;
        private static string dataType = "SUBNODE";
        private static string nodeIdValue = "Value";
        private static string urlEndPoint = "url";//="opc.tcp://127.0.0.1:4840/";



        [HttpPost]
        public IActionResult WriteUrlEndPoint([FromBody] ChangeValuesRequest request)
        {

            urlEndPoint = request.UrlServerEndPoint;
            Console.WriteLine(urlEndPoint);

            //myClient.Disconnect();
            return Ok();
        }

        //public record OpcRootValue(string name, string NodeId, object children);

        public record OpcNode(string Name, string NodeId, List<OpcNode> children, string datatype, string nodeValue)
        {

            public static OpcNode Create(OpcNodeInfo info)
            {
                  //Console.WriteLine(info.Attribute(OpcAttribute.NodeId).Value.ToString().ToLower());
           
                    if (info.Attribute(OpcAttribute.NodeId).Value.ToString().ToLower().Contains("ns=")) // Attributefor BuR :  ns=6;s=::  
                                                                                                        // Attribute for Schneider : ns= 
                    {
                    
                        try
                        {
                            OpcNodeInfo opcNodeInfo = myClient.BrowseNode(info.NodeId);
                            var nodeValue = myClient.ReadNode(info.NodeId);
                            var opcVariableNodeInfo = opcNodeInfo as OpcVariableNodeInfo;
                            //Console.WriteLine(opcVariableNodeInfo);
                          
                            //Console.WriteLine(dataType);

                            if (opcVariableNodeInfo != null)
                            {
                                // https://reference.opcfoundation.org/v104/PLCopen/v102/docs/9.2.1/
                                // datatypeid looks like 'i=1'; (Compare with number in 'OPC UA built-in data types' column)
                                var value = opcVariableNodeInfo.DataTypeId.ToString().Split('=')[1];

                                switch (value)
                                {
                                    case "1":
                                        dataType = "Boolean";
                                        break;

                                    case "2":
                                        dataType = "SByte";
                                        break;

                                    case "3":
                                        dataType = "Byte";
                                        break;

                                    case "4":
                                        dataType = "Int16";
                                        break;

                                    case "5":
                                        dataType = "UInt16";
                                        break;

                                    case "6":
                                        dataType = "Int32";
                                        break;

                                    case "7":
                                        dataType = "UInt32";
                                        break;

                                    case "8":
                                        dataType = "Int64";
                                        break;

                                    case "9":
                                        dataType = "UInt64";
                                        break;

                                    case "10":
                                        dataType = "Float";
                                        break;

                                    case "11":
                                        dataType = "Double";
                                        break;

                                    case "12":
                                        dataType = "String";
                                        break;

                                    case "13":
                                        dataType = "DateTime";
                                        break;

                                    default:
                                        dataType = "TBD";
                                        break;
                                }

                                dataType = $"{dataType}";
                                nodeIdValue = nodeValue.ToString();
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Exception: {ex.Message}");
                        }
                    }

           
                // Rekursiv
                var node = new OpcNode(info.DisplayName, info.NodeId.ToString(), new List<OpcNode>(), dataType, nodeIdValue);
                foreach (var child in info.Children())
                {
                    node.children.Add(OpcNode.Create(child));
                }
                return node;
            }
        }

        [HttpGet]
        public IActionResult GetRootNode()
        {
            if (myClient != null)
            {
                myClient.Disconnect();
            }
            var _url = urlEndPoint;
            // Browse(rootNode);
            myClient = new OpcClient(_url);
            myClient.Connect();
            var rootNode = myClient.BrowseNode(OpcObjectTypes.RootFolder);
            return Ok(OpcNode.Create(rootNode));

        }

        public static void Browse(OpcNodeInfo node, int level = 0)
        {

            // ns=6;s=::Program:Var_Out_1
            if (node.Attribute(OpcAttribute.NodeId).Value.ToString().ToLower().Contains("ns=6;s=::program"))
            {

                try
                {
                    OpcNodeInfo opcNodeInfo = myClient.BrowseNode(node.NodeId);

                    var dataType = "SUBNODE";

                    var opcVariableNodeInfo = opcNodeInfo as OpcVariableNodeInfo;

                    if (opcVariableNodeInfo != null)
                    {
                        // https://reference.opcfoundation.org/v104/PLCopen/v102/docs/9.2.1/
                        // datatypeid looks like 'i=1'; (Compare with number in 'OPC UA built-in data types' column)
                        var value = opcVariableNodeInfo.DataTypeId.ToString().Split('=')[1];

                        switch (value)
                        {
                            case "1":
                                dataType = "BOOLEAN";
                                break;

                            case "2":
                                dataType = "SBYTE";
                                break;

                            case "3":
                                dataType = "BYTE";
                                break;

                            case "4":
                                dataType = "INT16";
                                break;

                            case "5":
                                dataType = "UINT16";
                                break;

                            case "6":
                                dataType = "INT32";
                                break;

                            case "7":
                                dataType = "UINT32";
                                break;

                            case "8":
                                dataType = "INT64";
                                break;

                            case "9":
                                dataType = "UINT64";
                                break;

                            case "10":
                                dataType = "FLOAT";
                                break;

                            case "11":
                                dataType = "DOUBLE";
                                break;

                            case "12":
                                dataType = "STRING";
                                break;

                            case "13":
                                dataType = "DATETIME";
                                break;

                            default:
                                dataType = "TBD";
                                break;
                        }

                        dataType = $"{dataType} ({opcVariableNodeInfo.DataTypeId})";
                    }

                    Console.WriteLine($"{node.NodeId.ToString(OpcNodeIdFormat.Foundation)} - {dataType}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception: {ex.Message}");
                }
            }

            level++;

            foreach (var childNode in node.Children())
                Browse(childNode, level);
        }

        public class ChangeValuesRequest
        {
            public string UrlServerEndPoint { get; set; }

        }
    }
}