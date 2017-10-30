import './style.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { ActivityIndicator, Picker, List, WhiteSpace, Button } from 'antd-mobile';
import { hashHistory } from 'react-router'

import { Link } from 'react-router'
import { Toast } from 'antd-mobile'
import Captcha from './captcha'
import { Layer, Prompt } from '../../../components/Layer'

import md5 from '../../../util/md5.min.js'

import { TOKEN } from '../../../config/localStoreKey'
import { getYzm, register, checkJump, checkWechat, bindWx } from '../../../fetch/home'
import { seasons } from '../../../static/option'
import { setToken } from '../../../util/common'



let source = '5014'
if(/i(os|phone|pad)/i.test(navigator.userAgent)){
  source = '6006'
}
let count = 60;
const CustomChildren = props => (
  <div onClick={props.onClick} className="money clear-fix"><img src={require('../img/arrow.png')} className="float-right"/>
    {
      props.extra != ''?
      props.extra.split(',').map((item)=>{
        return <em>{item}</em>
      })
      :props.children
    } 
  </div>
);
class Form extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.goApply = this._goApply.bind(this)
        this.check_pass = this._check_pass.bind(this)
        this.checkWx = this._checkWx.bind(this)
        this.goLogin = this._goLogin.bind(this)
        this.wxbind = this._wxbind.bind(this)
        this.state = {
            mValue:'',
            phone:'',
            yzm:'',
            name:'',
            money:'',
            time:'',
            applyLoading: false,
        }
    }
    
    render() {
        let userinfo = this.props.userinfo
        return (
            <div className="home_form">
                <div className="inputs">
                    {
                      // .replace(/[^\u4E00-\u9FA5]/g,'')
                      //已登录的 手机号 验证码 选项不用填写
                      !userinfo.token? this.loginDom(): null
                    }
                    <div className="name line"><input type="text" placeholder="请输入姓名" value={this.state.name} onInput={v=>this.setState({name:v.target.value})} maxLength="10" /></div>
                    <Picker data={seasons} cols={2} title="选择金额和期限" extra="" cascade={false} value={this.state.mValue}
                      onChange={v=>this.setState({ mValue: v, money:v[0], time:v[1] })}
                    >
                      <CustomChildren>请选择贷款金额和期限</CustomChildren>
                    </Picker>
                </div>
                <Button className="btn" type="primary" onClick={this.goApply}>立即申请<ActivityIndicator animating={ this.state.applyLoading } /></Button>
                
            </div>
        )
    }
    componentDidMount(){

    }
    
    loginDom(){
      return (
        <div>
          <div className="tel line"><input type="text" pattern="[0-9]*" placeholder="请输入手机号" value={this.state.phone} onChange={v=>this.setState({phone:  v.target.value})} maxLength="11"/></div>
          <div className="dx line clear-fix">
            <input type="tel" placeholder="输入短信验证码" className="float-left" value={this.state.yzm} onChange={v=>this.setState({yzm:  v.target.value})} maxLength="6"/>
            <Captcha checkPhone={this.checkPhone.bind(this)} phone={this.state.phone} />
          </div>
        </div>
      )
    }

    _check_pass(){
      let result = checkJump();
      result.then(da=>{
          this.setState({applyLoading: false})
          if(da.code =='9009' || da.code =='9007'){//用户没登录 或者已修改密码
            Toast.info('登录过期，请重新登录', 1.5, ()=>{
              localStorage.removeItem(TOKEN)
              location.reload();
            });
            return false;
          }
          if(da.code != '1')return Toast.info(da.desc, 1.5, null, false);
          if(da.data.success >= 1){
            return Layer.warning('您已成功提交过方案，不能重复提交|_|如之前的方案还未审核，可取消后重新申请', '确定', ()=>{});
          }
          if(da.data.error >= 3){
            return Layer.warning('您的条件暂时无法申请贷款|_|请30天后再来尝试', '确定', ()=>{});
          }
          
          hashHistory.push({
            pathname:'/info',
            query:{
              cname: this.state.name,
              imoney: this.state.money,
              iusetimes: this.state.time
            }
          })


      }, (ex)=>{
          this.setState({applyLoading: false})
          Toast.info('服务器异常,请稍后再试', 1.5, null, false);
          if (__DEV__) {
                console.error('检查该用户 订单数 和失败次数 如果满足条件 接口报错, ', ex.message)
          }
      })
    }


    _goLogin(){
        let result = register( this.state.phone, this.state.yzm)
          result.then(da=>{
            if(da.code != '1'){
              this.setState({applyLoading: false})
              Toast.info(da.desc, 1.5, null, false);
            }else{
              let ui = {
                token: da.accessToken,
                appid: da.appId
              }
              setToken(ui)//缓存登录信息
              //帮客户端登录
              try{
                if(/i(os|phone)/i.test(navigator.userAgent)){
                  // 之前因为帮客户端登录 方法会导致 客户端刷新页面 所有不帮他们登录
                  // WebViewJavascriptBridge.callHandler("jsSetToken",ui);
                }else{
                  window.HuishuakaAndroid.jsSetToken(ui.appid, ui.token)
                }
              }catch(e){}
              this.check_pass()

            }
          }, (ex)=>{
            this.setState({applyLoading: false})
            Toast.info('服务器异常,请稍后再试', 1.5, null, false);
            if (__DEV__) {
                  console.error('获取验证码报错, ', ex.message)
            }
          })
    }
    parseXml(xml) {
        var xmldom =  null;
        if (typeof DOMParser != "undefined") {
            xmldom = (new DOMParser()).parseFromString(xml, "text/xml");
            var errors = xmldom.getElementsByTagName("parsererror");
            if(errors.length) {
                throw new Error("XML parsing error:" + errors[0].textContent);
            }
        } else if(document.implementation.hasFeature("LS", "3.0")) {
            var implementation =  document.implementation;
            var parser = implementaion.createLSParser(implementation.MODE_SYNCHRONOUS, null);
            var input = implementation.createLSInput();
            input.stringData = xml;
            xmldom = parser.parse(input);
        } else if(typeof ActiveXObject != "undefined") {
            xmldom = createDocument();
            xmldom.loadXML(xml);
            if (xmldom.parseError != 0) {
                throw new Error("XML parsing error:" + xmldom.parseError.reason);
            }
        } else {
            throw new Error("No XML parser available.");
        }
        return xmldom;
    }
    _checkWx(){
      let promise = new Promise((resolve, reject)=>{
          let result = checkWechat();
          result.then(da=>{
            var R = da.getElementsByTagName("Resp")[0]
	        	var code = R.getAttribute('code')
	        	var desc = R.getAttribute('desc')
            if(code == '1'){//已经绑定手机号 
              resolve()
            }else{//wx快登(没有绑定手机号)！！！这里有个bug  code ！= 1 的情况不仅仅只是没有绑定手机号
              reject()
            }
          }, (ex)=>{
              this.setState({applyLoading: false})
              Toast.info('服务器异常,请稍后再试', 1.5, null, false);
              if (__DEV__) {
                    console.error('检测是否微信快登报错, ', ex.message)
              }
          })
      })
      return promise
    }
    _wxbind(){
      let promise = new Promise((resolve)=>{
         let result = bindWx(this.state.phone, this.state.yzm);
         result.then(da=>{
            let R = da.getElementsByTagName('Resp')[0];
            let code = R.getAttribute('code');
            let desc = R.getAttribute('desc');
            if(code != '1'){
              this.setState({applyLoading: false})
              return Toast.info(desc);
            }
            resolve()
         }, (ex)=>{
              this.setState({applyLoading: false})
              Toast.info('服务器异常,请稍后再试', 1.5, null, false);
              if (__DEV__) {
                    console.error('微信绑定手机号, ', ex.message)
              }
         })
      })
      return promise
    }

    //点击提交
    _goApply(){
      
      if(this.state.applyLoading)return false;
      let userinfo = this.props.userinfo
      if( !userinfo.token ){
        if(!this.checkPhone())return false;
        if(this.state.yzm === '')return Toast.info('请输入验证码', 1.3, null, false);
      }
			if(this.state.name === '')return Toast.info('请输入姓名', 1.3, null, false);
			if(this.state.money === '')return Toast.info('请选择贷款金额和期限', 1.3, null, false);

      this.setState({applyLoading: true})
      if( !userinfo.token ){//没有登录
          this.goLogin();
      }else{//已登录
          this.check_pass()

          //线上环境 把下面放开
        //  let result = this.checkWx();//先检测是不是微信快登进来的
        //  result.then(this.check_pass,//不是微信快登 
        //  this.wxbind)//微信快登进来 绑定手机号
        //  .then(this.check_pass)
      }
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
    
    
}

export default Form
