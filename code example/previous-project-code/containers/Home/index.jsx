

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Me from '../../components/Me'
import Banner from './subpage/banner'
import Form from './subpage/form'
import Text from './subpage/text'

import { setToken, getToken } from '../../util/common'
import Session from '../../util/sessionStore'
import { AGENTID, SID } from '../../config/localStoreKey'

import {Layer} from '../../components/Layer'
class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        let userinfo = getToken()
        return (
            <div>
                <Banner />
                <Form userinfo={ userinfo } />
                <Text />
            </div>
        )
    }
    componentWillMount(){


        setToken()//同步一下客户端的登录信息
        
        let tuiguang = this.GetQueryString('tuiguang') ||'';
        let sid = this.GetQueryString('sid') || '';
        if(tuiguang != ''){
            Session.setItem(AGENTID, tuiguang)
        }
        if(sid != ''){
            Session.setItem(SID, sid)
        }
        
    }
    GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURIComponent(r[2]); return null;
    }
}

export default Home


