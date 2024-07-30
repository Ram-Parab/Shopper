import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({username:"",email:"",password:""});
  const [errors, setErrors] = useState({username: "", email: "", password: ""});

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
    
    // Reset error for the changed field
    setErrors(prevErrors => ({...prevErrors, [name]: ""}));

    // Validation
    if (name === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setErrors(prevErrors => ({...prevErrors, email: isValidEmail ? "" : "Invalid email address"}));
    } else if (name === "password") {
      const isValidPassword = value.trim().length >= 8;
      setErrors(prevErrors => ({...prevErrors, password: isValidPassword ? "" : "Password must be at least 8 characters long"}));
    }
  };

  const login = async () => {
    let dataObj;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {dataObj=data});
      console.log(dataObj);
      if (dataObj.success) {
        localStorage.setItem('auth-token',dataObj.token);
        window.location.replace("/");
      }
      else
      {
        alert(dataObj.errors)
      }
  }

  const signup = async () => {
    // Check if any field is empty
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    let dataObj;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept:'application/form-data',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((resp) => resp.json())
      .then((data) => {dataObj=data});

      if (dataObj.success) {
        localStorage.setItem('auth-token',dataObj.token);
        window.location.replace("/");
      }
      else
      {
        alert(dataObj.errors)
      }
  }

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?<input type="text" placeholder="Your name" name="username" value={formData.username} onChange={changeHandler}/>:<></>}
          <input type="email" placeholder="Email address" name="email" value={formData.email} onChange={changeHandler}/>
          {errors.email && <p className="error-message">{errors.email}</p>}
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={changeHandler}/>
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button onClick={()=>{state==="Login"?login():signup()}} disabled={Object.values(errors).some(error => error !== "")}>Continue</button>

        {state==="Login"?
        <p className="loginsignup-login">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>
        :<p className="loginsignup-login">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>}

      </div>
    </div>
  );
};

export default LoginSignup;