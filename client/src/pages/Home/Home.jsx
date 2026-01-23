import {useState , useEffect} from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Body from '../../components/Body/Body.jsx';
import './Home.css';

const Home = () => {
    const [searchQuery , setSearchQuery] = useState("");

    return(
        <>
        <Navbar onSearch={setSearchQuery}/>
        <Body searchQuery={searchQuery}/>
        </>
    )
};

export default Home;