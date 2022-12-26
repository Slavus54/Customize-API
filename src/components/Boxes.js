import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link, useLocation} from 'wouter'
import axios from 'axios'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

function Boxes() {
    const [loc, setLoc] = useLocation()
    const [user, setUser] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [boxes, setBoxes] = useState([])

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'
    
    useEffect(() => {
        let data = Cookies.get('client')

        if (data !== null && data !== undefined) {
            setUser(JSON.parse(data))
        }
    }, [])

    const getInitialCollections = async () => {
        let data = await axios.post(`https://customize-api.herokuapp.com/boxes`, {
            userId: user.shortid
        })

        setBoxes(data.data)
    }

    useEffect(() => {
        if (user !== null) {
           getInitialCollections()
        }
    }, [user])

    return (
        <div className="con">
            <h3>APIs Boxes</h3>
            {boxes !== null &&
                <>
                    <div className='invs'>
                        {boxes.map(el => (
                            <Card className='inv' onClick={() => setLoc(`/box/${el.shortid}`)}>
                                <CardContent>
                                    <Typography>{el.title}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            }
        </div>
  );
}

export default Boxes