

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { ActivityIndicator } from 'antd-mobile';
import { Toast } from 'antd-mobile'
import { getYzm } from '../../../fetch/login'

let count = 60;

class Captcha extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.postYzm = this._postYzm.bind(this)
        this.state = {
            getYzmTxt:'获取验证码',
            yzmLoading: false,
        }
    }
    render() {
        return (
            <div className="yzm float-right" onClick={this.postYzm}>{this.state.getYzmTxt} <ActivityIndicator animating={ this.state.yzmLoading } /></div>
        )
    }

    //倒计时
    changeYzmTxt(){
      count = 60;
      this.setState({getYzmTxt:count+'s'})
      let yzmInterval = setInterval(()=>{
        if(count-=1, count < 0){
          clearInterval(yzmInterval)
          this.setState({getYzmTxt:'重新发送'})
          return ;
        }
        this.setState({getYzmTxt: count+'s'})
      }, 1e3)
    }
    //获取验证码
    _postYzm(){
      if(this.state.yzmLoading)return false;
      if(!this.props.checkPhone())return false;
      if( this.state.getYzmTxt != '重新发送' && this.state.getYzmTxt != '获取验证码')return;//限制60s 之内不能连续点击
      this.setState({yzmLoading: true})
      let uid = this.props.phone;
      
      var result = getYzm(uid)
      result.then(data=>{
        console.log(data)
        this.setState({yzmLoading: false})
        if(data.code != '1')return Toast.info(data.desc, 1.5, null, false);
        this.changeYzmTxt()
      }, (ex)=>{
        this.setState({yzmLoading: false})
        Toast.info('服务器异常,请稍后再试', 1.5, null, false);
        if (__DEV__) {
              console.error('获取验证码报错, ', ex.message)
        }
      })


      
      
    }
}

export default Captcha