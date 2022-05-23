import {
    Route,
    Redirect
} from "react-router-dom";

import { isLoggedIn } from "../utils"
const PrivateRoute = ({ children, ...rest }) => {
    return (<Route
        {...rest}
        render={({ location }) =>
            isLoggedIn() ? (
                children
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        search: `?message=${encodeURI('No Cookie Present')}&redirectTo=${rest?.path?.split('/')[1]||''}`,
                    }}
                />
            )
        }
    />);
}

export default PrivateRoute;