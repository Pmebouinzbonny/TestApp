import React, { useState } from 'react';
import { Button, Form, Segment, Table } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

const initialList = [{
    id: 'a',
    input: 'Robin',
},


];


interface Props_AddInput {

    input: string;
    setInput: (newInput: string) => void;
    setAktiv: () => void;

}

// function to add 
function AddInput({ input, setInput, setAktiv }: Props_AddInput) {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInput(event.currentTarget.value);

    }
    return <>
        <Form>
            <Form.Input type="text" value={input} onChange={handleChange} onClick={setAktiv} />
        </Form>
    </>
}

export default function OpcClientTab2() {
    const [list, setList] = useState(initialList);
    const [num, SetNum] = useState(Number);
    const [aktiv, setAktiv] = useState(0);


    function handleAdd() {
        setList([...list, { input: ``, id: uuidv4() }]);
    }
    // function to remove a textfield
    function handleRemove() {
        setList([...list.filter((item, index) => index !== aktiv)]);
    }
    // function to update the list when a new textfield is added
    function setInputBeiIndex(input: string, index: number) {
        const newList = [...list];
        newList[index].input = input;
        setList(newList);
    }
    // function to have the selected textfield
    function setActivIndex(index: number) {
        setAktiv(index);
    }
    // function to add the content of the textfield
    function TestAdd() {

        SetNum(parseInt(list[0].input) + parseInt(list[1].input));
    }

    /*
     <Form>
                                <Button floated="left" onClick={TestAdd} content='Test' color='grey' />
                            </Form>
    */

    return (
        <Table definition>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Test</Table.HeaderCell>
                    <Table.HeaderCell>Results</Table.HeaderCell>
                    <Table.HeaderCell>Pass</Table.HeaderCell>
                    <Table.HeaderCell>Fail</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <Table.Cell>Test_1</Table.Cell>
                    <Table.Cell>
                        <Segment clearing >
                            <>

                                {
                                    list.map((item, index) => (
                                        <div key={index}>
                                            <AddInput input={item.input} setInput={(newInput) => setInputBeiIndex(newInput, index)} setAktiv={() => setActivIndex(index)} />
                                        </div>
                                    ))
                                }
                                <Form >
                                    <Button type="button" onClick={handleAdd} floated='left'> + </Button>
                                    <Button type="button" onClick={handleRemove} floated='right'> - </Button>
                                </Form>
                            </>
                        </Segment>
                    </Table.Cell>
                    <Table.Cell>
                        <Segment clearing/>
                            
                    </Table.Cell>
                    <Table.Cell>
                        <div>
                            <h2>
                                {num}
                            </h2>
                        </div>

                    </Table.Cell>
                    <Table.Cell>
                        <div>
                            <h2>
                                pass
                            </h2>
                        </div>

                    </Table.Cell>
                    <Table.Cell>
                        <div>
                            <h2>
                                fail
                            </h2>
                        </div>

                    </Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell>Test_2</Table.Cell>
                    <Table.Cell>
                        <Segment>
                            <Form>
                                <Form.Input placeholder='Variable1' />
                                <Form.Input placeholder='Variable2' />
                            </Form>
                        </Segment>
                    </Table.Cell>
                    <Table.Cell>
                        <Segment clearing>
                            <Form>
                                <Button floated="left" content='Test' color='grey' />
                            </Form>
                        </Segment>
                    </Table.Cell>
                    <Table.Cell>Sets the current star rating to specified value</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>

    )
}

