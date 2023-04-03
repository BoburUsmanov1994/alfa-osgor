import React from 'react';
import {useQuery} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";

const usePaginateQuery = ({
                              key = "get-all",
                              url = "/",
                              page = 1,
                              params = {},
                              showSuccessMsg = false,
                              showErrorMsg = false
                          }) => {

    const {
        isLoading,
        isError,
        data,
        error,
        isFetching
    } = useQuery([key, page], () => request.get(`${url}?page=${page}`, params), {
        keepPreviousData: true,
        onSuccess: () => {
            if (showSuccessMsg) {
                toast.success('SUCCESS')
            }
        },
        onError: (data) => {
            if (showErrorMsg) {
                toast.error(data?.response?.data?.message || `ERROR`)
            }
        }
    });

    return {
        isLoading,
        isError,
        data,
        error,
        isFetching
    }
};

export default usePaginateQuery;