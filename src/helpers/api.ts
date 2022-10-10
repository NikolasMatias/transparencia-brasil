import axios, { AxiosRequestConfig } from 'axios';

export type GetType = <Data, Params extends object>(url: string, params: Params, config: AxiosRequestConfig) => Promise<Data>;
export type GetMultipleType = <Data, Params extends object>(urls: string[], params: Params, config: AxiosRequestConfig) => Promise<any[]>;
export type PostType = <Data, Params extends object>(url: string, params: Params, config: AxiosRequestConfig) => Promise<Data>
export type PutType = PostType;
export type PatchType = PostType;
export type DeleteType = GetType;

class APICore {
    constructor(baseUrl: string) {
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.post['Accept'] = 'application/json';
        axios.defaults.baseURL = baseUrl;
    }

    get: GetType = (url, params, config) => {
        if (params !== null) {
            const queryString = this.handleQueryString(params);
            url += `?${queryString}`;
        }

        return axios.get(url, config);
    }

    getFile: GetType = (url, params, config) => {
        const fileConfig: typeof config = { ...config, responseType: 'blob' };
        return this.get(url, params, fileConfig);
    }

    getMultiple: GetMultipleType = (urls, params, config) => {
        const reqs = [];
        for (const url of urls) reqs.push(this.get(url, params, config));
        return axios.all(reqs);
    }

    post: PostType = (url, params, config) => axios.post(url, params, config)
    put: PutType = (url, params, config) => axios.put(url, params, config)
    patch: PatchType = (url, params, config) => axios.patch(url, params, config)

    delete: DeleteType = (url, params, config) => {
        if (params !== null) {
            const queryString = this.handleQueryString(params);
            url += `?${queryString}`;
        }

        return axios.delete(url, config);
    }

    handleQueryString = (params: object): string => {
        const searchParams = new URLSearchParams();
        // @ts-ignore
        Object.keys(params).forEach((key) => searchParams.append(key, params[key]));
        return searchParams.toString();
    }
}

export { APICore };