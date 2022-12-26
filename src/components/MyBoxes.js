import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea, TextareaAutosize} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link, useLocation} from 'wouter'
import axios from 'axios'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

function MyBoxes() {
    const [loc, setLoc] = useLocation()
    const [user, setUser] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [boxes, setBoxes] = useState(null)

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'
    
    useEffect(() => {
        let data = Cookies.get('client')

        if (data !== null && data !== undefined) {
            setUser(JSON.parse(data))
        }
    }, [])

    const getInitialCollections = async () => {
        let data = await axios.post(`https://customize-api.herokuapp.com/get-user`, {
            userId: user.shortid
        })
        console.log(data.data)
        setBoxes(data.data.boxes)
    }

    useEffect(() => {
        if (user !== null) {
           getInitialCollections()
        }
    }, [user])

    

    return (
        <div className="con">
            <h3>My APIs Boxes</h3>
            {user !== null && boxes !== null &&
                <>
                    <div className='invs'>
                        {boxes.map(el => (
                            <Card className='inv' onClick={() => setLoc(`/box/${el.id}`)}>
                                <CardContent>
                                    <Typography>{el.title}</Typography>
                                    <Typography>{el.role}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            }
        </div>
  );
}

export default MyBoxes