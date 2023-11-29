import React, { useState } from 'react';
import { OpcValue } from '../../../models/valueopc';
import axios from 'axios';
import { Button, Form, Input, Segment, Table } from 'semantic-ui-react';
import { rootOpcValue } from '../../../models/rootOpcValue';
import EnterNodeId from './EnterNodeId';

interface Props {
    selectedItemsForRead: rootOpcValue
}

function MyReadComponent({ selectedItemsForRead }: Props) {
    const [valuesOpcUa, setValuesOpcUa] = useState<OpcValue>({ value: null, dataType: " ", nodeId:"" });
    let fixedValue = 30;




    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();


        try {

            axios.get<OpcValue>("http://localhost:5000/api/opcReadData")
                .then(response => {
                 
                    setValuesOpcUa(response.data);
                    console.log("test node Id",response.data.nodeId);

                });
            console.log("Values Read successfully");
            //console.log("API response:", response.data);
        } catch (error) {
            console.error("Failed to call API:", error);
        }

        console.log(valuesOpcUa.dataType);

    };

    const compareValues = () => {
        if (valuesOpcUa.value === fixedValue) {
            return <p>Test passed</p>
        } else {
            return <p>Test failed</p>
        }
    }

    /*
    <>
            <Form onSubmit={handleSubmit}>
                <button type="submit">Read Values</button>
                {valuesOpcUa.value} ({valuesOpcUa.dataType})
            </Form>
        </>

    */


    return (
        <Table size="large">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Read Value</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                       <EnterNodeId selectedItems={selectedItemsForRead}/>


                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Form onSubmit={handleSubmit}>
                            <Button type="submit">Read value</Button>
                        </Form>

                    </Table.Cell>
                    <Table.Cell>
                        <h3>
                            {valuesOpcUa.value} ({valuesOpcUa.dataType})
                        </h3>

                    </Table.Cell>

                </Table.Row>
            </Table.Body>
        </Table>


    );
}

export default MyReadComponent;