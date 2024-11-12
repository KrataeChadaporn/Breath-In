import "./App.css"
import HomePage from "./home/HomePage"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import SinglePage from "./components/watch/SinglePage"
import Header from "./components/header/Header"
import Footer from "./components/footer/Footer"
import Simulator from "./components/selfhatrd/Simulator"
import SimuStar from "./components/selfhatrd/SimmuStar"

function App() {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path="/simulator/:id" component={Simulator} />
          <Route path="/simustar/:id" component={SimuStar} /> 
          <Route path='/singlepage/:id' component={SinglePage} exact />
        </Switch>
        {/* <Footer /> */}
      </Router>
    </>
  )
}

export default App
