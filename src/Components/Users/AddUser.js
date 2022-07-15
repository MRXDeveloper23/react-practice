import React, { useState, useRef, useReducer } from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import classes from './AddUser.module.css';

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {
      value: action.val,
      isValid: action.val.includes('@'),
    };
  }
  if (action.type === 'INPUT_BLUR') {
    return {
      value: state.value,
      isValid: state.value.includes('@'),
    };
  }
  return {
    value: '',
    isValid: false,
  };
};
//useEffect(), useState(), useReducer(), useRef()
function AddUser(props) {
  const [error, setError] = useState();
  const [emailState, dispatchEmailState] = useReducer(emailReducer, {
    value: '',
    isValid: false,
  });
  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const addUserHandler = (event) => {
    event.preventDefault();
    const enteredUsername = nameInputRef.current.value;
    const enteredAge = ageInputRef.current.value;
    if (enteredAge.trim().length === 0 || enteredUsername.trim().length === 0) {
      setError({
        title: 'Invalid name or age',
        message: 'Please enter valid input(non-empty values)',
      });
      return;
    }
    if (+enteredAge < 1) {
      setError({
        title: 'Invalid age',
        message: 'Please enter valid age',
      });
      return;
    }
    props.onAddUser(enteredUsername, enteredAge, emailState.value);
    nameInputRef.current.value = '';
    ageInputRef.current.value = '';
    dispatchEmailState({
      type: 'USER_INPUT',
      val: '',
    });
  };
  const cancelErrorHandler = () => {
    setError(null);
  };
  const emailChangeHandler = (event) => {
    dispatchEmailState({
      type: 'USER_INPUT',
      val: event.target.value,
    });
  };
  const validateEmailHandler = () => {
    dispatchEmailState({
      type: 'INPUT_BLUR',
    });
  };
  return (
    <div>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onCancelErrorModal={cancelErrorHandler}
        />
      )}
      <Card className={classes.input}>
        <form onSubmit={addUserHandler}>
          <label htmlFor="username">Username</label>
          <input ref={nameInputRef} id="username" type="text" />
          <label htmlFor="email">Email</label>
          <input
            value={emailState.value}
            id="email"
            type="email"
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
          <label htmlFor="age">Age (Years)</label>
          <input ref={ageInputRef} id="age" type="number" />
          <Button type="submit">Add User</Button>
        </form>
      </Card>
    </div>
  );
}

export default AddUser;
