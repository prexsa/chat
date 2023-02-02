import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="pnf-container">
      <h3>Page Not Found</h3>
      <Link to="/">Go home</Link>
    </div>
    )
}

export default PageNotFound;