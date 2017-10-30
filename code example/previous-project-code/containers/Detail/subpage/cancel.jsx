import './style.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { Button, Toast } from 'antd-mobile'
import {cancelLoan} from '../../../fetch/detail'
class Cancel extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        
        return (
            <Button className="detail_cancel" type="primary" onClick={this.goCancel.bind(this)}>取消贷款</Button>
        )
    }
    goCancel(){
        let iapplyid = this.props.iapplyid;
        let result = cancelLoan(iapplyid)
        result.then(da=>{
            Toast.info(da.desc, 1.5, null, false);
            if(da.code == '1'){
                this.props.click();
            }
        }, (ex)=>{
            Toast.info('服务器异常,请稍后再试', 1.5, null, false);
            if (__DEV__) {
                console.error('获取订单详情报错, ', ex.message)
            }
        })
    }
}

export default Cancel

