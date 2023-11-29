import { useEffect, useState } from 'react';
import { OpcValue } from '../../../models/valueopc';
import axios from 'axios';


async function MethodeToReadData() {

    const response = await axios.get<OpcValue>("http://localhost:5000/api/OpcReadData");
    const data = response.data;
    return data;
}

export default MethodeToReadData;