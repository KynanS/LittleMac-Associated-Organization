import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { TournamentDashboard } from './pages/TournamentDashboard';
import { DataVerifier } from './components/DataVerifier';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="lmsl"
            element={<TournamentDashboard title="LMSL Statistics" filterStr="StarCraft" />}
          />
          <Route
            path="lmml"
            element={<TournamentDashboard title="LMML Statistics" filterStr="Master" />}
          />
          <Route path="verifier" element={<DataVerifier />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
