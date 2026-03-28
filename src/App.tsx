import { BrowserRouter } from "react-router";
import Home from './pages/Home';

/* Theme variables */
import './theme/variables.css';
import NavBar from './components/NavBar';

const App: React.FC = () => (
  <NavBar />
);

export default App;
