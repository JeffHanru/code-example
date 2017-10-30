import './style.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Modal, Button, Toast, ActivityIndicator, Icon } from 'antd-mobile';
const alert = Modal.alert;
import { hashHistory } from 'react-router'
import Local from '../../../util/localStore'
import { INFO_ITEMALL, SWITCH_RECOVER_DATA } from '../../../config/localStoreKey'
import {OptionDom, OptionData} from '../../../static/option'
import Opt from '../../../components/Option/'
import Buttom from './buttom'
import { refer, update } from '../../../fetch/info'
let photoItem = [
    {type:'房产证', url:require('../img/1.png'), c:"fangImg"},
    {type:'车辆行驶证', url:require('../img/2.png'), c:"cheImg"},
    {type:'寿险保单', url:require('../img/3.png'), c:"rsImg"},
    {type:'微信微粒贷借据', url:require('../img/4.png'), c:"wldImg"},

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
class Option extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.setItemData = this._setItemData.bind(this)
        this.cacheData = this._cacheData.bind(this)
        this.commit = this._commit.bind(this)
        this.selFile = this._selFile.bind(this)
        this.state = {
            animating:false,
            referLoading:false,
            idcard:'421125199110240017',//身份证号
            hyzk:'',//婚姻
            city:'542500',//城市 阿里
            area:'542522',//区县 "札达县"
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

        }
    }



    render() {
        // Toast.info(this.state['idcard'], 1, false)
        return (
            <div className="option">
                {/*【基本信息】*/}
                <div className="opt">
                    <div className="title">基本信息</div>
                    <div className="content">
                        <div className="opt_item">身份证号<input type="text" placeholder="请输入" maxLength='22' value={this.state.idcard} onChange={v=>{ this.setState({idcard:  v.target.value}); this.cacheData() }} /></div>
                        <Opt c="婚姻状况" t={'hyzk'} data={OptionData['hyzk']} click={this.setItemData} value={this.state.hyzk} />
                        <div className="opt_item" onClick={()=>{
                            hashHistory.push({
                        pathname:'/city/3',
                        })  }} ><div className="opt_left">贷款城市</div><div className="opt_right">请选择<img src={require('../img/arrow.png')} /></div></div>
                        <div className="opt_item"><div className="opt_left">贷款区县</div><div className="opt_right">请选择<img src={require('../img/arrow.png')} /></div></div>
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
                        <Opt c="是否有人寿保险&备注" t={'rsbx'} data={OptionData['rsbx']} click={this.setItemData} value={this.state.rsbx} />
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
                                            <li key={index} style={this.renderImg(item.c)} onClick={this.openAppC.bind(this, item.c)}>
                                                {
                                                    //android app进来的 禁用 input 改用app的上传图片方法
                                                    !isHSKApp?<input type="file" accept="image/*" onChange={event=>this.selFile(event, item.c)}/>:null
                                                }
                                                {
                                                    this.state[item.c] != ''?<em onClick={()=>{this.setState({[item.c]: ''})}}></em>:
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
                    <div className="checkbox"><img src={require('../img/6.png')} /></div>
                    <div>同意<cite>《有鱼贷款服务协议》</cite></div>
                </div>
                <Buttom click={this.commit} loading={ this.state.referLoading }/>
                <ActivityIndicator toast text={ '图片上传中' } animating={ this.state.animating } />
            </div>
        )
    }
    componentWillMount(){
        setp1Data = this.props.setp1//获取上一个页面的 姓名 金额 期限

        window.onReceivePhoto = (key, base64)=>{// 图片上传 回调函数 提供给客户端用
            var url = 'data:image/png;base64,'+base64;
            this.readyUpdateImg(url, key)
        }
    }
    componentDidMount(){






            let srd = Local.getItem(SWITCH_RECOVER_DATA) || '';
            if( srd != 'true' ){//如果点过不再提示 就不检测缓存
                let result = this.isCache();//检测是否有缓存
                result.then(this.askCover)//有->询问覆盖
                .then(()=>{//需要->帮恢复
                    Toast.info('已恢复', 1, false);
                    this.doCover();
                }, ()=>Local.setItem(SWITCH_RECOVER_DATA, true))//不再提示->记个标识
            }
    }

    componentDidUpdate(){

    }
    //打开客户端 调用 本地图片库
    openAppC(type){
        if(isHSKApp){
            // window.HuishuakaAndroid.jsCallPicImgLibWithKey(item.c);
            this.setState({ animating: true  })
            setTimeout(()=>{//不管客户端有木有返回 5s 后取消遮罩
                this.setState({ animating: false })
            }, 5e3)
        }
    }
    //上传图片成功 将接口返回的图片地址 渲染出来
    renderImg(type){
        let url = this.state[type];
        if(url != ''){
            return {
                backgroundImage:'url('+url+')',
                backgroundSize:'100% 100%',
                backgroundPosition: 'center'
            }
        }return null;
    }
    //上传图片之前 将图片压缩
    toBase64(file, ratio){
        let promise = new Promise((resolve, reject)=>{
				let url = window.URL.createObjectURL(file);
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
                    let result1 = update(fileUrl);
                    result1.then((da)=>{
                        Toast.info(da.desc, 1.5, false);
                        if( da.code == '1'){
                            let url1 = 'http://www.huishuaka.com/5/yydk/new/app/containers/Home/img/3aUoV5X.png';
                            let url = da.data.url || url1;
                            resolve(url)
                        }else{
                            reject()
                        }
                    }, (ex)=>{
                        Toast.info('服务器异常,请稍后再试', 1.5, null, false);
                        if (__DEV__) {
                            console.error('上传图片接口报错, ', ex.message)
                        }
                        reject()
                    })
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
    //将缓存数据渲染出来
    doCover(){
            this.setState(Local.getItem(INFO_ITEMALL, !0))
    }
    //查看缓存里面是否有数据
    isCache(){
            let promise = new Promise((resolve)=>{
                let gainCache = Local.getItem(INFO_ITEMALL, !0);
                console.log(gainCache)
                let count = 0
                for(let item in gainCache){
                    gainCache[item] != '' && (count+=1);
                }
                count != 0 && resolve();
            })
            return promise
    }
    //询问是否启用缓存时间
    askCover(){
            let promise = new Promise((resolve, reject)=>{
                alert('', <div className="recover">系统检测到您之前有填过资料，需要恢复吗？</div>, [
                    { text: '不需要', onPress: () => {} },
                    { text: '好的，我需要', onPress: resolve },
                    { text: '不再提示', onPress: reject },
                    ])
            })
            return promise;

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
            if(!this.checkItem())return false;//检测是否都填了

            this.setState({referLoading: true})

            let param = $.extend({}, this.state, setp1Data)
            // let param = Object.assign({}, this.state, setp1Data)
            let result = refer(param)
            result.then(da=>{
                console.log(da)
                this.setState({referLoading: false})
                if(da.code != '1')return Toast.info(da.desc, 1.5, false)
                // dialog.alert('您的贷款申请已提交成功！稍后我们的客服人员将会跟您联系确认，请保持手机畅通。', {icon:'3', btn:'知道了'}, function(){
				// 	location.replace('#/recommend')
				// 	$http.post(globalUrl+'/lendSuccessSms.go',{
				// 		accessToken:token,
				// 		appId:appid
				// 	}).success(function(){})
				// })
                alert('', <div><Icon type="check" /> 您的贷款申请已提交成功！稍后我们的客服人员将会跟您联系确认，请保持手机畅通。</div>, [
                { text: '知道了', onPress: () => {

                    hashHistory.push({
                        pathname:'/result',
                        query:{
                            city: this.state.city,
                            money: setp1Data.imoney
                        }
                    })
                }}
                ])


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
            // if(t.city === '')return Toast.info('请选择城市', 1.5, null, false);
            // if(t.area === '')return Toast.info('请选择区县', 1.5, null, false);
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
}

export default Option
