import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { LMSLPage } from './pages/LMSLPage';
import { LMMLPage } from './pages/LMMLPage';
import { PlayerProfilePage } from './pages/PlayerProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="lmsl" element={<LMSLPage />} />
          <Route path="lmml" element={<LMMLPage />} />
          <Route path="player/:playerId" element={<PlayerProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
