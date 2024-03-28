import './checkoutPage.css';
import { Button } from 'semantic-ui-react';
import { useState } from 'react';
import tree from './images/tree.png';
import renewable from './images/renewable-energy.png';
import community from './images/diversity.png';
import { Icon } from 'semantic-ui-react';
import forest from './images/forest.png';
import planet from './images/planet-earth.png';

function CheckoutPage({ offsetPageElem }) {
  const [offsetEmissions, setOffsetEmissions] = useState(false);
  const [inputValidated, setInputValidated] = useState({
    offsetCheckbox: true,
  });
  const [displayOffsetTypes, setDisplayOffsetTypes] = useState(false);
  const [currPage, setCurrPage] = useState(0);
  const [highlightedOffsetTypeIdx, setHighlightedOffsetTypeIdx] = useState(0);

  const offsetTypes = [
    {
      name: 'Nature',
      image: tree,
    },
    {
      name: 'Community',
      image: community,
    },
    {
      name: 'Renewable',
      image: renewable,
    },
  ];

  function handleBack(e) {
    if (currPage === 1) {
      handlePageOneBack();
    }
  }

  function handlePageOneBack() {
    setDisplayOffsetTypes(false);
    setCurrPage(currPage - 1);
  }

  function handlePageOneNext() {
    if (!offsetEmissions) {
      setInputValidated((inputValidated) => {
        return {
          ...inputValidated,
          offsetCheckbox: false,
        };
      });
      return;
    }

    setInputValidated((inputValidated) => {
      return {
        ...inputValidated,
        offsetCheckbox: true,
      };
    });
    setDisplayOffsetTypes(true);
    setCurrPage(currPage + 1);
  }

  function handleNext(e) {
    if (currPage === 0) {
      handlePageOneNext();
    }
    if (currPage === 1) {
      setCurrPage(currPage + 1);
    }
  }

  function handleChange(e) {
    switch (e.target.name) {
      case 'offsetCheckbox':
        setOffsetEmissions(e.target.checked);
        break;
      default:
    }
  }

  function FormContent() {
    if (currPage === 2) {
      return (
        <div>
          <span className="submission-result">
            Thanks for choosing to offset the carbon emissions with us. Offset
            details are sent to your email address. You can view your offsetting
            history in the dashboard.
          </span>
          <img className="result-icon" src={planet} alt="planet "></img>
        </div>
      );
    }

    const offsetCheckBoxClass =
      currPage === 0 ? `form-row checkbox` : `form-row checkbox hidden`;
    const offsetTypesClass = displayOffsetTypes
      ? `offset-types-container`
      : `offset-types-container hidden`;
    const isBackDisabled = currPage > 0 ? false : true;
    const buttonText = currPage < 1 ? 'Next' : 'Submit';

    return (
      <>
        <h3>Quick Shipment</h3>
        <label>Basic Details</label>
        <div className="form-row">
          <div className="form-field">
            <label>First Name</label>
            <input disabled placeholder="First Name"></input>
          </div>
          <div className="form-field">
            <label>Last Name</label>
            <input disabled placeholder="Last Name"></input>
          </div>
          <div className="form-field">
            <label>Mobile No</label>
            <input disabled placeholder="Mobile No"></input>
          </div>
        </div>
        <label>Pickup Address</label>
        <div className="form-row ">
          <div className="form-field">
            <label>Full Address</label>
            <input disabled placeholder="Full Address"></input>
          </div>
          <div className="form-field">
            <label>Landmark</label>
            <input disabled placeholder="Landmark"></input>
          </div>
        </div>
        <div className="form-row ">
          <div className="form-field">
            <label>State/Province</label>
            <input disabled placeholder="State/Province"></input>
          </div>
          <div className="form-field">
            <label>Pincode</label>
            <input disabled placeholder="Pincode"></input>
          </div>
          <div className="form-field">
            <label>Country</label>
            <select disabled></select>
          </div>
        </div>
        <label>Delivery Address</label>
        <div className="form-row ">
          <div className="form-field">
            <label>Full Address</label>
            <input disabled placeholder="Full Address"></input>
          </div>
          <div className="form-field">
            <label>Landmark</label>
            <input disabled placeholder="Landmark"></input>
          </div>
        </div>
        <div className="form-row ">
          <div className="form-field">
            <label>State/Province</label>
            <input disabled placeholder="State/Province"></input>
          </div>
          <div className="form-field">
            <label>Pincode</label>
            <input disabled placeholder="Pincode"></input>
          </div>
          <div className="form-field">
            <label>Country</label>
            <select disabled></select>
          </div>
        </div>
        <label>Package Details</label>
        <div className="form-row ">
          <div className="form-field">
            <label>Weight</label>
            <input disabled placeholder="Weight(in kgs)"></input>
          </div>
          <div className="form-field">
            <label>
              Enter package dimensions (L*B*H) to calculate Volumetric Weight
            </label>
            <div className="multiple-input-inline">
              <input disabled placeholder="0.00 CM"></input>
              <input disabled placeholder="0.00 CM"></input>
              <input disabled placeholder="0.00 CM"></input>
            </div>
          </div>
        </div>
        <div className={offsetCheckBoxClass}>
          <input
            type="checkbox"
            name="offsetCheckbox"
            onChange={handleChange}
            checked={offsetEmissions}
          ></input>
          <label>I would like to offset carbon emissions</label>
        </div>
        <div className={offsetTypesClass}>
          <label>
            You can choose how you want to offset the carbon emissions. Pick{' '}
            <b>One</b>.
          </label>
        </div>
        <div className={offsetTypesClass}>
          {offsetTypes.map((offsetType, index) => {
            const containerClass =
              highlightedOffsetTypeIdx === index
                ? `offset-type highlight`
                : `offset-type`;
            return (
              <div
                className={containerClass}
                onClick={() => {
                  setHighlightedOffsetTypeIdx(index);
                }}
              >
                <img src={offsetType.image} alt={offsetType.name}></img>
                <label>{`${offsetType.name} based credits`}</label>
              </div>
            );
          })}
          <Icon
            circular
            inverted
            color="grey"
            size="tiny"
            name="question"
          ></Icon>
        </div>
        {!inputValidated['offsetCheckbox'] && (
          <label className="error-label">
            Please mark the checkbox to continue.
          </label>
        )}
        <div className="form-row submit-buttons">
          <Button disabled={isBackDisabled} onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext}>{buttonText}</Button>
        </div>
      </>
    );
  }

  return (
    <div ref={offsetPageElem} className="offset-page">
      <div className="outer-container">
        <div className="banner">
          <div className="info">
            <h2>
              Integrate our APIs to embed carbon intelligence into your software
              and offset carbon emissions.
            </h2>

            <h3>
              This example showcases how you can seamlessly integrate our API
              into your checkout page, allowing customers to offset their carbon
              emissions as part of the purchasing process.
            </h3>
          </div>
          <img className="banner-image" src={forest} alt="forest"></img>
        </div>
        <div className="form-container">
          <FormContent></FormContent>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
