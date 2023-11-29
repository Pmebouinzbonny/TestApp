import React, { useState } from 'react';
import { Grid, Segment, Table } from 'semantic-ui-react';
import MyComponent from './ValuesWriten';
import MyReadComponent from './ReadValue';
import OpcClientDesign from './OpcClientDesign';
import { OpcValue } from '../../../models/valueopc';


interface Props {

    readValueOpc: OpcValue;
}
export default function OpcClientDashboard() {




    return (
      
            <div style={{ height: '120vh', width: "60vw" }}>
                <OpcClientDesign />
            </div>
       



    )
}