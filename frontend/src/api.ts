import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { ValidationErrorField } from './types/error';
import { Token } from './utils';
import { HttpCode } from './const';

const BACKEND_URL = 'http://localhost:3000';
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = Token.get();

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      toast.dismiss();
      const resp = error.response;
      if (resp) {
        const { status, data } = resp as {
              status: number;
              data: { message?: string; details?: ValidationErrorField[]; error?: string };
            };
        switch (status) {
          case HttpCode.BAD_REQUEST:
            if (Array.isArray(data.details)) {
              data.details.forEach((field) =>
                field.messages.forEach((msg) => toast.info(msg))
              );
            } else {
              toast.info(data.message ?? 'Bad request');
            }
            break;
          case HttpCode.NoAuth:
          case HttpCode.NotFound:
          case HttpCode.Conflict:
            toast.info(data.message ?? error.message);
            break;
          default:
            toast.warn(data.error ?? error.message);
        }
      } else {

        toast.error(error.message);
      }
      return Promise.reject(error);
    }
  );

  return api;
};
