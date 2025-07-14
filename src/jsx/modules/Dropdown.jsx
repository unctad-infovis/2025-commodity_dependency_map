import React, {
  useEffect, useCallback, useState, useRef
} from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';

// https://www.npmjs.com/package/uuid4
// import { v4 as uuidv4 } from 'uuid';

function Dropdown({ values }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  const buttonRef = useRef(null);

  const createDropdown = useCallback((elements) => {
    elements = elements.filter((el => el.filename)).map((el => ({
      value: el.filename,
      label: el.country
    })));
    setOptions(elements);
  }, []);

  const handleChange = (selected) => {
    buttonRef.current.style.backgroundColor = '#009edb';
    setSelectedOption(selected);
  };

  const openLink = () => {
    if (selectedOption) {
      const url = `/system/files/information-document/${selectedOption.value}`;
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    createDropdown(values);
  }, [createDropdown, values]);

  return (
    <div className="country_profiles_container">
      <h3>Country profiles</h3>
      <div className="dropdown_container">
        <Select
          className="select_drowdown"
          onChange={handleChange}
          options={options}
          placeholder="Select country"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isHovered ? '#009edb' : '#009edb',
            })
          }}
        />
        <div className="select_button"><button ref={buttonRef} type="button" onClick={() => openLink()}>Open country profile</button></div>
      </div>
    </div>
  );
}
export default Dropdown;

Dropdown.propTypes = {
  values: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object
  ])).isRequired
};
