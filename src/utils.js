import Cookies from 'js-cookie';

export const isLoggedIn = () => {
    return Cookies.get('key') !== undefined;
}

export const setCookie = (value) => {
    console.log(value)
    Cookies.set('key', value);
}