import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import App from '../containers'
import Home from '../containers/Home'
import Info from '../containers/Info'
import Result from '../containers/Result'
import Login from '../containers/Login'
import User from '../containers/User'
import Detail from '../containers/Detail'
import City from '../containers/city'
import Area from '../containers/city/area'
import Agree from '../containers/Agreement'

import NotFound from '../containers/404'


class RouterMap extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path='/' component={App}>
                    <IndexRoute component={Home}/>
                    <Route path='/index' component={Home}/>
                    <Route path='/info' component={Info}>
                        <Route path='/city/:id' component={City}/>
                        <Route path='/area/:id' component={Area}/>
                        <Route path='/agree' component={Agree}/>
                    </Route>
                    <Route path='/result' component={Result}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/user' component={User}>
                        <Route path='/detail/:id' component={Detail}/>
                    </Route>
                    <Route path='*' component={Home}/>
                </Route>
            </Router>
        )
    }
    componentWillMount(){
    }
}

export default RouterMap
