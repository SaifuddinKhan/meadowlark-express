import React, { useState, useEffect } from "react";

export default function Vacations() {
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    fetch("/api/vacations")
      .then((res) => res.json())
      .then(setVacations)
      .catch((err) => {
        console.error("encountered error:", err.message);
      });
    console.log("finished rendering at", Date.now());
  }, []);

  return (
    <>
      <h2>Vacations</h2>
      <div className="vacations">
        {vacations.map((vacation) => (
          <div key={vacation.sku}>
            <h3>{vacation.name}</h3>
            <p>{vacation.description}</p>
            <span className="price">{vacation.price}</span>
            {!vacation.inSeason && <NotInSeason sku={vacation.sku} />}
            <br />
            <br />
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}

function NotInSeason({ sku }) {
  const [email, setEmail] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('initial');

  function handleNotify(evt) {
    console.log('Button is clicked');
    fetch(`/api/vacation/${sku}/notify-when-in-season`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    })
    .then(res => {
      console.log('received response', res)
      if(res.status < 200 || res.status > 299) {
        setRegisteredEmail(false);
      }
      else {
        setRegisteredEmail(true);
      }
    })
    .catch((err) => {
      console.error('Error while submitting', err.message);
    });
    evt.preventDefault();
  }

  return (
    <>
      <form onSubmit={handleNotify}>
      <p>
        <i>This Vacation is currently not in season. You may sign up below:</i>
      </p>
      {!((registeredEmail === true) && (registeredEmail !== 'initial')) && <div><input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><button type="submit">Notify Me</button></div>}
      
      {(registeredEmail && (registeredEmail !== 'initial')) && <p color='green'>Successfully signed up</p>}
      {(!registeredEmail && (registeredEmail !== 'initial')) && <p color='red'>Failed to sign up</p>}
      </form>
    </>
  );
}
