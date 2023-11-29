import React, { useEffect, useState } from 'react';
import axios from "axios";


const MethodeToEnterNodeIdToRead =  async (nodeId: string, urlServerEndPoint: string) => {

    let UrlServerEndPoint= urlServerEndPoint;
   
    let values = { nodeId, UrlServerEndPoint}

    console.log("nodeId", values);


    try {
        const headers = { "Content-Type": "application/json;charset=utf-8" };
      await  axios.post("http://localhost:5000/api/OpcReadData", values, { headers });
        console.log("NodeId  written successfully");
    } catch (error) {
        console.error("Failed to call API:", error);
    }
};

export default MethodeToEnterNodeIdToRead;



