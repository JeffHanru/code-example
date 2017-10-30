import './index.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import Header from '../../components/Header'
import { Toast } from 'antd-mobile'
import List from './subpage/list'

import { gainList } from '../../fetch/result'

class Result extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: []
        }
    }
    render() {
        return (
            <div className="result">
                <div className="header_ts">还有以下机构满足您的需求</div>
                <List data={ this.state.data } />
                <div className="tips">
                    贷款申请小技巧：<br />
                    <cite>1、同时申请多家，成功率高；</cite>
                    2、申请多家能比较各家放款快慢和利息高低；<br />
                    3、贷款金额拆分成几个小额再申请多家成功率会更高。
                </div>
            </div>
        )
    }
    componentDidMount(){
        let query = this.props.location.query,
        money = query.money || '2',
        city = query.city || '310100';

        let result = gainList( city, money );
        result.then((da)=>{
            console.log(da)
            if(da.code != '1')return Toast(da.desc, 1, false)
            this.setState({data: da.data})
            
        }, (ex)=>{
            Toast.info('服务器异常,请稍后再试', 1.5, null, false);
            if (__DEV__) {
                console.error('获取贷款产品列表报错, ', ex.message)
            }
        })


    }
}

export default Result