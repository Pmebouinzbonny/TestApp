import React, { useState } from 'react';
import { jsPDF } from 'jspdf'
import { Button, Header, Input, Label, Table, TextArea } from 'semantic-ui-react';
import SendDataToBackend from './SendDataToBackend';

interface Props {
    // isDocumentGeneratorVisibile: boolean
    inputarr: [],
    resultFromServer: any,
    expectedValue: string,
    resultComparison: string
}
function DocumentGenerator({ inputarr, resultComparison, resultFromServer, expectedValue }: Props) {
    const [name, setName] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [isexportClicked, setIsExportClicked] = useState(false);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value)

    }

    function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(e.target.value)
        // <TextArea id="content" value={content} onChange={handleContentChange} style={{ minHeight: 100 }}>
    }


    const generatePDFDocument = () => {
        setIsExportClicked(!isexportClicked)
        const doc = new jsPDF();
        doc.text(`${name}`, 10, 10)
        //doc.addFont('helvetica', 'normal')
        let yPos = 50;
        inputarr.forEach((item: any, index) => {
            doc.text(`${index + 1}, name:${item.name}, value:${item.nodeValue}, method:${item.method}, dataType:${item.dataType}`, 10, yPos);
            yPos += 10;

        });
        doc.text(`soll_Value:${expectedValue}, Ist_Value:${resultFromServer}, Test:${resultComparison}`, 10, yPos);
        doc.text(`${content}`, 10, yPos + 10);
        doc.save('generated_document.pdf')
    }
    function saveDatatoDB() {
        SendDataToBackend(name, expectedValue, resultFromServer.toString(), resultComparison);
    }


    return (
        <div>
            <Header>Document Generator</Header>

            <>
                <Label html='name'>Document Name:</Label>
                <Input type="text" id="name" value={name} onChange={handleNameChange} />

            </>
            <>
                <Label htmlFor="content">Content:</Label>
                <TextArea id="content" value={content} onChange={handleContentChange} style={{ minHeight: 90 }} />

            </>
            <>
                <Button type="button" size="tiny" onClick={generatePDFDocument}>_PDF</Button>
                <Button type="button" size="tiny" floated='right' onClick={saveDatatoDB}>_saveDB</Button>
            </>


        </div>
    );

}
export default DocumentGenerator;