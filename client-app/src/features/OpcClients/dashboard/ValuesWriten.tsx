import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Button, Form, Input, Table } from 'semantic-ui-react';
import { rootOpcValue } from '../../../models/rootOpcValue';

interface Props {

    selectedItems: rootOpcValue;

    cancelSelectItem: ()=> void;
}


interface FormValues {
    name: string;
    nodeId: string;
    dataType: string,
    value: string
}

function MyComponent({ selectedItems, cancelSelectItem }: Props) {
    const [formValues, setFormValues] = useState<FormValues>({
        name: "",
        nodeId: "",
        dataType: "",
        value: "",
    });

    console.log("new select", selectedItems.nodeId);
    console.log("formValues.nodeId", formValues.nodeId);

    // assign the value of the selectedItem to the formValues so that 
    if ( formValues.nodeId!==selectedItems.nodeId){
        formValues.nodeId= selectedItems.nodeId;
        formValues.dataType= selectedItems.datatype;
        formValues.value = selectedItems.nodeValue;

        
    }
    // handle the new value 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {


        const { name, value } = e.target;

        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

    };
// submit enter values to the server throup api axios post 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const headers = { "Content-Type": "application/json;charset=utf-8" };
            await axios.post("http://localhost:5000/api/OpcSample", formValues, { headers });
            console.log("Values written successfully");
        } catch (error) {
            console.error("Failed to call API:", error);
        }
    };


    return (
        <Form onSubmit={handleSubmit}>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Write Value</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body >

                    <Table.Row>
                        <Table.Cell>
                            <Input type="text" name="dataType" value={formValues.dataType} onChange={handleInputChange} placeholder='dataType' readOnly/>

                            <Input type="text" name="nodeId" value={formValues.nodeId} onChange={handleInputChange} placeholder='nodeId' readOnly/>

                            <Input type="text" name="value" value={formValues.value} onChange={handleInputChange} placeholder='value' />


                        </Table.Cell>
                    </Table.Row>
                    <Table.Row >
                        <Table.Cell>
                            <Button type="submit" positive floated='right'>Write Values</Button>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

        </Form>


    );
}

export default MyComponent;