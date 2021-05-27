import React, { useState } from 'react';
import MainLayout from '@layouts/main';
import Home from '@views/home';

const App = () => {
  const [weights, setWeights] = useState(null);
  const [results, setResults] = useState(null);

  const setNNWeights = (weights) => {
    setWeights(weights);
  };

  return (
    <MainLayout setNNWeights={setNNWeights} setResults={setResults}>
      <Home NNWeights={weights} results={results} />
    </MainLayout>
  );
};

export default App;
