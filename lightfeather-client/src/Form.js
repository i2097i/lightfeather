import Select from 'react-select'

import './stylesheets/Form.css';

function Form({formData, supervisors, fieldChangeHandler, isValid, onSubmit}) {
  return (
    <div>
      <div><h1>Notification Form</h1></div>
      <form>
        <div className="form-group">
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" pattern="\D" onChange={fieldChangeHandler} value={formData.firstName || ''}/>
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" pattern="/\D/g" onChange={fieldChangeHandler} value={formData.lastName || ''}/>
          </div>
        </div>

        <div className="form-group">
          <div className="form-field">
            <div className="check-group">
              <input type="checkbox" name="usePhone" value={formData.usePhone} onChange={fieldChangeHandler} />
              <div>Phone Number</div>
            </div>
            <input type="text" id="phoneNumber" name="phoneNumber" onChange={fieldChangeHandler} value={formData.phoneNumber || ''}/>
          </div>
          <div className="form-field">
            <div className="check-group">
              <input type="checkbox" name="useEmail" value={formData.useEmail} onChange={fieldChangeHandler} />
              <div>Email</div>
            </div>
            <input type="text" id="email" name="email" onChange={fieldChangeHandler} value={formData.email || ''}/>
          </div>
        </div>

        <div className="supervisors form-field">
          <Select options={supervisors} onChange={fieldChangeHandler} value={formData.supervisor || ''}/>
        </div>
        <div className="supervisors form-field">
          <input className="submit" type="submit" value="Submit" onClick={onSubmit} disabled={!isValid}/>
        </div>
      </form>
    </div>
  );
}

export default Form;
