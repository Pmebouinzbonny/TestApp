import React, { useState } from 'react';
import axios from "axios";
import { Button, Input, Segment } from 'semantic-ui-react';
import RootNodeTree from './MainKomponent';
import { sleep } from './CreateMethodeToDelay';


const ConnectServer = () => {
    const [urlServerEndPoint, setUrlServerEndPoint] = useState("")
    const [isServerConnected, setIsServerConnected] = useState<boolean>(false);
    const [data, SetData] = useState<any[]>([]);
    const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);


    // get the url server endpoint
    function OnChangeUrlServer(e: React.ChangeEvent<HTMLInputElement>) {
        setUrlServerEndPoint(e.target.value)
    }

    // function to connect to server

    async function ConnectServerEndPoint() {   
        try {
            const headers = { "Content-Type": "application/json;charset=utf-8" };
            await axios.post("http://localhost:5000/api/OpcUaRootServer", { urlServerEndPoint }, { headers });
            console.log("UrlServerEndpoint  written successfully");
            setIsServerConnected(true);
            console.log(isServerConnected)
        } catch (error) {
            console.error("Failed to call API:", error);
        }
    }

    
    console.log("sleep")
    sleep(10000)

    console.log("WWWW", isServerConnected);
    //fetch Data from DB
    async function fetchData() {
        console.log("Data");
        try {
            const response = await axios.get("http://localhost:5000/api/SaveDataResult");
            SetData(response.data);
            console.log(response.data);
            setIsDataAvailable(true)

        } catch (error) {
            console.log('Error fetching data', error);
        }
        /*              <Button type="button" floated="right" onClick={fetchData} color="linkedin">GetDataFromDB</Button>
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
                }*/
    }

    return (
        <div>
            <Segment>
                <Input type="text" name="urlServerEndPoint" value={urlServerEndPoint} onChange={OnChangeUrlServer} placeholder='write url server' size='large' />
                <Button type="button" onClick={ConnectServerEndPoint}>Connect</Button>
            </Segment>
            {
                isServerConnected &&
                <RootNodeTree UrlServerEndPoint={urlServerEndPoint} />
            }

        </div>
    )
};

export default ConnectServer;

