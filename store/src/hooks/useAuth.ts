import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Your auth logic here
        setIsLoggedIn(true);
    }, []);

    return { isLoggedIn };
};
