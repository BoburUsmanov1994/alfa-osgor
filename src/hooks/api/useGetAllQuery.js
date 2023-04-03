import React from 'react';
import {useQuery} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";

const useGetAllQuery = ({
                            key = "get-all",
                            url = "/",
                            params = {},
                            showSuccessMsg = false,
                            hideErrorMsg = false,
                            enabled = true,
                            cb = {
                                success: () => {
                                },
                                fail: () => {
                                }
                            },
                        }) => {

    const {isLoading, isError, data, error, isFetching} = useQuery([key, params], () => request.get(url, params), {
        onSuccess: ({data}) => {
            cb?.success(data)
        },
        onError: (data) => {
            cb?.fail()
            if (!hideErrorMsg) {
                toast.error(data?.response?.data?.message || `ERROR!!! ${url} api not working`)
            }
        },
        enabled
    });

    return {
        isLoading,
        isError,
        data,
        error,
        isFetching
    }
};

export default useGetAllQuery;