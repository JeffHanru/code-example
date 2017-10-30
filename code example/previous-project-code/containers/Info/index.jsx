

import './index.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { connect } from 'react-redux'

import Warning from './subpage/warning'
// import Option from './subpage/option'


import { Modal, Button, Toast, ActivityIndicator, Icon } from 'antd-mobile';
const alert = Modal.alert;
import { hashHistory, Link } from 'react-router'
import Local from '../../util/localStore'
import { INFO_ITEMALL, SWITCH_RECOVER_DATA } from '../../config/localStoreKey'
import {OptionDom, OptionData} from '../../static/option'
import Opt from '../../components/Option/'
import Buttom from './subpage/buttom'
import { refer, update, stamp, sms, getArea } from '../../fetch/info'
import { getToken } from '../../util/common'

import { Layer } from '../../components/Layer'


let photoItem = [
    {type:'房产证', url:require('./img/1.png'), c:"fangImg"},
    {type:'车辆行驶证', url:require('./img/2.png'), c:"cheImg"},
    {type:'寿险保单', url:require('./img/3.png'), c:"rsImg"},
    {type:'微信微粒贷借据', url:require('./img/4.png'), c:"wldImg"},
    {type:'营业执照', url:require('./img/yyzz.png'), c:"zzImg"},

]
let setp1Data = '';
let isHSKApp = false;//是否是android 客户端 标识 用来判断上传图片 是否用 客户端的方法
if(/android/i.test(navigator.userAgent)){
    if(typeof HuishuakaAndroid != 'undefined'){
        if(typeof HuishuakaAndroid.jsCallPicImgLibWithKey != 'undefined'){
            isHSKApp = true;
        }
    }
}
let cityData = '';
let areaData = '';
class Info extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.setItemData = this._setItemData.bind(this)
        this.cacheData = this._cacheData.bind(this)
        this.commit = this._commit.bind(this)
        this.selFile = this._selFile.bind(this)
        this.gainSetp2Data = this._gainSetp2Data.bind(this)
        this.state = {
            animating:false,
            referLoading:false, 
            agree: true,

            idcard:'',//身份证号
            hyzk:'',//婚姻
            city: '',//城市 阿里
            area: '',//区县 "札达县"
            bdhk:'',//户口
            xyqk:'',//信用

            zysf:'',//职业
            cworkorg:'',//工作单位
            bankwage:'',//月收入银行
            wage:'',//月收入现金
            gl:'',//工龄
            watercourse:'',//月流水
            yyzz:'',//营业执照
            jynx:'',//经营年限
            gjj:'',//公积金
            sb:'',//社保

            fang:'',//房
            che:'',//车
            rsbx:'',//人寿
            wld:'',//微粒贷

            fangImg: '',//房产凭证
            cheImg: '',//车凭证
            rsImg: '',//人寿凭证
            wldImg: '',//微粒贷凭证
            zzImg:''//营业执照

        }
    }
    render() {
        this.gainSetp2Data()
        return (
            <div>
                {
                    this.props.children ? this.props.children :
                    <div>
                        <Warning />
                        <div className="option">
                            {/*【基本信息】*/}
                            <div className="opt">
                                <div className="title">基本信息</div>
                                <div className="content">
                                    <div className="opt_item">身份证号<input type="text" placeholder="请输入" maxLength='22' value={this.state.idcard} onChange={v=>{ this.setState({idcard:  v.target.value}); this.cacheData() }} /></div>
                                    <Opt c="婚姻状况" t={'hyzk'} data={OptionData['hyzk']} click={this.setItemData} value={this.state.hyzk} />
                                    
                                    <div className="opt_item" onClick={()=>{  
                                        hashHistory.push({ pathname:'/city/'+(!cityData?'0': cityData.code)})
                                    }} ><div className="opt_left">贷款城市</div><div className={"opt_right "+(cityData.code?'blue':null) }>{cityData.code?cityData.name:'请选择'}<img src={require('./img/arrow.png')} /></div></div>
                                    <div className="opt_item" onClick={this.selArea.bind(this)} ><div className="opt_left">贷款区县</div><div className={"opt_right "+(areaData.code?'blue':null) }>{areaData.code?areaData.name:'请选择'}<img src={require('./img/arrow.png')} /></div></div>
                                    
                                    <Opt c="是否本地户口(工作城市)" t={'bdhk'} data={OptionData['bdhk']} click={this.setItemData} value={this.state.bdhk} />
                                    <Opt c="个人信用情况" t={'xyqk'} data={OptionData['xyqk']} click={this.setItemData} value={this.state.xyqk} />
                                </div>
                            </div>
                            {/*【工作信息】*/}
                            <div className="opt">
                                <div className="title">工作信息</div>
                                <div className="content">
                                    <Opt c="职业身份" t={'zysf'} data={OptionData['zysf']} click={this.setItemData} value={this.state.zysf}/>
                                    

                                    <div className="opt_item">工作单位<input type="text" placeholder="请输入" maxLength="20" value={this.state.cworkorg} onChange={v=>{ this.setState({cworkorg:  v.target.value}); this.cacheData() }}  /></div>
                                    
                                    {
                                        this.state.zysf != '1'  ?
                                            <div>
                                                <div className="opt_item">月收入<span>(银行代发工资)</span><input type="text" pattern="[0-9]*" placeholder="请输入" maxLength="7" value={this.state.bankwage} onChange={v=>{ this.setState({bankwage:  v.target.value}); this.cacheData() }} /></div>
                                                <div className="opt_item">月收入<span>(财务转账或现金)</span><input type="text" pattern="[0-9]*" placeholder="请输入" maxLength="7" value={this.state.wage} onChange={v=>{ this.setState({wage:  v.target.value}); this.cacheData() }} /></div>
                                                <Opt c="当前单位工龄" t={'gl'} data={OptionData['gl']} click={this.setItemData} value={this.state.gl} />
                                            </div>
                                        :
                                            <div>
                                                <div className="opt_item">月均经营流水<input type="text" pattern="[0-9]*" placeholder="请输入" maxLength="8" value={this.state.watercourse} onChange={v=>{ this.setState({watercourse:  v.target.value}); this.cacheData() }} />万元</div>
                                                <Opt c="是否有营业执照" t={'yyzz'} data={OptionData['yyzz']} click={this.setItemData} value={this.state.yyzz} />
                                                <Opt c="经营年限" t={'jynx'} data={OptionData['jynx']} click={this.setItemData} value={this.state.jynx} />
                                            </div>
                                    }
                                    

                                    
                                    <Opt c="是否有本地公积金" t={'gjj'} data={OptionData['gjj']} click={this.setItemData} value={this.state.gjj} />
                                    <Opt c="是否有本地社保" t={'sb'} data={OptionData['sb']} click={this.setItemData} value={this.state.sb} />
                                </div>
                            </div>
                            {/*【资产信息】*/}
                            <div className="opt">
                                <div className="title">资产信息<span>{setp1Data.imoney >2 ?null: '*选填,易审核通过'}</span></div>
                                <div className="content">
                                    <Opt c="名下本地房产" t={'fang'} data={OptionData['fang']} click={this.setItemData} value={this.state.fang} />
                                    <Opt c="名下本地车辆" t={'che'} data={OptionData['che']} click={this.setItemData} value={this.state.che} />
                                    <Opt c="是否有人寿保险" t={'rsbx'} data={OptionData['rsbx']} click={this.setItemData} value={this.state.rsbx} />
                                    <Opt c="微信微粒贷额度" t={'wld'} data={OptionData['wld']} click={this.setItemData} value={this.state.wld} />
                                </div>
                            </div>
                            {/*【凭证】*/}
                            <div className="photo">
                                <div className="title">资产凭证<span> *选填,上传后成功率更高</span></div>
                                <ul className="content">
                                    {
                                        photoItem.map((item, index)=>{
                                            return (
                                                <div>
                                                    {
                                                        true?
                                                        (
                                                        <li key={index} onClick={this.openAppC.bind(this, item.c)}>
                                                            {
                                                                //android app进来的 禁用 input 改用app的上传图片方法
                                                                !isHSKApp?<input type="file" accept="image/*" onChange={event=>this.selFile(event, item.c)}/>:null
                                                            }
                                                            {
                                                                this.state[item.c] != ''?<div className="divOn"><img src={this.state[item.c]}/><em onClick={()=>{this.setState({[item.c]: ''})}}></em></div>:
                                                                <div><img src={item.url} />{item.type}</div>
                                                            }
                                                        </li>
                                                        )
                                                        :null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </ul>
                                <div className="ts">*资产凭证为房产证、行驶证、寿险保单等照片</div>
                            </div>
                            <div className="agree">
                                <div className="checkbox" onClick={()=>{ this.setState({agree: !this.state.agree}) }}>{this.state.agree? <img src={require('./img/6.png')} /> :null}</div>
                                <div>同意<Link to={'/agree'}><cite>《有鱼贷款服务协议》</cite></Link></div>
                            </div>
                            <Buttom click={this.commit} loading={ this.state.referLoading }/>
                            <ActivityIndicator toast text={ '图片上传中' } animating={ this.state.animating } />
                        </div>
                        
                        
                    </div>
                }
            </div>
        )
    }
    componentWillMount(){
        

        let query = this.props.location.query;//获取上一个页面的 姓名 金额 期限
        setp1Data = {
            cname: query.cname,
            imoney: query.imoney,
            iusetimes: query.iusetimes,
        }
        if(!__DEV__){
            if(!setp1Data.cname || !setp1Data.imoney || !setp1Data.iusetimes){//没带过来的 再带一次
                hashHistory.replace('/')
                return false; 
            }
        }
        
        stamp( query.cname, query.imoney, query.iusetimes);/*有鱼注册统计*/

        window.onReceivePhotoWithKey = (key, base64)=>{// 图片上传 回调函数 提供给客户端用
            var url = 'data:image/png;base64,'+base64;
            this.readyUpdateImg(url, key)
        }
    }
    componentDidMount(){
            // Layer.warning('以下填写的资料将影响到您的|_|贷款成功率，请如实填写！', '知道了', ()=>{})

            let srd = Local.getItem(SWITCH_RECOVER_DATA) || '';
            if( srd != 'true' ){//如果点过不再提示 就不检测缓存
                let result = this.isCache();//检测是否有缓存
                result.then(()=>{//有->覆盖
                    this.doCover();
                })
            }
    }
    componentWillReceiveProps(nextProps){

        cityData = nextProps.cityData.city;
        areaData = nextProps.cityData.area;

        this.setState({
            city:nextProps.cityData.city,
            area:nextProps.cityData.area
        })
    }
    componentDidUpdate(){


    }
    _gainSetp2Data(){
        let query = this.props.location.query;//获取上一个页面的 姓名 金额 期限
        let queryCity = query.city||'';
        if( queryCity != '' ){//
            let city = JSON.parse(query.city);
            if(this.state.city.code != city.code){
                document.body.scrollTop = 0
                this.setState({
                    city: city,
                })
            }
        }
       
    }
    //将缓存数据渲染出来
    doCover(){
        let data = Local.getItem(INFO_ITEMALL, !0);
        cityData = data.city;
        areaData = data.area;
        this.setState(data)
    }
    //查看缓存里面是否有数据
    isCache(){
            let promise = new Promise((resolve)=>{
                let gainCache = Local.getItem(INFO_ITEMALL, !0);
                let count = 0
                for(let item in gainCache){
                    gainCache[item] != '' && (count+=1);
                }
                count != 0 && resolve();
            })
            return promise
    }
    //选择区县
    selArea(){
        let cityData = this.props.cityData.city || '';
        if(!cityData)return Toast.info('请先选择城市', 1, null, false);
        hashHistory.push({ pathname:'/area/'+cityData.code})
    }

    //选中选项
    _setItemData(t, v){
            let va = v instanceof Array? v[0]: v;
            this.setState({[t]: va}, this.cacheData)
        
    }
    //每次改变数据的时候 缓存到本地
    _cacheData(){
            Local.setItem(INFO_ITEMALL, this.state)
    }


    //提交申请
    _commit(){
            if ( this.state.referLoading )return false;
            if(!this.checkItem())return false;//检测是否都填了
            if( !this.state.agree ){
                Layer.error('您已阅读并同意|_|《有鱼贷款服务协议》？', '取消|_|同意', ()=>{
                    this.setState({agree: true})
                })
                return false;
            }
            this.setState({referLoading: true})
            let param = $.extend({}, this.state, setp1Data)
            // let param = Object.assign({}, this.state, setp1Data)
            let result = refer(param)
            result.then(da=>{
                this.setState({referLoading: false})
                if(da.code == '0'){

                    Layer.error('根据评估|_|您所填写的资料不符合贷款资质', '重新申请|_|更改机构', ()=>{
                        hashHistory.replace({
                            pathname:'/result',
                            query:{
                                city: this.state.city.code,
                                money: setp1Data.imoney
                            }
                        })
                    }, ()=>{
                        hashHistory.push('/')
                    })
                    return false;
                }
                if(da.code != '1')return Toast.info(da.desc, 1.5, false)
                Layer.success('您的贷款申请已提交成功！|_|稍后我们的客服人员将会跟您联系|_|确认，请保持手机畅通。', '确定', ()=>{
                    hashHistory.replace({
                        pathname:'/result',
                        query:{
                            city: this.state.city.code,
                            money: setp1Data.imoney
                        }
                    })
                    sms();//发短信
                })
            }, (ex)=>{
                this.setState({referLoading: false})
                Toast.info('服务器异常,请稍后再试', 1.5, null, false);
                if (__DEV__) {
                    console.error('第二步提交申请报错, ', ex.message)
                }
            })

    }

    //提交申请前 检测是否满足
    checkItem(){
            let t = this.state;
            let idcard = t.idcard.replace(/ /g, '');
            //基本资料
            if(idcard === '')return Toast.info('请输入身份证号', 1.5, null, false), !1;
            if(idcard.length < 15)return Toast.info('请输入真实的身份证号', 1.5, null, false), !1;
            if(t.hyzk === '')return Toast.info('请选择婚姻状况', 1.5, null, false), !1;
            if(!t.city.code)return Toast.info('请选择城市', 1.5, null, false);
            if(t.bdhk === '')return Toast.info('请选择是否本地户口', 1.5, null, false), !1;
            if(t.xyqk === '')return Toast.info('请选择个人信用情况', 1.5, null, false), !1;
            //工作
            if(t.zysf === '')return Toast.info('请选择职业身份', 1.5, null, false), !1;
            if(t.cworkorg === '')return Toast.info('请输入工作单位', 1.5, null, false), !1;
            if(t.zysf != '1'){
                if(t.bankwage === '' && t.wage === '')return Toast.info('请输入月收入', 1.5, null, false), !1;
                if(t.gl === '')return Toast.info('请选择工龄', 1.5, null, false), !1;
            }else{
                if(t.watercourse === '')return Toast.info('请输入月经营流水', 1.5, null, false), !1;
                if(t.yyzz === '')return Toast.info('请选择是否有营业执照', 1.5, null, false), !1;
                if(t.jynx === '')return Toast.info('请选择经营年限', 1.5, null, false), !1;
            }
            
            if(t.gjj === '')return Toast.info('请选择是否有本地公积金', 1.5, null, false), !1;
            if(t.sb === '')return Toast.info('请选择是否有本地社保', 1.5, null, false), !1;
            //资产
            if(setp1Data.imoney > 2){
                if(t.fang === '')return Toast.info('请选择名下本地房产', 1.5, null, false), !1;
                if(t.che === '')return Toast.info('请选择名下本地车辆', 1.5, null, false);
                if(t.rsbx === '')return Toast.info('请选择是否有人寿保险', 1.5, null, false), !1;
                if(t.wld === '')return Toast.info('请选择微信微粒贷额度', 1.5, null, false), !1;
            }
            return true;
            //凭证
            /*
            chouseproof: '',//房产凭证
            ccarproof: '',//车凭证
            cinsuranceproof: '',//人寿凭证
            cweilidaiproof: '',//微粒贷凭证
            */
    }







    //打开客户端 调用 本地图片库
    openAppC(type){
        if(isHSKApp){
            window.HuishuakaAndroid.jsCallPicImgLibWithKey(type);
        }
    }
   
    //上传图片之前 将图片压缩
    toBase64(file, ratio){
        let promise = new Promise((resolve, reject)=>{
				let url = typeof file =='string'?file : window.URL.createObjectURL(file);
                let canvas = document.createElement('CANVAS'),
		        ctx = canvas.getContext('2d'),
		        img = new Image();
                img.onload = ()=>{
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img,0,0);
                    let dataURL = canvas.toDataURL("image/jpeg", ratio);//以上是 将图片通过canvas 转出base64url 格式

                    let base64 = dataURL.split(',')[1]
                    let data=window.atob(base64);
                    let ia = new Uint8Array(data.length);
                    for (let i = 0; i < data.length; i++) {
                        ia[i] = data.charCodeAt(i);
                    };
                    let blob = new Blob([ia], {type:"image/jpeg"});// 以上是将 base64 图片转成 接口需要的 blob 数据流
                    resolve(blob)
                    canvas = null;
                };
                img.onError = ()=>{reject(); Toast.info('获取图片失败,请重试', 1.5, false) };
                img.src = url;
        })
        return promise;
    }
    //上传图片
    updateImg(f, rt){
        let promise = new Promise((resolve, reject)=>{
                let result = this.toBase64(f, rt)//将file 格式转成 blod 格式
                result.then(fileUrl=>{



                    var formdata=new FormData();
                    let ui = getToken();
                    formdata.append ("accessToken" , ui.token);
                    formdata.append ("appId" , ui.appid);
                    formdata.append ("file" , fileUrl);
                    $.ajax({
                        url:"/notcontrol/loan/uploadProof.go",
                        method: "POST",
                        data: formdata,
                        dataType:'JSON',
                        contentType : false,
                        processData : false,
                        crossDomain:false,
                        success:function(da){
                            Toast.info(da.desc, 1.5, false);
                            if( da.code == '1'){
                                let url = da.data.url;
                                resolve(url)
                            }else{
                                reject()
                            }
                        },
                        error: function(){
                            reject()
                        }
                    });

                }, reject)
        })
        return promise
    }
    //input 选取图片
    _selFile(e, type){
            let file = e.target.files[0]
            let ua = window.navigator.userAgent;
            if (ua.indexOf("MSIE") == '-1'){
                if(file.size){
                    if(file.size/1024/1024 > 5)return Toast.info('图片过大,上传限制不得超过5兆', 1.5, false);
                }
            }
            this.setState({animating: true})
            this.readyUpdateImg(file, type)
    }
    //准备上传图片
    readyUpdateImg(file, type){
            let ua = window.navigator.userAgent;
            let ratio = /android/i.test(ua)? 0.5:0.3//压缩比率


            let result = this.updateImg(file, ratio);//上传图片  (传入图片 , 压缩比率 )
            result.then((url)=>{//上传成功
                this.setState({animating: false})
                this.setState({[type]: url})
            }, ()=>{//上传失败
                this.setState({animating: false})
            })
    }


}


// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
        cityData: state.cityData
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Info)