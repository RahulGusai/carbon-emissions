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

function App() {
  const [emissionResults, setEmissionResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoodsSelected, setIsGoodsSelected] = useState(true);

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const weightRef = useRef(null);
  const weightUnitRef = useRef(null);

  const position = [28.7041, 77.1025];

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
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
    const weight = weightRef.current.value;
    const weightUnit = weightUnitRef.current.value;

    if (
      origin.length === 0 ||
      destination.length === 0 ||
      weight.length === 0
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
        weight_unit: weightUnit,
        weight: weight,
        category: 'Road Freight',
      }),
    };

    const apiUrl = 'http://127.0.0.1:8000/emissions/freight/';

    try {
      setIsLoading(true);
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (response.status !== 200) {
        const { detail } = data;
        const errorMessage = Array.isArray(detail) ? detail[0].msg : detail;
        setErrorMessage(errorMessage);
      } else {
        const { route, emissions } = data;
        console.log(data);
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
          <input ref={weightRef} className="input-box"></input>
        </div>

        <div className="form-entry">
          <div className="text">Weight Unit</div>
          <select ref={weightUnitRef} className="input-box drop-down">
            <option value="kg">kg</option>
            <option value="ton">ton</option>
          </select>
        </div>
      </>
    ) : (
      <>
        <div className="form-entry">
          <div className="text">Volume</div>
          <input ref={weightRef} className="input-box"></input>
        </div>

        <div className="form-entry">
          <div className="text">Volume Unit</div>
          <select ref={weightUnitRef} className="input-box drop-down">
            <option value="gallon">gal</option>
            <option value="litre">l</option>
          </select>
        </div>
      </>
    );
  }

  function ErrorMessageComponent({ errorMessage }) {
    if (errorMessage) {
      return (
        <div
          className={`error-message-container ${errorMessage ? '' : 'hidden'}`}
        >
          <span className="error-message-prefix-bar"></span>
          <span className="error-message-text">{errorMessage}</span>
        </div>
      );
    }
  }

  function handleMapReadyEvent(map) {
    map.target.zoomControl.setPosition('topright');
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
            className={`${isGoodsSelected ? '' : 'grey'}`}
            onClick={() => {
              setIsGoodsSelected(true);
            }}
          >
            Goods
          </div>
          <div
            className={`${isGoodsSelected ? 'grey' : ''}`}
            onClick={() => {
              setIsGoodsSelected(false);
            }}
          >
            Oil
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
          <div className="submit-button">
            <Button
              size="small"
              color="olive"
              inverted
              onClick={calculateEmissions}
            >
              Calculate Emissions
            </Button>
          </div>
        </div>
      </div>
      {emissionResults && (
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
              color="olive"
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
          <Button size="medium" color="olive" inverted>
            Offset Carbon Emissions
          </Button>
        </div>
      )}
    </>
  );
}

export default App;
