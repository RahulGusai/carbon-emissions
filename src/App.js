import './App.css';
import { Button } from 'semantic-ui-react';
import { useEffect, useRef, useState } from 'react';
import { Icon } from 'semantic-ui-react';

function App() {
  const [emissionResults, setEmissionResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const weightRef = useRef(null);
  const weightUnitRef = useRef(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const calculateEmissions = async () => {
    const origin = originRef.current.value;
    const destination = destinationRef.current.value;
    const weight = weightRef.current.value;
    const weightUnit = weightUnitRef.current.value;

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
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (response.status !== 200) {
        const { detail } = data;
        setErrorMessage(detail);
      } else {
        const { route, emissions } = data;
        setEmissionResults((emissionResults) => {
          return {
            ...emissionResults,
            distance_in_kms: route.distance_in_kms,
            co2e: emissions.co2e,
            origin: route.origin,
            destination: route.destination,
          };
        });
      }
    } catch (error) {
      setErrorMessage('Something unexpected happened.Please try again.');
    }
  };

  return (
    <>
      <div className={`error-message ${errorMessage ? '' : 'hidden'}`}>
        <span>{errorMessage}</span>
      </div>
      <div className="app-container">
        <div className="carbon-calculator">
          <div className="form">
            <div className="form-entry">
              <div class="text">Origin</div>
              <input ref={originRef} className="input-box"></input>
            </div>
            <div className="form-entry">
              <div class="text">Destination</div>
              <input ref={destinationRef} className="input-box"></input>
            </div>
            <div className="form-entry">
              <div class="text">Weight</div>
              <input ref={weightRef} className="input-box"></input>
            </div>
            <div className="form-entry">
              <div className="text">Weight Unit</div>
              <select ref={weightUnitRef} className="input-box drop-down">
                <option value="kg">kg</option>
                <option value="ton">kg</option>
              </select>
            </div>
            <div className="form-entry">
              <div className="text">Mode</div>
              <select className="input-box drop-down">
                <option value="Road Freight">Road</option>
              </select>
            </div>
            <div className="submit-button">
              <Button size="medium" color="violet" onClick={calculateEmissions}>
                Calculate Emissions
              </Button>
            </div>
          </div>
          {emissionResults && (
            <div className="results-container">
              <div className="emissions">
                <span>
                  <b>Emissions</b>
                </span>
                <span className="value">{`${emissionResults.co2e}kg`}</span>
                <span className="label">CO2e emissions</span>
              </div>
              <div className="route-data">
                <span>
                  <b>Route Data</b>
                </span>
                <span className="value">
                  {`${emissionResults.distance_in_kms}KM`}
                </span>
                <span className="label">Distance</span>
              </div>
              <div className="location-marker">
                <Icon circular name="map marker alternate" size="large"></Icon>
                <span>{`${emissionResults.origin.city}, ${emissionResults.origin.country}`}</span>
              </div>
              <div className="location-marker">
                <Icon circular name="truck" size="large"></Icon>
                <div className="emission-details">
                  <span>{`${emissionResults.co2e}kg`}</span>
                  <span className="label">CO2e emissions</span>
                </div>
              </div>
              <div className="location-marker">
                <Icon circular name="map marker alternate" size="large"></Icon>
                <span>{`${emissionResults.destination.city}, ${emissionResults.destination.country}`}</span>
              </div>
              <div></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;