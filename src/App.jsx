import Home from "./home/home"
import Navbar from "./navbar/navbar"
import RegistrationPage from "./registration/RegistrationPage";

const App = ()=>{
        return(
        <>
            <main>
                <Navbar></Navbar>
                <Home></Home>
            </main>
            <div>
                <h1>Climate Chronicler</h1>
                <RegistrationPage />
            </div>
        </>
    )
     
}

export default App