import {BrowserRouter, Route, Routes} from "react-router-dom"; 
import logo from './logo.svg';
import './App.css';

function App() {
  fetch("/api/fresh").then(response => response.text())
  .then(data => console.log({data}));
  //research
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
        
        <Route index element={<About/>}/>
        {/* sign up/in-baloon OR link of dashboard-baloon */}
        
        <Route path="user-page" element={<UserPage/>} />
        {/* navigation page + createFresh + edit username */}

      </Route>
    </Routes>
    </BrowserRouter>
  );
};

export default App;
