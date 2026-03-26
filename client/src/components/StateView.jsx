const StateView = ({ loading, error, onRetry, children, loadingText = "Loading..." }) => {
  if (loading) {
    return <div className="alert alert-info">{loadingText}</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        {onRetry && (
          <button type="button" className="btn btn-sm btn-outline-light" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  return children;
};

export default StateView;
