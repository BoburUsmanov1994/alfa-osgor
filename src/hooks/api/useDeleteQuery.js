import React from 'react';
import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";

const deleteRequest = (url) => request.delete(url);

const useDeleteQuery = ({listKeyId = null}) => {


        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url
             }) => deleteRequest(url),
            {
                onSuccess: (data) => {
                    toast.success(data?.data?.message || 'SUCCESSFULLY DELETED')

                    if (listKeyId) {
                        queryClient.invalidateQueries(listKeyId)
                    }
                },
                onError: (data) => {
                    toast.error(data?.response?.data?.message || 'ERROR')
                }
            }
        );

        return {
            mutate,
            isLoading,
            isError,
            error,
            isFetching
        }
    }
;

export default useDeleteQuery;