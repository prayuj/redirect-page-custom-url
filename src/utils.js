import Cookies from 'js-cookie';

export const isLoggedIn = () => {
    return Cookies.get('key') !== undefined;
}

export const getCookie = () => {
    return Cookies.get('key');
}

export const setCookie = (value) => {
    Cookies.set('key', value, {
        expires: 365
    });
}

export const getAxiosOptions = (endpoint, method, data = {}) => {

    const options = {
        url: `${process.env.REACT_APP_CUSTOM_URL_LAMBDA_ENDPOINT}/${endpoint}`,
        method,
        data,
        headers: {
            key: getCookie()
        }
    }

    return options;
}