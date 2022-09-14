import { useContext, useState } from "react";
import {ACTION_TYPES,StoreContext} from '../store/store-context';
function useTrackLocation() {
  // const [latLong, setLatLong] = useState("");
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {dispatch} = useContext(StoreContext);
  
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type:ACTION_TYPES.SET_LAT_LONG,
      payload: {latLong: `${latitude},${longitude}`},
    });
    // setLatLong(`${latitude},${longitude}`);
    setLocationErrorMessage("");
    setIsLoading(false);
  };

  const error = () => {
    setLocationErrorMessage("Unable to retrieve your location");
    setIsLoading(false);
  };

  const handleTrackLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setLocationErrorMessage("Geolocation is not supported in your browser");
      setIsLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // latLong,
    locationErrorMessage,
    handleTrackLocation,
    isLoading
  };
}

export default useTrackLocation;
