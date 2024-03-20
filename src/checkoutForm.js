import './checkoutForm.css';
import { Button } from 'semantic-ui-react';
import { useState } from 'react';
import tree from './images/tree.png';
import renewable from './images/renewable-energy.png';
import community from './images/diversity.png';

function CheckoutForm({ offsetPageElem }) {
  const [offsetEmissions, setOffsetEmissions] = useState(false);
  const [inputValidated, setInputValidated] = useState({
    offsetCheckbox: true,
  });
  const [displayOffsetTypes, setDisplayOffsetTypes] = useState(false);
  const [currPage, setCurrPage] = useState(0);

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

  function handlePageTwoNext() {
    console.log('Page two handler');
  }

  function handleNext(e) {
    if (currPage === 0) {
      handlePageOneNext();
    }
    if (currPage === 1) {
      handlePageTwoNext();
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

  const offsetTypesClass = displayOffsetTypes
    ? `offset-types-container`
    : `offset-types-container hidden`;
  const isBackDisabled = currPage > 0 ? false : true;
  const buttonText = currPage < 1 ? 'Next' : 'Submit';

  return (
    <div ref={offsetPageElem} className="offset-page">
      <div className="form-container">
        <h3>Quick Shipment</h3>
        <h4>Basic Details</h4>
        <div className="form-row">
          <div className="form-field">
            <h5>First Name</h5>
            <input disabled placeholder="First Name"></input>
          </div>
          <div className="form-field">
            <h5>Last Name</h5>
            <input disabled placeholder="Last Name"></input>
          </div>
          <div className="form-field">
            <h5>Mobile No</h5>
            <input disabled placeholder="Mobile No"></input>
          </div>
        </div>
        <h4>Pickup Address</h4>
        <div className="form-row ">
          <div className="form-field">
            <h5>Full Address</h5>
            <input disabled placeholder="Full Address"></input>
          </div>
          <div className="form-field">
            <h5>Landmark</h5>
            <input disabled placeholder="Landmark"></input>
          </div>
        </div>
        <div className="form-row ">
          <div className="form-field">
            <h5>Pincode</h5>
            <input disabled placeholder="Pincode"></input>
          </div>
          <div className="form-field">
            <h5>City</h5>
            <input disabled placeholder="City"></input>
          </div>
          <div className="form-field">
            <h5>Country</h5>
            <select disabled placeholder="Country"></select>
          </div>
        </div>
        <h4>Delivery Address</h4>
        <div className="form-row ">
          <div className="form-field">
            <h5>Full Address</h5>
            <input disabled placeholder="Full Address"></input>
          </div>
          <div className="form-field">
            <h5>Landmark</h5>
            <input disabled placeholder="Landmark"></input>
          </div>
        </div>
        <div className="form-row ">
          <div className="form-field">
            <h5>Pincode</h5>
            <input disabled placeholder="Pincode"></input>
          </div>
          <div className="form-field">
            <h5>City</h5>
            <input disabled placeholder="City"></input>
          </div>
          <div className="form-field">
            <h5>Country</h5>
            <select disabled placeholder="Country"></select>
          </div>
        </div>
        <h4>Package Details</h4>
        <div className="form-row ">
          <div className="form-field">
            <h5>Weight</h5>
            <input disabled placeholder="Weight(in kgs)"></input>
          </div>
          <div className="form-field">
            <h5>
              Enter package dimensions (L*B*H) to calculate Volumetric Weight
            </h5>
            <div className="multiple-input-inline">
              <input disabled placeholder="0.00 CM"></input>
              <input disabled placeholder="0.00 CM"></input>
              <input disabled placeholder="0.00 CM"></input>
            </div>
          </div>
        </div>
        <div className="form-row checkbox">
          <input
            type="checkbox"
            name="offsetCheckbox"
            onChange={handleChange}
          ></input>
          <label>I would like to offset carbon emissions</label>
        </div>
        <div className={offsetTypesClass}>
          <div className="offset-type">
            <img src={tree} alt="Tree"></img>
            <label>Nature based credits</label>
          </div>
          <div className="offset-type">
            <img src={community} alt="Tree"></img>
            <label>Community based credits</label>
          </div>
          <div className="offset-type">
            <img src={renewable} alt="Tree"></img>
            <label>Renewable based credits</label>
          </div>
        </div>
        {!inputValidated['offsetCheckbox'] && (
          <label className="error-label">
            Please mark the checkbox to continue.
          </label>
        )}
        <div className="form-row submit-buttons">
          <Button disabled={isBackDisabled} color="teal" onClick={handleBack}>
            Back
          </Button>
          <Button color="teal" onClick={handleNext}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;
