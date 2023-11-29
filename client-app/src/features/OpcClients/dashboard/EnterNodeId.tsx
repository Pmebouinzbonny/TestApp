import React, { useState } from 'react';
import axios from "axios";
import { Button, Form, Input, Table } from 'semantic-ui-react';
import { rootOpcValue } from '../../../models/rootOpcValue';

interface Props {

    selectedItems: rootOpcValue;
  




}

interface FormValues {

    nodeId: string;


}

function EnterNodeId({ selectedItems }: Props) {
    const [formValues, setFormValues] = useState<FormValues>({
        nodeId: "",
    });

    console.log("new select", selectedItems.nodeId);
    console.log("formValues.nodeId", formValues.nodeId);

    // assign the value of the selectedItem to the formValues so that 
    if (formValues.nodeId !== selectedItems.nodeId) {
        formValues.nodeId = selectedItems.nodeId;
    }
    console.log("apresif", formValues.nodeId)

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
            await axios.post("http://localhost:5000/api/opcReadData", formValues, { headers });
            console.log("nodeId written successfully");
        } catch (error) {
            console.error("Failed to call API:", error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>nodeId</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body >

                    <Table.Row >
                        <Table.Cell>
                            <Input type="text" name="nodeId" value={formValues.nodeId} onChange={handleInputChange} placeholder='nodeId' />
                        </Table.Cell>
                        <Table.Cell>
                            <Button type="submit" positive floated='right'>edit</Button>
                        </Table.Cell>
                    </Table.Row>
  
                        
            
                </Table.Body>
            </Table>

        </Form>


    );
}

export default EnterNodeId;