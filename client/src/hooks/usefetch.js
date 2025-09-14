import { useEffect, useState } from "react";

export const useFetch = (url, options={},dependencies=[]) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        if (!url) return;
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await fetch(url,options);
                const responseData = await response.json();
                // console.log("responseData",responseData)
                if(!response.ok){
                    throw new Error(responseData.message);
                }
                setData(responseData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }
        fetchData();
    }, [url, ...dependencies]);
    
    return {data,loading,error}
}
