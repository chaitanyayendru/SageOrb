import React from 'react';

function OptimizationResult({ result }) {
  return (
    <div>
      <h2>Optimization Result</h2>
      {result ? (
        <div>
          <p>Minimum Reserve: {result.minimum_reserve}</p>
          <p>Message: {result.message}</p>
        </div>
      ) : (
        <p>No optimization result available.</p>
      )}
    </div>
  );
}

export default OptimizationResult;
