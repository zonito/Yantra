import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './components/Layout'
import Home from './pages/Home'
import StagePage from './pages/StagePage'
import Machinery from './pages/Machinery'
import Rules from './pages/Rules'
import Quality from './pages/Quality'
import Handoffs from './pages/Handoffs'
import Gaps from './pages/Gaps'
import Jev from './pages/Jev'
import Agni from './pages/Agni'
import Airavata from './pages/Airavata'

// NOTE: ./components/Layout exports the Shell as default under the name App
// (header + animated outlet). Routes are declared here.
export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="stage/:id" element={<StagePage />} />
          <Route path="machinery" element={<Machinery />} />
          <Route path="rules" element={<Rules />} />
          <Route path="quality" element={<Quality />} />
          <Route path="handoffs" element={<Handoffs />} />
          <Route path="gaps" element={<Gaps />} />
          <Route path="jev" element={<Jev />} />
          <Route path="agni" element={<Agni />} />
          <Route path="airavata" element={<Airavata />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
