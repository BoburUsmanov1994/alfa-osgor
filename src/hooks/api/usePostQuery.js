import React from 'react';
import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";
import {forEach, isArray} from "lodash";

const postRequest = (url, attributes, config = {}) => request.post(url, attributes, config);

const usePostQuery = ({hideSuccessToast = false, listKeyId = null}) => {


        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url,
                 attributes,
                 config = {}
             }) => postRequest(url, attributes, config),
            {
                onSuccess: (data) => {
                    if (!hideSuccessToast) {
                        toast.success(data?.data?.message || 'SUCCESS')
                    }

                    if (listKeyId) {
                        queryClient.invalidateQueries(listKeyId)
                    }
                },
                onError: (data) => {
                    if (isArray(data?.response?.data?.message)) {
                        forEach(data?.response?.data?.message, (msg) => {
                            toast.error(msg)
                        })
                    } else {
                        toast.error(data?.response?.data?.message || 'ERROR')
                    }
                }
            }
        );

        return {
            mutate,
            isLoading,
            isError,
            error,
            isFetching,
        }
    }
;

export default usePostQuery;