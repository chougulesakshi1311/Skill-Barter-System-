import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="text-center py-5">
    <h1>404</h1>
    <p>Page not found</p>
    <Link to="/dashboard" className="btn btn-primary">
      Go Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
