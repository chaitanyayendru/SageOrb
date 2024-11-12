import React, { useState } from 'react';
import DataUpload from './components/DataUpload';
import ProjectionChart from './components/ProjectionChart';
import OptimizationResult from './components/OptimizationResult';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [projection, setProjection] = useState([]);
  const [optimization, setOptimization] = useState(null);

  return (
    <div className="App">
      <h1>Liquidity Optimization Tool</h1>
      <DataUpload setData={setData} />
      {data.length > 0 && (
        <>
          <ProjectionChart data={projection} />
          <OptimizationResult result={optimization} />
        </>
      )}
    </div>
  );
}

export default App;
