import React from 'react';
import {useQuery} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";

const fetchRequest = (url, params) => request.get(url, params);

const useGetOneQuery = (
    {
        id = null,
        key = "get-one",
        url = "test",
        enabled = true,
        params = {},
        showSuccessMsg = false,
        showErrorMsg = true
    }
) => {

    const {isLoading, isError, data, error} = useQuery([key, id], () => fetchRequest(`${url}/${id}`, params), {
        onSuccess: () => {
        },
        onError: (data) => {
            if (showErrorMsg) {
                toast.error(data?.response?.data?.message || `ERROR!!! api not working`)
            }
        },
        enabled,
    });

    return {
        isLoading,
        isError,
        data,
        error,
    }
};

export default useGetOneQuery;