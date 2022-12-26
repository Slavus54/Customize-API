import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import Navbar from './components/Navbar'
import './App.css';

function App() {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(0)

  useEffect(() => {
    let data = Cookies.get('client')

    if (data !== null && data !== undefined) {
        setUser(JSON.parse(data))
    }
}, [])

  const onLogOut = () => {
    Cookies.remove('client')
    window.location.reload()
  }

  return (
    <div className="App">
      <Navbar />
      {user !== null && 
        <>
            <Typography>Own ID - {user.shortid}</Typography>
            <Button onClick={onLogOut}>Logout</Button>
        </>
      }
     
    </div>
  );
}

export default App;
