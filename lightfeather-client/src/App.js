import './stylesheets/App.css';
import React, { useState, useEffect } from 'react';
import Form from './Form';
import { ToastContainer, toast } from "react-toast";

const API_BASE = "http://localhost:8080/api" // TODO: Env var this

var loadingSupervisors = false;

const REQUIRED_FIELDS = ['firstName', 'lastName', 'supervisor'];

const validate = (fields) => {
  var valid = true;
  const keys = Object.keys(fields);
  REQUIRED_FIELDS.forEach((f) => {
    valid = valid && keys.includes(f) && fields[f];
  });
  return valid;
}

const App = () => {
  const [formData, setFormData] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    if (!loadingSupervisors && supervisors.length === 0) {
      loadingSupervisors = true;
      fetch(`${API_BASE}/supervisors`)
        .then(res => res.json())
        .then((result) => {

          // Numeric jurisdictions should be removed from the response
          // Sort alphabetical order, jurisdiction, last name, first name
          setSupervisors(result
            .filter((s) => s.jurisdiction && s.jurisdiction.match(/\D/))
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
            .sort((a, b) => a.lastName.localeCompare(b.lastName))
            .sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction))
            .map((s) => {
              return {
                value: s.id,
                label: `${s.jurisdiction} - ${s.lastName}, ${s.firstName}`
              }
            }));
          loadingSupervisors = false;
        }, (error) => {
          toast.warn('Something went wrong loading supervisors');
          loadingSupervisors = false;
        }
      );
    }
    setIsValid(validate(formData));
    console.log(formData);
  }, [formData, supervisors]);

  const fieldChangeHandler = (event) => {
    const updates = {};
    if (supervisors.includes(event)) {
      updates.supervisor = event;
    } else {
      const t = event.target;
      var val = t.value;
      if (t.type === 'checkbox') {
        val = t.checked;
      }

      if (val) {
        updates[t.name] = val;
      } else {
        delete formData[t.name];
      }
    }
    setFormData({ ...formData, ...updates});
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    const body = formData;
    if (body.supervisor) {
      body.supervisor = body.supervisor.value;
    }
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    fetch(`${API_BASE}/submit`, requestMetadata)
      .then(res => res.json())
      .then(result => {
          if (result.errors.length === 0) {
            toast.success("Form submitted successfully!");
            setFormData({});
            console.error(formData);
          } else {
            result.errors.forEach((err) => {
              toast.error(err);
            });
          }
      });
  };

  return (
    <div className="App">
      <Form
        formData={formData}
        supervisors={supervisors}
        fieldChangeHandler={fieldChangeHandler}
        isValid={isValid}
        onSubmit={onSubmit}/>
      <ToastContainer delay={3000} />
    </div>
  );
}

export default App;
