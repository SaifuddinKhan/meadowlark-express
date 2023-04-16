import logo from "./img/logo.ico";
import Vacations from './Vacations.js' 
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
          <header>
            <img
              src={logo}
              alt="Meadowlark travel logo"
              style={{ height: "50px", width: "50px" }}
            />
          </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/vacations" element={<Vacations />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <>
      <h1>Home</h1>
      <p>Navigate to:</p>
      <br />
      <br />
      <br />
      <ul>
        <li>
          <Link to="/about">About us</Link>
        </li>
        <li>
          <Link to="/about/services">About our services</Link>
        </li>
        <li>
          <Link to="/headers">Headers page</Link>
        </li>
        <li>
          <Link to="/weather">Weather Page</Link>
        </li>
        <li>
          <Link to="/newsletter-signup">
            Sign up to our newsletter (server-sided)
          </Link>
        </li>
        <li>
          <Link to="/newsletter-signup-fetch">
            Sign up to our newsletter (client-sided fetch)
          </Link>
        </li>
        <li>
          <Link to="/contest/vacation-photo">
            Upload submission to vacation photo contest
          </Link>
        </li>
        <li>
          <Link to="/contest/vacation-photo-fetch">
            Upload submission to vacation photo contest (using fetch)
          </Link>
        </li>
        <li>
          <Link to="/vacations">Check current available vacation from DB</Link>
        </li>
        <li>
          <Link to="/custom">Custom testing page</Link>
        </li>
      </ul>
    </>
  );
}

function Custom() {
  return (
    <>
      <div role="alert">
        <strong>Holy guacamole!</strong> You should check in on some of those
        fields below.
        <button type="button" aria-label="Close">
          X
        </button>
      </div>
    </>
  );
}

function NotFound() {
  return <i>Page Not Found</i>;
}
