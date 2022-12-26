import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea, TextareaAutosize} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link, useLocation} from 'wouter'
import axios from 'axios'
import shortid from 'shortid'
import ReactMapGL, {Marker} from 'react-map-gl'

function Box({params}) {
    const [loc, setLoc] = useLocation()
    const [user, setUser] = useState(null)
    const [view, setView] = useState({
        latitude: 55.25,
        longitude: 82.7,
        width: '300px',
        height: '300px',
        zoom: 7
    })
    const [box, setBox] = useState(null)
    const [personal, setPersonal] = useState(null)
    const [mem, setMem] = useState(null)
    const [datagram, setDatagram] = useState(null)
    const [prop, setProp] = useState(null)
    const [isSupport, setIsSupport] = useState(false)
    const [url, setURL] = useState('http://localhost:4000/custom-api')
    const [queryProperty, setQueryProperty] = useState('')
    const [data, setData] = useState('')
    const [item, setItem] = useState('')
    const [index, setIndex] = useState(0)
    const [support, setSupport] = useState(0)
    const [totalLength, setTotalLength] = useState('')
    const [propertyLength, setPropertyLength] = useState(0)
    const [roles] = useState(['member'])
    const [crits] = useState(['Interest'])
    const [rat, setRat] = useState({
        criterion: '',
        rate: ''
    })
    const [daten, setDaten] = useState({
        rates: [],
        review: '',
        role: ''
    })

    const {rates, review, role} = daten
    const {criterion, rate} = rat

    const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'
    
    useEffect(() => {
        let data = Cookies.get('client')

        if (data !== null && data !== undefined) {
            setUser(JSON.parse(data))
        }
    }, [])

    const getInitialCollections = async () => {
        let data = await axios.post(`https://customize-api.herokuapp.com/box`, {
            userId: user.shortid,
            id: params.id
        })
        console.log(data.data)
        setBox(data.data)
        setPropertyLength(data.data.properties.length)
    }

    useEffect(() => {
        if (user !== null) {
           getInitialCollections()
        }
    }, [user])

    useEffect(() => {
        if (user !== null && box !== null) {
           let f = box.members.find(el => el.name === user.name)

           if (f !== undefined) {
                setPersonal(f)
           }
        }
    }, [box])

    useEffect(() => {
        if (box !== null) {
           if (index < box.properties.length) {
                setProp(box.properties[index])
           }
        }
    }, [box])

    useEffect(() => {
        if (box !== null) {
           if (index < box.properties.length) {
                setProp(box.properties[index])
           }
        }
    }, [index])

    const pasteDataFormatted = position => {
        if (prop.propertyType === 'String') {
            return `${position === 0 ? '{' : ''}"${prop.property}":"${item}"${position === box.properties.length - 1 ? '}' : ','}`
        } else {
            return `${position === 0 ? '{' : ''}"${prop.property}":${item}${position === box.properties.length - 1 ? '}' : ','}`
        }
    }

    const onTestAPI = async () => {
        let data = await axios.post(`https://customize-api.herokuapp.com/custom-api`, {
            id: box.shortid,
            propertyLength,
            totalLength: totalLength === '' ? 10 : totalLength,
            key: queryProperty
        })

        console.log(data.data)
    }

    const onAddCr = () => {
        setDaten({...daten, rates: [...rates, rat]})

        setRat({
            criterion: '',
            rate: ''
        })
    }

    const onAddItem = () => {
        setData(`${data}${pasteDataFormatted(index)}`)
        setIndex(index + 1)
        setItem('')
    }

    const onManageMembership = async (option) => {
        if (user !== null) {
            await axios.post(`https://customize-api.herokuapp.com/manage-box-membership`, {
                userId: user.shortid,
                id: params.id,
                userName: mem === null ? '' : mem.name,
                role,
                option
            })

        }
    }

    const onEst = async () => {
        if (user !== null) {
            await axios.post(`https://customize-api.herokuapp.com/rate-box`, {
                userId: user.shortid,
                id: params.id,
                rates,
                review
            })
        }
    }

    const onManageDatagram = async (option) => {
        if (user !== null) {
            await axios.post(`https://customize-api.herokuapp.com/manage-box-datagram`, {
                userId: user.shortid,
                id: params.id,
                option,
                data,
                length: index,
                datagramId: option === 'add' ? '' : datagram.id,
                support,
                isSupport
            })
        }
    }

    return (
        <div className="con">
            <h3>APIs Box</h3>
            {box !== null &&
                <>
                    <h3>{box.title}</h3>
                   
                    {user.name !== box.creator && personal === null &&
                        <>
                            <h4>Join (Choose Role)</h4>
                        
                            <Select onChange={e => setDaten({...daten, role: e.target.value})}>
                                {roles.map(el => <option value={el}>{el}</option>)}
                            </Select>
                    
                            <Button onClick={() => onManageMembership('join')}>Join</Button>
                        </>
                    }
                    {personal !== null &&
                        <>
                            <h4>URL: {url}</h4>{process.env.SOME_API_URL}
                            <Typography>Property: {queryProperty ===  '' ? 'all Item' : queryProperty}</Typography>
                            <TextField value={totalLength} onChange={e => setTotalLength(parseInt(e.target.value))} placeholder='Enter number of items' />
                            <Button onClick={() => propertyLength > 1 && setPropertyLength(propertyLength - 1)}>-</Button>
                            <Typography>{propertyLength} properties required</Typography>
                            <Button onClick={() => propertyLength < box.properties.length && setPropertyLength(propertyLength + 1)}>+</Button>
                            <div className='invs'>
                                {box.properties.map(el => (
                                    <Card className='inv' onClick={() => queryProperty === el.property ? setQueryProperty('') : setQueryProperty(el.property)}>
                                        <CardContent>
                                            <Typography>{el.property}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Button onClick={onTestAPI}>Test API</Button>

                            {user.name !== box.creator && box.rating.find(el => el.name === user.name) === undefined &&
                                <>
                                    <h4>Estimate</h4>
                                    <div className='invs'>
                                        {crits.filter(el => rates.find(e => e.criterion === el) === undefined).map(el => (
                                            <Card className='inv' onClick={() => setRat({...rat, criterion: el})}>
                                                <CardContent>
                                                    <Typography>{el}</Typography>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                    <TextField value={rate} onChange={e => setRat({...rat, rate: parseInt(e.target.value)})} placeholder="Enter rate" />
                                    <Button onClick={onAddCr}>Add Criterion</Button>
                                    <TextareaAutosize value={review} onChange={e => setDaten({...daten, review: e.target.value})} placeholder='Enter review' minRows={3} />
                                    <Button onClick={onEst}>Estimate</Button>
                                </>
                            }

                            {personal.isAccepted === true &&
                                <>
                                    <h4>Add Datagram ({index}/{box.properties.length})</h4>
                                    {prop !== null &&
                                        <>
                                            <Typography>Enter {prop.property} ({prop.propertyType})</Typography>
                                            <TextField value={item} onChange={e => setItem(e.target.value)} placeholder='Enter value of datagram' />
                                            <Button onClick={onAddItem}>{index < box.properties.length - 1 ? 'Next' : 'Finish'}</Button>
                                            <Button onClick={() => onManageDatagram('add')}>Add</Button>
                                        </>
                                    }
                                </>
                            }

                            <h4>Datagrams</h4>
                            <div className='invs'>
                                {box.datagrams.map(el => (
                                    <Card className='inv' onClick={() => setDatagram(el)}>
                                        <CardContent>
                                            <Typography>{el.name}'s Datagram</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {datagram !== null &&
                                <>
                                    <h4>{datagram.name}'s Datagram</h4>
                                    {datagram.name !== user.name ?
                                        <>
                                            <Typography>Is Support?</Typography>
                                            <Checkbox value={isSupport} onChange={e => setIsSupport(e.target.checked)}></Checkbox>
                                            <Button onClick={() => setSupport(support + 1)}>{isSupport === true ? '+' : '-'}</Button>
                                            <Button onClick={() => onManageDatagram('support')}>{isSupport === true ?  'Like' : 'Hate'}</Button>
                                        </>
                                        :
                                        <Button onClick={() => onManageDatagram('delete')}>Delete</Button>
                                    }
                                </>
                            }
                        </>
                    }
                    {user.name === box.creator &&
                        <>
                            <h4>Members</h4>
                            <div className='invs'>
                                {box.members.filter(el => el.name !== user.name).map(el => (
                                    <Card className='inv' onClick={() => setMem(el)}>
                                        <CardContent>
                                            <Typography>{el.name}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {mem !== null &&
                                <>
                                    <h4>{mem.name}</h4>
                                    {mem.isAccepted === false && <Button onClick={() => onManageMembership('accept')}>Accept</Button>}
                                </>
                            }
                        </>
                    }
                </>
            }
        </div>
  );
}

export default Box