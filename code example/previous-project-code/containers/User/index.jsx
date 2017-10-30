import './index.scss'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { ActivityIndicator, Toast } from 'antd-mobile'


import { getToken } from '../../util/common'
import { getOrderList } from '../../fetch/user'

import List from './subpage/list'
import NoData from './subpage/noData'

let userinfo = getToken();
class User extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            animating: false,
            data:[],
        }
    }
    render() {
        let data = this.state.data;
        return (
            <div className="user">
                {
                    this.props.children != null? this.props.children :
                    data.length >0? <List data={data}/> : <NoData />
                }
                <div className="toast-example">
                    <ActivityIndicator toast text="正在加载" animating={ this.state.animating } />
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.getData()

    }
    getData(){
        let userinfo = getToken();
        if( userinfo.token != null ){
            let token = userinfo.token;
            let appid = userinfo.appid;

            this.setState({animating: true})
            let result = getOrderList(token, appid)
            result.then((data)=>{
                this.setState({animating: false})
                if(data.code != '1')return Toast.info(data.desc, 1.5, false);
                this.setState({data: data.data.progress.reverse()})
            }, (ex)=>{
                this.setState({animating: false})
                Toast.info('服务器异常，请稍后重试')
                if (__DEV__) {
                    console.error('订单详情接口报错, ', ex.message)
                }
            })
        }     
    }
}
export default User