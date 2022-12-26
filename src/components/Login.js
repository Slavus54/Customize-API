import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link, useLocation} from 'wouter'
import axios from 'axios'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

function Login() {
    const [loc, setLoc] = useLocation()
    const [user, setUser] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [daten, setDaten] = useState({
        userId: ''
    })
    
    const {userId} = daten

    
    useEffect(() => {
        let data = Cookies.get('client')

        if (data === null && data !== undefined) {
            setUser(JSON.parse(data))
        }
    }, [])

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'

    const onLog = async () => {
        let data = await axios.post(`https://customize-api.herokuapp.com/login`, daten)

        console.log(data.data)

        Cookies.set('client', JSON.stringify(data.data))
        setLoc('/')
        window.location.reload()
    }

    return (
        <div className="con">
            <h3>Login By ID</h3>
            <TextField value={userId} onChange={e => setDaten({...daten, userId: e.target.value})} placeholder="Enter your ID" />
       
            <Button onClick={onLog}>Login</Button>
        </div>
  );
}

export default Login