import './App.css';
import { Button, Loader, Dimmer } from 'semantic-ui-react';
import { useEffect, useRef, useState } from 'react';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { Icon } from 'semantic-ui-react';
import { Icon as LeafletIcon } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from 'react-leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';
import CheckoutPage from './checkoutPage';
import env_vars from './env';
import truck from './images/truck.png';
import oilTruck from './images/oil-truck.png';

function App() {
  const [emissionResults, setEmissionResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoodsSelected, setIsGoodsSelected] = useState(true);

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const measurementRef = useRef(null);
  const measurementUnitRef = useRef(null);
  const fuelTypeElem = useRef(null);
  const offsetPageElem = useRef(null);

  const position = [28.7041, 77.1025];

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (emissionResults) {
    }
  }, [emissionResults]);

  const calculateEmissions = async () => {
    const origin = originRef.current.value;
    const destination = destinationRef.current.value;
    const measurement = measurementRef.current.value;
    const measurementUnit = measurementUnitRef.current.value;

    if (
      origin.length === 0 ||
      destination.length === 0 ||
      measurement.length === 0
    ) {
      setErrorMessage('You might be missing an input.');
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_city: origin,
        to_city: destination,
        measurement_unit: measurementUnit,
        measurement: measurement,
        category: 'Road Freight',
        fuel_type: fuelTypeElem.current.value,
        freight_type: isGoodsSelected ? 'goods' : 'oil',
      }),
    };

    let apiUrl = env_vars.API_URL_DEV;
    if (env_vars.MODE === 'prod') {
      apiUrl = env_vars.API_URL_PROD;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/emissions/freight/`,
        requestOptions
      );
      const data = await response.json();

      if (response.status !== 200) {
        const { detail } = data;
        const errorMessage = Array.isArray(detail) ? detail[0].msg : detail;
        setErrorMessage(errorMessage);
      } else {
        const { route, emissions } = data;
        setEmissionResults((emissionResults) => {
          return {
            ...emissionResults,
            distance_in_kms: route.distance_in_kms,
            co2e: emissions.co2e,
            origin: route.origin,
            destination: route.destination,
            polylinePoints: route.polyline_points,
          };
        });
      }
    } catch (error) {
      setErrorMessage('Something unexpected happened.Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  function PolylineComponent({ encodedPolyline }) {
    const map = useMap();

    const decodedPolyline = polyline
      .decode(encodedPolyline)
      .map((point) => [point[0], point[1]]);

    const polylineOptions = {
      color: 'blue',
      weight: 5,
    };

    map.setView(decodedPolyline[Math.floor(decodedPolyline.length / 2)]);
    return (
      <Polyline positions={decodedPolyline} pathOptions={polylineOptions} />
    );
  }

  function FormEntriesComponent({ isGoodsSelected }) {
    return isGoodsSelected ? (
      <>
        <div className="form-entry">
          <div className="text">Weight</div>
          <input ref={measurementRef} className="input-box"></input>
        </div>

        <div className="form-entry">
          <div className="text">Weight Unit</div>
          <select ref={measurementUnitRef} className="input-box drop-down">
            <option value="kg">Kg</option>
            <option value="ton">ton</option>
          </select>
        </div>
      </>
    ) : (
      <>
        <div className="form-entry">
          <div className="text">Volume</div>
          <input ref={measurementRef} className="input-box"></input>
        </div>

        <div className="form-entry">
          <div className="text">Volume Unit</div>
          <select ref={measurementUnitRef} className="input-box drop-down">
            <option value="litre">litre</option>
            <option value="gallon">gal</option>
          </select>
        </div>
      </>
    );
  }

  function ErrorMessageComponent({ errorMessage }) {
    if (errorMessage) {
      return (
        <div className="error-message-container">
          <span className="error-message-prefix-bar"></span>
          <span className="error-message-text">{errorMessage}</span>
        </div>
      );
    }
  }

  function handleMapReadyEvent(map) {
    map.target.zoomControl.setPosition('topright');
  }

  function handleOffsetEmissions() {
    offsetPageElem.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {isLoading && (
        <Dimmer active>
          <Loader />
        </Dimmer>
      )}
      <MapContainer
        center={position}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100vh', width: '100vw' }}
        whenReady={handleMapReadyEvent}
      >
        {emissionResults && (
          <PolylineComponent
            encodedPolyline={emissionResults.polylinePoints}
          ></PolylineComponent>
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {emissionResults && (
          <>
            <Marker
              icon={
                new LeafletIcon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
              position={[
                emissionResults.origin.coordinates.lat,
                emissionResults.origin.coordinates.long,
              ]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
            <Marker
              icon={
                new LeafletIcon({
                  iconUrl: markerIconPng,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
              position={[
                emissionResults.destination.coordinates.lat,
                emissionResults.destination.coordinates.long,
              ]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>
      <ErrorMessageComponent
        errorMessage={errorMessage}
      ></ErrorMessageComponent>
      <div className="input-container">
        <div className="tab-selector">
          <div
            onClick={() => {
              setIsGoodsSelected(true);
            }}
            className={`${isGoodsSelected ? 'tab' : 'tab grey'}`}
          >
            <div>Goods</div>
            <img className="goods-truck-image" src={truck} alt="goods"></img>
          </div>
          <div
            onClick={() => {
              setIsGoodsSelected(false);
            }}
            className={`${isGoodsSelected ? 'tab grey' : 'tab'}`}
          >
            <div>Oil</div>
            <img
              className="oil-truck-image"
              src={oilTruck}
              alt="oilTruck"
            ></img>
          </div>
        </div>
        <div className="carbon-calculator-form">
          <div className="form-entry">
            <div className="text">Origin</div>
            <input ref={originRef} className="input-box"></input>
          </div>
          <div className="form-entry">
            <div className="text">Destination</div>
            <input ref={destinationRef} className="input-box"></input>
          </div>

          <FormEntriesComponent
            isGoodsSelected={isGoodsSelected}
          ></FormEntriesComponent>

          <div className="form-entry">
            <div className="text">Mode</div>
            <select className="input-box drop-down">
              <option value="Road Freight">Road</option>
            </select>
          </div>
          <div className="form-entry">
            <div className="text">Fuel Type</div>
            <select ref={fuelTypeElem} className="input-box drop-down">
              <option value="Diesel">Diesel</option>
              <option value="B20_Diesel">B20 Diesel</option>
              <option value="Biodiesel">Biodiesel</option>
            </select>
          </div>
          <div className="submit-button">
            <Button size="small" color="blue" onClick={calculateEmissions}>
              Calculate Emissions
            </Button>
          </div>
        </div>
      </div>
      {emissionResults && (
        <>
          <div className="results-container">
            <div className="emissions">
              <span className="heading">Emissions</span>
              <span className="value">{`${emissionResults.co2e}kg`}</span>
              <span className="label">CO2e emissions</span>
            </div>
            <div className="route-data">
              <span className="heading">Route Data</span>
              <span className="value">
                {`${emissionResults.distance_in_kms}KM`}
              </span>
              <span className="label">Distance</span>
            </div>
            <div className="location-marker">
              <Icon
                circular
                name="map marker alternate"
                size="large"
                color="grey"
                inverted
              ></Icon>
              <span>{`${emissionResults.origin.city}, ${emissionResults.origin.country}`}</span>
            </div>
            <div className="location-marker">
              <Icon
                circular
                name="truck"
                size="large"
                color="blue"
                inverted
              ></Icon>
              <div className="emission-details">
                <span>{`${emissionResults.distance_in_kms}km`}</span>
                <div>
                  <span>{`${emissionResults.co2e}kg `}</span>
                  <span>of CO2e</span>
                </div>
              </div>
            </div>
            <div className="location-marker">
              <Icon
                circular
                name="map marker alternate"
                size="large"
                color="grey"
                inverted
              ></Icon>
              <span>{`${emissionResults.destination.city}, ${emissionResults.destination.country}`}</span>
            </div>
            <Button size="medium" color="blue" onClick={handleOffsetEmissions}>
              Offset Carbon Emissions
            </Button>
          </div>
          <CheckoutPage offsetPageElem={offsetPageElem}></CheckoutPage>
        </>
      )}
    </>
  );
}

export default App;
