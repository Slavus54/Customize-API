import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea, TextareaAutosize} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link, useLocation} from 'wouter'
import axios from 'axios'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

function Clients() {
    const [loc, setLoc] = useLocation()
    const [user, setUser] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [clients, setClients] = useState(null)

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'
    
    useEffect(() => {
        let data = Cookies.get('client')

        if (data !== null && data !== undefined) {
            setUser(JSON.parse(data))
        }
    }, [])

    const getInitialCollections = async () => {
        let data = await axios.get(`https://customize-api.herokuapp.com/get-users`, {
            userId: user.shortid
        })

        setClients(data.data)
    }

    useEffect(() => {
        if (user !== null) {
           getInitialCollections()
        }
    }, [user])

    return (
        <div className="con">
            <h3>Clients</h3>
            {user !== null && clients !== null &&
                <>
                     <ReactMapGL {...view} mapboxApiAccessToken={token} onViewportChange={e => setView(e)}>
                        {clients.map(el => (
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <div className='con'>
                                    <b>{el.name}</b>
                                </div>
                            </Marker>
                        ))}
                    </ReactMapGL>
                </>
            }
        </div>
  );
}

export default Clients