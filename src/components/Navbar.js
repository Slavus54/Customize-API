import React, {useState, useEffect} from 'react';
import {Checkbox, TextField, Typography, Select, Card, CardContent, CardActionArea} from '@material-ui/core'
import {Button} from 'uikit-react'
import Cookies from 'js-cookie'
import {Route, Link} from 'wouter'
import Register from './Register'
import Login from './Login'
import CreateBox from './CreateBox'
import Boxes from './Boxes'
import Box from './Box'
import MyBoxes from './MyBoxes'
import Clients from './Clients'

function Navbar() {
    const [user, setUser] = useState(null)
    const [routes] = useState([
        {
            label: 'Clients',
            url: '/',
            expression: '>= 0'
        },
        {
            label: 'Register',
            url: '/register',
            expression: '=== 0'
        },
        {
            label: 'Login',
            url: '/login',
            expression: '< 1'
        },
        {
            label: 'APIs Boxes',
            url: '/boxes',
            expression: '=== 2'
        },
        {
            label: 'Create API',
            url: '/create-box',
            expression: '=== 2'
        },
        {
            label: 'Own APIs',
            url: '/my-boxes',
            expression: '=== 2'
        }
    ])
    const [status, setStatus] = useState(0)

    useEffect(() => {
        let data = Cookies.get('client')

        if (data === null) {
            setStatus(1)
        } else if (data !== undefined) {
            setUser(JSON.parse(data))
            setStatus(2) 
        }
    }, [])

    return (
        <div className="con">
            <div className='invs'>
                {routes.filter(el => eval(`${status}${el.expression}`) === true).map(el => (
                    <Card className='inv'>
                        <CardContent>
                            <Link href={el.url}>{el.label}</Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <Route path='/create-box' component={CreateBox} />
            <Route path='/boxes' component={Boxes} />
            <Route path='/box/:id' component={Box} />
            <Route path='/my-boxes' component={MyBoxes} />
            <Route path='/' component={Clients} />
        </div>
  );
}

export default Navbar
