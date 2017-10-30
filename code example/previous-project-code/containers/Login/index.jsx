import './index.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { ActivityIndicator } from 'antd-mobile';
import { Link, hashHistory } from 'react-router'
import { Button } from 'antd-mobile'
import { Toast } from 'antd-mobile'

import { getLogin } from '../../fetch/login'
import { setToken } from '../../util/common'

import Captcha from './subpage/captcha'
class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.goLogin = this._goLogin.bind(this)
        this.state = {
            dxYzmText:'获取验证码',
            phone: '',
            yzm: '',
            loginLoading: false,
        }
    }
    render() {
        return (
            <div className="login">
                <div className="login_form">
                    <div className="clear-fix">
                        <div className="type float-left">手机号</div>
                        <div className="input_phone"><input type="tel" placeholder="请输入手机号" value={this.state.phone} onChange={v=>this.setState({phone:  v.target.value})} maxLength="11" /></div>
                    </div>
                    <div className="clear-fix">
                        <div className="type float-left">验证码</div>
                        <Captcha checkPhone={this.checkPhone.bind(this)} phone={this.state.phone} />
                        <div className="input_yzm"><input type="tel" placeholder="输入手机验证码" value={this.state.yzm} onChange={v=>this.setState({yzm:  v.target.value})} maxLength="6" /></div>
                    </div>
                </div>
                
                <Button className="btn" type="primary" onClick={this.goLogin}>下一步<ActivityIndicator animating={ this.state.loginLoading } /></Button>
            </div>
        )
    }

    componentDidMount(){

    }
    //验证手机号
    checkPhone(){
      if(this.state.phone === ''){
        return Toast.info('请输入手机号', 1.3, null, false), false;
      }else if(!/^1[345678]\d{9}$/.test(this.state.phone)){
        return Toast.info('手机号输入有误', 1.3, null, false), false;
      }else{
        return true
      }
    }
    _goLogin(){
        if(this.state.loginLoading)return false;
        if(!this.checkPhone())return false;
        if( this.state.yzm=='' )return Toast.info('请输入验证码', 1.3, null, false);

        this.setState({applyLoading: true})
        let phone = this.state.phone;
        let yzm = this.state.yzm;
        var result = getLogin(phone, yzm)
        result.then(data=>{
            console.log(data)
            this.setState({loginLoading: false})
            if(data.code != '1')return Toast.info(data.desc, 1.5, null, false);

            let cnickId = data.cnickId;
            let objToken = {
                token : data.accessToken,
                appid : data.appId
            }
            setToken(objToken)//登录完了 缓存token
            hashHistory.push('/user')
        }, (ex)=>{
            this.setState({loginLoading: false})
            Toast.info('服务器异常,请稍后再试', 1.5, null, false);
            if (__DEV__) {
                console.error('登录报错, ', ex.message)
            }
        })
    }
}

export default Login