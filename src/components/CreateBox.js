import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link} from 'wouter'
import axios from 'axios'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

function CreateBox() {
    const [user, setUser] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [cats] = useState(['Food', 'Transport'])
    const [ts] = useState(['String', 'Number'])
    const [prop, setProp] = useState({
        id: '',
        property: '',
        propertyType: ''
    })
    const [daten, setDaten] = useState({
        title: '',
        category: '',
        properties: []
    })

    const {title, category, properties} = daten
    const {id, property, propertyType} = prop

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'

    
    useEffect(() => {
        let data = Cookies.get('client')

        if (data !== null && data !== undefined) {
            setUser(JSON.parse(data))
        }
    }, [])

    useEffect(() => {
        if (property !== '' && id === '') {
            setProp({...prop, id: shortid.generate().toString()})
        }
    }, [property])

    const onAddProp = () => {
        if (properties.find(el => el.property === property) === undefined) {
            setDaten({...daten, properties: [...properties, prop]})
        }

        setProp({
            id: '',
            property: '',
            type: ''
        })
    }

    const onCreateBox = async () => {
        let data = await axios.post(`https://customize-api.herokuapp.com/create-box`, Object.assign({userId: user.shortid, name: user.name}, daten))
        
        console.log(data.data)

        window.location.reload()
    }

    return (
        <div className="con">
            <h3>Create APIs Box</h3>
            <TextField value={title} onChange={e => setDaten({...daten, title: e.target.value})} placeholder="Enter title of box" />
            <Select onChange={e => setDaten({...daten, category: e.target.value})}>
                {cats.map(el => <option value={el}>{el}</option>)}
            </Select>

            <h3>Add Properties</h3>
            <TextField value={property} onChange={e => setProp({...prop, property: e.target.value})} placeholder="Enter title of property" />
            <Select onChange={e => setProp({...prop, propertyType: e.target.value})}>
                {ts.map(el => <option value={el}>{el}</option>)}
            </Select>
            <Button onClick={onAddProp}>Add</Button>
            
            <Button onClick={onCreateBox}>Create</Button>
        </div>
  );
}

export default CreateBox
