import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Header from '../components/Header'
import Me from '../components/Me'

import { getWxInfo, wxShare } from '../fetch'
import { isHeader, isMe } from '../util/common'
let mt = {paddingTop:'81px'}
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            isShow: true
        }
    }
    render() {
        let isShow = isHeader(this.GetQueryString('cf')) && this.state.isShow;
        let isShowMe = isMe(this.props.location.pathname);
        return (
            <div style={ isShow ? mt :null }>
                { isShow ? <Header />:null }
                { this.props.children }
                { isShowMe ? <Me />:null }
            </div>
        )
    }
    componentDidMount(){
        if(/&/.test(location.hash)){
            location.hash = location.hash.match(/(^[^&]+)&(.+)$/)[1]
        }
        let result = getWxInfo();
        result.then(da=>{
            let R = da.getElementsByTagName("Resp")[0]
            let code = R.getAttribute('code')
            if(code == '1'){
                let row = R.getElementsByTagName('row')[0],
                appId = row.getAttribute('appId'),
                timestamp = row.getAttribute('timestamp'),
                nonceStr = row.getAttribute('nonceStr'),
                signature = row.getAttribute('signature');
                wxShare(appId, timestamp, nonceStr, signature)
            }
                      
        }, ()=>{

        })

    }
    componentWillReceiveProps(nextProps){
        if(/\/city\/.?/.test(nextProps.location.pathname)){//城市页面不显示页头
            this.setState({isShow: false})
        }else{
            this.setState({isShow: true})
        }
        if(__DEV__){
            // console.log(nextProps.location.pathname)
        }
    }
    GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURIComponent(r[2]); return null;
    }
}


export default App
