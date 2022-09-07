import Select from 'react-select'

function Form({formData, supervisors, fieldChangeHandler, onSubmit}) {
  return (
    <div>
      <div><h1>Notification Form</h1></div>
      <form>
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" name="firstName" onChange={fieldChangeHandler} value={formData.firstName}/>

        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" name="lastName" onChange={fieldChangeHandler} value={formData.lastName}/>

        <input type="checkbox" name="usePhone" onChange={fieldChangeHandler} />
        <div>Phone Number</div>
        <input type="text" id="phoneNumber" name="phoneNumber" onChange={fieldChangeHandler} value={formData.phoneNumber}/>

        <input type="checkbox" name="useEmail" onChange={fieldChangeHandler} />
        <div>Email</div>
        <input type="text" id="email" name="email" onChange={fieldChangeHandler} value={formData.email}/>

        <Select options={supervisors} onChange={fieldChangeHandler} />

        <input type="submit" value="Submit" onClick={onSubmit}/>
      </form>
    </div>
  );
}

export default Form;
