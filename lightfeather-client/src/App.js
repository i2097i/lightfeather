import './App.css';
import React, { useState, useEffect } from 'react';
import Form from './Form';

const API_BASE = "http://localhost:8080/api" // TODO: Env var this

var loadingSupervisors = false;

const App = () => {
  const [formData, setFormData] = useState({});
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    if (!loadingSupervisors && supervisors.length === 0) {
      loadingSupervisors = true;
      fetch(`${API_BASE}/supervisors`)
        .then(res => res.json())
        .then((result) => {
          setSupervisors(result.map((s) => {
            return {
              value: s.id,
              label: `${s.firstName} ${s.lastName}`
            }
          }));
          loadingSupervisors = false;
        }, (error) => {
          // TODO: handle errors from express server
          loadingSupervisors = false;
        }
      );
    }
  });

  const fieldChangeHandler = (event) => {
    if (supervisors.includes(event)) {
      formData.supervisor = event.value;
    } else {
      const t = event.target;
      formData[t.name] = t.type === 'checkbox' ? t.checked : t.value;
    }
    console.error(formData);
  };

  const onSubmit = (event) => {
    // TODO: disable the button until the form is valid
    event.preventDefault();
    console.error("submitting!!!");
    console.error(formData);

    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    };
    console.error(requestMetadata);

    fetch(`${API_BASE}/submit`, requestMetadata)
      .then(res => res.json())
      .then(result => {
          console.error(result);
      });
  };

  return (
    <Form
      formData={formData}
      supervisors={supervisors}
      fieldChangeHandler={fieldChangeHandler}
      onSubmit={onSubmit}/>
  );
}

export default App;
