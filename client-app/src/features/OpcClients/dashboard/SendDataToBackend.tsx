import React, { useEffect, useState } from 'react';
import axios from "axios";




const SendDataToBackend = async (name: string, expectedValue: string, resultFromServer: string, resultComparison: string) => {

    const values = { name: name, expectedValue: expectedValue, resultFromServer:resultFromServer , resultComparison: resultComparison }

    console.log("values", values);


    try {
        const headers = { "Content-Type": "application/json;charset=utf-8" };
        await axios.post("http://localhost:5000/api/saveDataResult", values, {headers});
        console.log("Values written successfully");
    } catch (error) {
        console.error("Failed to call API:", error);
    }
};

export default SendDataToBackend;



