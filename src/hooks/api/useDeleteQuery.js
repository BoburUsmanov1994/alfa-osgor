import React from 'react';
import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";

const deleteRequest = (url,params) => request.delete(url,{data:params});

const useDeleteQuery = ({listKeyId = null}) => {


        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url,params={}
             }) => deleteRequest(url,params),
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