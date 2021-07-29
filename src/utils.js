import Cookies from 'js-cookie';

export const isLoggedIn = () => {
    return Cookies.get('key') !== undefined;
}

export const getCookie = () => {
    return Cookies.get('key');
}

export const setCookie = (value) => {
    Cookies.set('key', value);
}

export const getAxiosOptions = (endpoint, method, data = {}) => {

    const options = {
        url: `${process.env.REACT_APP_CUSTOM_URL_ENDPOINT}/${endpoint}`,
        method,
        data,
        headers: {
            key: getCookie()
        },
        withCredentials: true
    }

    return options;
}