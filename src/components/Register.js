import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link, useLocation} from 'wouter'
import axios from 'axios'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

function Register() {
    const [loc, setLoc] = useLocation()
    const [user, setUser] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [domains] = useState([
        '@yandex.ru',
        '@gmail.com'
    ])
    const [daten, setDaten] = useState({
        name: '',
        email: '',
        password: '',
        cords: {lat: 0, long: 0}
    })

    const {name, email, password, cords} = daten

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'

    const setCords = e => {
        setDaten({...daten, cords: {
            lat: e.lngLat[1],
            long: e.lngLat[0]
        }})
    }

    const onReg = async () => {
        let data = await axios.post(`https://customize-api.herokuapp.com/register`, daten)

        console.log(data.data)

        Cookies.set('client', JSON.stringify(data.data))
        setLoc('/')
        window.location.reload()
    }

    return (
        <div className="con">
            <h3>Register</h3>
            <TextField value={name} onChange={e => setDaten({...daten, name: e.target.value})} placeholder="Enter your name" />
            <TextField value={email} onChange={e => setDaten({...daten, email: e.target.value})} placeholder="Enter your email" />
            <div className='invs'>
                {domains.map(el => (
                    <Card className='inv' onClick={() => email.includes('@') ? setDaten({...daten, email: email.split(el)[0]}): setDaten({...daten, email: `${email}${el}`})}>
                        <CardContent>
                            <Typography>{el}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <TextField value={password} onChange={e => setDaten({...daten, password: e.target.value})} placeholder="Enter your password" />
            <ReactMapGL {...view} onDblClick={setCords} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                <Marker latitude={cords.lat} longitude={cords.long}>
                    <>{name}</>
                </Marker>
            </ReactMapGL>
            <Button onClick={onReg}>Register</Button>
        </div>
  );
}

export default Register
