import './style.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'




class NoData extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        
        return (
            <div className="fail_div">
                <p >啊哦~暂时没有查询到您的贷款订单</p>
                <p >先去提交一下申请再来查询吧~</p>
            </div>
        )
    }

}


export default NoData