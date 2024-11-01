import React, { createContext, useState, useContext } from 'react';

const LocationContext = createContext();

const LocationProvider = ({ children }) => {
    const [closestMon, setClosestMon] = useState(null);
    const [location, setLocation] = useState(null);

    return (
        <LocationContext.Provider value={{ closestMon, location, setClosestMon, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export { LocationContext, LocationProvider };