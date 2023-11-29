import { useEffect, useState } from 'react';
import axios from 'axios';
import { rootOpcValue } from '../../../models/rootOpcValue';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Dropdown, Form, Grid, Icon, Input, Segment, Table } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import MethodeToWriteData from './CreateMethodeToWrite';
import MethodeToReadData from './CreateMethodeToRead';
import MethodeToEnterNodeIdToRead from './CreateMethodeToEnterNodeId';
import { OpcValue } from '../../../models/valueopc';
import { sleep } from './CreateMethodeToDelay';
import DocumentGenerator from './DocumentGenerator';
import { randomUUID } from 'crypto';

const initialList = [{
    id: '',
    input: '',
},]

interface Props_AddInput {

    input: string;
    value: string
    setInput: (newInput: string) => void;
    setAktiv: () => void;

}
const options = [
    { key: 'write', text: 'Write', value: 'Write' },
    { key: 'read', text: ' Read', value: 'Read' },
    { key: 'wait', text: ' Wait', value: 'Wait' },
    { key: 'Assert', text: 'Assert', value: 'Assert' },
]



// function to add Input dynamically
function AddInput({ value, input, setInput, setAktiv }: Props_AddInput) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInput(event.currentTarget.value);

    }
    return <>
        <Form>

            <Form.Input type="text" value={value} onChange={handleChange} onClick={setAktiv} action={
                <div>

                    <Dropdown button basic floating options={options} defaultValue='Write' />

                </div>}>

            </Form.Input>
        </Form>
    </>
}

interface Props {
    UrlServerEndPoint: string,

}


interface ITreeNode {
    children: ITreeNode[];
    nodeId: string;
}

function depthFirst(root: ITreeNode, action: (node: ITreeNode) => void) {
    action(root);
    root.children.forEach(child => {
        depthFirst(child, action);
    })
}
// function to get the root, to read/write the node properties, to run test, 
function RootNodeTree({ UrlServerEndPoint }: Props) {
    const [rootNode, setRootNode] = useState<rootOpcValue>({ name: "", nodeId: "", children: [], datatype: "", nodeValue: "" });
    const [selectedItem, setSelectedItems] = useState<rootOpcValue>();
    const [isVisible, setIsvisible] = useState<boolean>(false);
    const [list, setList] = useState(initialList);
    const [aktiv, setAktiv] = useState(0);
    const [inputdata, setInputdata] = useState({ name: selectedItem?.name, nodeValue: selectedItem?.nodeId, nodeId: selectedItem?.nodeId, dataType: selectedItem?.datatype, method: "" });
    const [selectedMethod, setSelectedMethod] = useState("Choose");
    const [inputarr, setInputarr] = useState<any>([]);
    const [inputValueToCompareReadValueWith, setInputValueToCompareReadValueWith] = useState<string>("");
    const [compareResult, SetCompareResult] = useState<string>("");
    const [isButtonTestPress, setIsButtonTestPress] = useState(false)
    //const [tableRows, setTableEows]= useState()
    // 
    const dictionary = new Map<string, any>();
    depthFirst(rootNode, node => {
        dictionary.set(node.nodeId, node);
    });
    function handleSelectedItem(item: string) {
        const opcNode = dictionary.get(item);

        if (!opcNode) { return; }
        setSelectedItems(opcNode);

    }

    /*   function cancelSelectItem() {
           setSelectedItems(undefined);
       }
   
       function handleAdd() {
   
           setList([...list, { input: `BOB`, id: uuidv4() }]);
       }
       // function to remove a textfield
       function handleRemove() {
           setList([...list.filter((item, index) => index !== aktiv)]);
       }
       function setInputBeiIndex(input: string, index: number) {
           const newList = [...list];
           newList[index].input = input;
           setList(newList);
       }
       // function to have the selected textfield
       function setActivIndex(index: number) {
           setAktiv(index);
       }*/

    // assign the value of the selectedItem to the formValues so that 
    if (inputdata.name !== selectedItem?.name) {

        inputdata.name = selectedItem?.name;
        inputdata.nodeValue = selectedItem?.nodeValue;
        inputdata.nodeId = selectedItem?.nodeId;
        inputdata.dataType = selectedItem?.datatype;
    }

    // handle inputs
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        {
            setInputdata({
                ...inputdata,
                [e.target.name]: e.target.value
            })
        }
        console.log(inputdata)

    }

    // write data to dB
    function handleWriteData() {
        MethodeToWriteData(inputdata.name, inputdata.nodeId, inputdata.dataType, inputdata.nodeValue, UrlServerEndPoint);

    }
    console.log(inputdata)

    const [isMethodCompareChoose, setIsMethodCompareChoose] = useState(true);
    // manage DropDown to choose methods to use 
    function handleDropDownChange(e: React.SyntheticEvent<HTMLElement, Event>, data: any) {
        console.log("datavalue", data.value)
        if (selectedMethod !== data.value) {
            let newValue = data.value
            setSelectedMethod(newValue)
            console.log("selectmethod", selectedMethod)
            setIsValueForTimeOut(false);
        }

        // if selectedMethod is Read, make value null
        console.log("methodeafterselectRead", selectedMethod)
        if (selectedMethod !== "Read" && data.value === "Read") {
            selectedItem!.nodeValue = "";
            inputdata.nodeValue = selectedItem?.nodeValue;
            setIsMethodCompareChoose(true);
            setIsValueForTimeOut(false);

        }
        if (selectedMethod !== "Wait" && data.value === "Wait") {
            setIsValueForTimeOut(true);
            if (IsCreateANewTable === false) {
                setInputarr([...inputarr, { name: "", nodeValue: "", nodeId: "", dataType: "", method: "Wait" }])
            } else {
                SetInputarrayTable2([...inputarrayTable2, { name: "", nodeValue: "", nodeId: "", dataType: "", method: "Wait" }])
            }
        }

        setInputdata({ name: inputdata.name, nodeValue: inputdata.nodeValue, nodeId: inputdata.nodeId, dataType: inputdata.dataType, method: data.value })
        console.log("after dropdown", inputdata)
    }
    //button to make table for Test visible
    const [isButtonTodAddPressed, setIsButtonToAddPressed] = useState(false);

    // add selected Items to the table
    let { name, nodeValue, nodeId, dataType, method } = inputdata;
    function changeHandle() {

        // add selected item to first table until second table is added
        if (IsCreateANewTable === false) {
            setInputarr([...inputarr, { name, nodeValue, nodeId, dataType, method }])
        } else // add selecteditem to the new table
        {
            SetInputarrayTable2([...inputarrayTable2, { name, nodeValue, nodeId, dataType, method }]);
        }

        //setIsMethodCompareChoose(false);
        setIsButtonToAddPressed(true);
        //setIsValueForTimeOut(false);
    }
    console.log("ArrayInptArr", inputarr)

    // browse the root from the server
    useEffect(() => {
        const getRootNodefromApi = async () => {

            try {
                const headers = { "Content-Type": "application/json;charset=utf-8" };

                const response = await axios.get<rootOpcValue>("http://localhost:5000/api/OpcUaRootServer");

                setRootNode(response.data);
                console.log("Root read successfully");
                //console.log("API response:", response.data);
            } catch (error) {
                console.error("Failed to call API:", error);
            }

        };

        getRootNodefromApi();

    }, []);


    const renderTree = (nodes: rootOpcValue) => (
        <TreeItem key={nodes.name} nodeId={nodes.nodeId} label={nodes.name} >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );

    const [arrayToDisplayResult, setArrayoDisplayResult] = useState<any>([])
    let match: any[]


    // run Test
    const [valuesOpcUa, setValuesOpcUa] = useState<OpcValue>({ value: null, dataType: "", nodeId: "" });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (IsCreateANewTable === false) {
            for (let i = 0; i < inputarr.length; i++) {
                // if method is write
                if (inputarr[i].method === 'Write') {

                    MethodeWrite(inputarr[i].name, inputarr[i].nodeId, inputarr[i].dataType, inputarr[i].nodeValue)
                }
                //if method choose is Read
                if (inputarr[i].method === 'Read') {
                    // method to enter the NodeId
                    await MethodeToEnterNodeIdToRead(inputarr[i].nodeId, UrlServerEndPoint);

                    // method to read Data from Server
                    console.log("TTTTT", (await MethodeToReadData()).value);
                    setValuesOpcUa((await MethodeToReadData()));

                    // list of results
                    arrayToDisplayResult.push([inputarr[i].name, (await MethodeToReadData()).value])
                    console.log("arrayToDisplayResult", arrayToDisplayResult);

                }
                // if method choose is wait 
                if (inputarr[i].method === 'Wait') {
                    console.log("Sleep")
                    console.log("TimeOut", parseInt(inputValueForTimeOut))
                    await sleep(parseInt(inputValueForTimeOut))
                }
                // if method choose is Assert 
                if (inputarr[i].method === 'Assert') {



                }
            }
            // make segment result visible #setIsButtonTestPress
            setIsButtonTestPress(true);
        } else {
            // result from Test1 musst dissapear
            setIsButtonTestPress(false);
            // go through the table and run the test for table 2
            for (let i = 0; i < inputarrayTable2.length; i++) {
                // if method is write
                if (inputarrayTable2[i].method === 'Write') {

                    MethodeWrite(inputarrayTable2[i].name, inputarrayTable2[i].nodeId, inputarrayTable2[i].dataType, inputarrayTable2[i].nodeValue)
                }
                //if method choose is Read
                if (inputarrayTable2[i].method === 'Read') {
                    // method to enter the NodeId
                    await MethodeToEnterNodeIdToRead(inputarrayTable2[i].nodeId, UrlServerEndPoint);

                    // method to read Data from Server
                    console.log("TTTTT", (await MethodeToReadData()).value);
                    setValuesOpcUa((await MethodeToReadData()));
                }
                // if method choose is wait 
                if (inputarrayTable2[i].method === 'Wait') {
                    console.log("Sleep")
                    console.log("TimeOut", parseInt(inputValueForTimeOut))
                    await sleep(parseInt(inputValueForTimeOut))
                }
            }
            // show result from Test 2 
            setIsShowResultFromTest2(true);
        }
        // get the result 
        let lastValue; let vorlastValue
        for (let i = arrayToDisplayResult.length - 1; i >= 0; i--) {
            lastValue = arrayToDisplayResult[i];
            vorlastValue = arrayToDisplayResult[i - 1];
            console.log("Last value:", lastValue);
            console.log("vorLast value:", vorlastValue);
            // You can break the loop if you only want the last value
            break;
        }
        console.log("arrayToDisplayResult", arrayToDisplayResult);
        // compare readValue with inputvalue
        console.log("inputValueToCompareReadValueWith", inputValueToCompareReadValueWith)
        console.log("valuesOpcUa.value", valuesOpcUa.value)

        let readValue = (await MethodeToReadData()).value;
        console.log(typeof (readValue));
        console.log(typeof (inputValueToCompareReadValueWith));
        console.log("readvalue", readValue.toString())

        if (inputValueToCompareReadValueWith === readValue.toString()) {
            SetCompareResult("Passed")

        } else {
            SetCompareResult("Failed")
        }
    };



    function MethodeWrite(name: string, nodeId: string, dataType: string, nodeValue: string) {
        MethodeToWriteData(name, nodeId, dataType, nodeValue, UrlServerEndPoint);
    }

    function handleChangeCompareValue(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValueToCompareReadValueWith(e.target.value);


    }
    // state for time out 
    const [inputValueForTimeOut, setInputValueForTimeOut] = useState<string>("");
    const [isValueForTimeOut, setIsValueForTimeOut] = useState(false);
    // add function wait per input
    function handleChangeInputValueForTimeOut(e: React.ChangeEvent<HTMLInputElement>) {

        setInputValueForTimeOut(e.target.value)
    }

    // add the Wait fonction to the Test
    function HandleAddWaitToTable() {
        if (IsCreateANewTable === false) {
            setInputarr([...inputarr, { name: "", nodeValue: "", nodeId: "", dataType: "", method: "Wait" }])
        } else {
            SetInputarrayTable2([...inputarrayTable2, { name: "", nodeValue: "", nodeId: "", dataType: "", method: "Wait" }])
        }
        //                     <Button type="button" positive floated='right' size="small" onClick={HandleAddWaitToTable}> _Wait </Button>
    }


    console.log("compareResult", compareResult)
    console.log("valuesOpcUa.value-after", valuesOpcUa.value)

    // delete or remove items from the table 
    function deleteItem(id: string) {
        setInputarr(inputarr.filter((item: any) => {
            return item.nodeId !== id;
        }));
    }

    // function to move items within an array
    function arraymove(arr: [], fromIndex: number, toIndex: number) {

        const arrCopy = [...arr];
        var element = arrCopy[fromIndex];
        arrCopy.splice(fromIndex, 1);
        arrCopy.splice(toIndex, 0, element);
        return arrCopy;
    }

    // move item up in the table 
    function moveItemUp(id: string) {
        const itemIndex = inputarr.findIndex((item: any) => item.nodeId === id)
        if (itemIndex === 0)
            return;

        const updatedArray = arraymove(inputarr, itemIndex, itemIndex - 1);
        setInputarr(updatedArray);
    }
    // move item down  in the table 
    function moveItemDown(id: string) {
        const itemIndex = inputarr.findIndex((item: any) => item.nodeId === id)
        if (itemIndex === inputarr.length - 1)
            return;

        const updatedArray = arraymove(inputarr, itemIndex, itemIndex + 1);
        setInputarr(updatedArray);
    }
    // create table rows 1
    let tableRows = inputarr.map(
        (item: any, index: any) => {
            return (

                <Table.Row key={index}>
                    <Table.Cell collapsing>{item.name}</Table.Cell>
                    <Table.Cell collapsing>{item.nodeValue}</Table.Cell>
                    <Table.Cell collapsing>{item.dataType}</Table.Cell>
                    <Table.Cell collapsing>{item.nodeId}</Table.Cell>
                    <Table.Cell collapsing>{item.method}</Table.Cell>
                    <Table.Cell>
                        <Button type="button" onClick={() => deleteItem(item.nodeId)} color="twitter">Del</Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button type="button" onClick={() => moveItemUp(item.nodeId)} color="instagram">_Up</Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button type="button" onClick={() => moveItemDown(item.nodeId)} color="google plus">_Do</Button>
                    </Table.Cell>
                </Table.Row>

            )
        }
    )
    const [isDocumentGeneratorVisibile, setIsDocumentGeneratorVisible] = useState(false);
    // function to call document generator
    function openDocumentGenerator() {

        setIsDocumentGeneratorVisible(!isDocumentGeneratorVisibile);
    }


    // reset the table, the result 
    function ResetTable() {
        setInputarr([])
        setArrayoDisplayResult([]);
        SetCompareResult("");
        setIsButtonTestPress(false)
        console.log("arrayResult", arrayToDisplayResult);
    }

    // Add new Table 
    const [IsCreateANewTable, setIsCreateANewTable] = useState(false);
    //state to show the result of the second Test
    const [IsShowResultFromTest2, setIsShowResultFromTest2] = useState(false);
    function AddAnotherTableForTest() {
        setIsCreateANewTable(!IsCreateANewTable);
        //make first table dissapear
        //setIsButtonToAddPressed(false);
        // result from Test1 musst dissapear
        setIsButtonTestPress(false);
        setArrayoDisplayResult([]);

    }
    // State for 2.nd Table
    const [inputarrayTable2, SetInputarrayTable2] = useState<any>([]);
    // create table rows 2
    let tableRows2 = inputarrayTable2.map(
        (item: any, index: any) => {
            return (

                <Table.Row key={index}>
                    <Table.Cell collapsing>{item.name}</Table.Cell>
                    <Table.Cell collapsing>{item.nodeValue}</Table.Cell>
                    <Table.Cell collapsing>{item.dataType}</Table.Cell>
                    <Table.Cell collapsing>{item.nodeId}</Table.Cell>
                    <Table.Cell collapsing>{item.method}</Table.Cell>
                    <Table.Cell>
                        <Button type="button" onClick={() => deleteItemFrom2ndTable(item.nodeId)} color="twitter">Del</Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button type="button" onClick={() => moveItemUpIn2ndTable(item.nodeId)} color="instagram">_Up</Button>
                    </Table.Cell>
                    <Table.Cell>
                        <Button type="button" onClick={() => moveItemDownIn2ndTable(item.nodeId)} color="google plus">_Do</Button>
                    </Table.Cell>
                </Table.Row>

            )
        }
    )
    //reset 2nd Table 
    function ResetSecondTableTest() {

        SetInputarrayTable2([])
        SetCompareResult("");
        setIsButtonTestPress(false)

    }
    // delete or remove items from the 2nd table 
    function deleteItemFrom2ndTable(id: string) {
        SetInputarrayTable2(inputarrayTable2.filter((item: any) => {
            return item.nodeId !== id;
        }));
    }

    // move item up in the table 
    function moveItemUpIn2ndTable(id: string) {
        const itemIndex = inputarrayTable2.findIndex((item: any) => item.nodeId === id)
        if (itemIndex === 0)
            return;

        const updatedArray = arraymove(inputarrayTable2, itemIndex, itemIndex - 1);
        SetInputarrayTable2(updatedArray);
    }
    // move item down  in the table 
    function moveItemDownIn2ndTable(id: string) {
        const itemIndex = inputarrayTable2.findIndex((item: any) => item.nodeId === id)
        if (itemIndex === inputarrayTable2.length - 1)
            return;

        const updatedArray = arraymove(inputarrayTable2, itemIndex, itemIndex + 1);
        SetInputarrayTable2(updatedArray);
    }
    //fetch Data from DB
    const [data, SetData] = useState<any[]>([]);
    const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);

    async function fetchData() {
        console.log("Data");
        try {
            const response = await axios.get("http://localhost:5000/api/SaveDataResult");
            SetData(response.data);
            console.log(response.data);
            setIsDataAvailable(!isDataAvailable)

        } catch (error) {
            console.log('Error fetching data', error);
        }
    }



    return (
        <div>
            <Segment >
                <Form onSubmit={handleSubmit}>
                    <Grid>
                        <Grid.Column width={3}>
                            <Segment>
                                <TreeView
                                    aria-label="adress space"
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpanded={['rootNode']}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                    onNodeSelect={(e: React.SyntheticEvent, item: string) => handleSelectedItem(item)}
                                    sx={{ height: 400, flexGrow: 1, maxWidth: 250, overflowY: 'auto' }}>
                                    {renderTree(rootNode)}
                                </TreeView>

                            </Segment>
                            {
                                isDocumentGeneratorVisibile && !IsCreateANewTable &&
                                <Segment>
                                    <DocumentGenerator inputarr={inputarr} resultFromServer={valuesOpcUa.value} expectedValue={inputValueToCompareReadValueWith} resultComparison={compareResult} />
                                </Segment>
                            }
                            {
                                IsCreateANewTable && isDocumentGeneratorVisibile &&
                                <Segment>
                                    <DocumentGenerator inputarr={inputarrayTable2} resultFromServer={valuesOpcUa.value} expectedValue={inputValueToCompareReadValueWith} resultComparison={compareResult} />
                                </Segment>
                            }

                        </Grid.Column >
                        <Grid.Column width={13}>
                            {selectedItem &&
                                <Segment clearing>
                                    <>
                                        <Input type="text" name="name" value={inputdata.name} onChange={handleChange} placeholder='name' size='large' />
                                        <Input type="text" name="nodeValue" value={inputdata.nodeValue} onChange={handleChange} placeholder='nodeValue' size='large' />
                                        <Dropdown button basic floating options={options} value={selectedMethod} onChange={(e, data) => handleDropDownChange(e, data)} size="large" />
                                        <Button type="button" positive floated="right" size="small" color="green" onClick={fetchData}>GetDataFromDB</Button>
                                        <Button type="button" positive floated='right' size='small' color="grey" onClick={changeHandle}>_AddToTestTable</Button>
                                        <Button type="button" positive floated='right' size='small' color="grey" onClick={handleWriteData}>Write</Button>
                                        {
                                            isMethodCompareChoose &&

                                            <Input type="text" name="inputValueToCompareReadValueWith" value={inputValueToCompareReadValueWith} onChange={handleChangeCompareValue} placeholder='compareValue' size='large' />
                                        }
                                        {
                                            isValueForTimeOut &&

                                            <Input type="text" name="inputValueForTimeOut" value={inputValueForTimeOut} onChange={handleChangeInputValueForTimeOut} placeholder='SetTimeOut' size='large' />
                                        }

                                    </>
                                </Segment>

                            }
                            {
                                <ul>
                                    {isDataAvailable &&
                                        data.map((item) => (
                                            <Segment>
                                                <li key={item.id}>{"Name: "}{item.testName}{ }{" /expectedValue: "}{item.expected_Value}{" /resultfromServer: "}{item.resultFromServer}{" /resultComparison: "}{item.resultComparison}</li>
                                            </Segment>
                                        ))
                                    }
                                </ul>
                            }

                            {isButtonTodAddPressed &&
                                <Segment clearing>
                                    <>
                                        <Table>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Name</Table.HeaderCell>
                                                    <Table.HeaderCell>NodeValue</Table.HeaderCell>
                                                    <Table.HeaderCell>DataType</Table.HeaderCell>
                                                    <Table.HeaderCell>NodeId</Table.HeaderCell>
                                                    <Table.HeaderCell>Method</Table.HeaderCell>
                                                    <Table.HeaderCell></Table.HeaderCell>
                                                    <Table.HeaderCell></Table.HeaderCell>
                                                    <Table.HeaderCell></Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {tableRows}
                                            </Table.Body>
                                            <Table.Footer fullWidth>
                                                <Table.Row>
                                                    <Table.HeaderCell colSpan='9'>
                                                        <Button
                                                            type="submit"
                                                            floated='left'
                                                            icon
                                                            labelPosition='left'
                                                            primary
                                                            size='small'
                                                        >
                                                            <Icon name='user' /> Start Test
                                                        </Button>
                                                        <Button type="button" size='small' floated='right' onClick={AddAnotherTableForTest}>Add new Tab</Button>
                                                        <Button type="button" floated='right' onClick={ResetTable} size='small'>
                                                            _reset
                                                        </Button>
                                                        <Button type="button" size='small' floated='right' onClick={openDocumentGenerator}>exportPDF/_saveDB</Button>
                                                    </Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Footer>

                                        </Table>
                                    </>

                                </Segment>

                            }

                            {
                                isButtonTestPress &&
                                <div>
                                    <Segment>
                                        
                                            <h2>
                                                {valuesOpcUa.value}
                                            </h2>
                                    </Segment>
                                    <Segment>
                                        <h2>
                                            {compareResult}
                                        </h2>

                                    </Segment>
                                </div>

                            }
                            {
                                IsCreateANewTable &&
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>NodeValue</Table.HeaderCell>
                                            <Table.HeaderCell>DataType</Table.HeaderCell>
                                            <Table.HeaderCell>NodeId</Table.HeaderCell>
                                            <Table.HeaderCell>Method</Table.HeaderCell>
                                            <Table.HeaderCell></Table.HeaderCell>
                                            <Table.HeaderCell></Table.HeaderCell>
                                            <Table.HeaderCell></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {tableRows2}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='9'>
                                                <Button
                                                    type="submit"
                                                    floated='left'
                                                    icon
                                                    labelPosition='left'
                                                    primary
                                                    size='small'
                                                >
                                                    <Icon name='user' /> Start Test
                                                </Button>
                                                <Button type="button" size='small' floated='right' onClick={AddAnotherTableForTest}>Add new Tab</Button>
                                                <Button type="button" floated='right' onClick={ResetSecondTableTest} size='small'>
                                                    _reset
                                                </Button>
                                                <Button type="button" size='small' floated='right' onClick={openDocumentGenerator}>exportPDF/_saveDB</Button>
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Footer>

                                </Table>
                            }
                            {
                                IsCreateANewTable && IsShowResultFromTest2 &&
                                <div>
                                    <Segment>
                                        <h2>
                                            {valuesOpcUa.value}
                                        </h2>
                                    </Segment>
                                    <Segment>
                                        <h2>
                                            {compareResult}
                                        </h2>

                                    </Segment>
                                </div>

                            }
                        </Grid.Column>
                    </Grid>

                </Form>

            </Segment>

        </div>

    );
}

export default RootNodeTree;






