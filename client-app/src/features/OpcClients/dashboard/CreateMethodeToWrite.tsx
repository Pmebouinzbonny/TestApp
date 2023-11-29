import React, { useEffect, useState } from 'react';
import axios from "axios";

const MethodeToWriteData=  (name: string|undefined, nodeId: string|undefined, dataType: string|undefined, nodeValue: string|undefined, urlServerEndPoint: string) => {
   let values = {name, nodeId, dataType, nodeValue, urlServerEndPoint}
        try {
        const headers = { "Content-Type": "application/json;charset=utf-8" };
        axios.post("http://localhost:5000/api/OpcSample", values, { headers });
        console.log("Values written successfully");
    } catch (error) {
        console.error("Failed to call API:", error);
    }
};
export default MethodeToWriteData;



