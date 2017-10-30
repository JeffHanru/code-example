import './style.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class UD extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        let imoney = this.props.imoney;
        let iusetimes = {'0':'3','1':'6','2':'12','3':'2','4':'3','5':'5','6':'10'}[this.props.iusetimes]
        let da = {'0':'个月','1':'个月','2':'个月'}[this.props.iusetimes] || '年';
        return (
            <div className="ud clear-fix">
                <div className="ud-left float-left">
                    <div>贷款金额：<em>{this.props.imoney}</em>万元</div>
                    <div>贷款期限：<em>{iusetimes}</em>{da}</div>
                </div>
                {
                    // <div className="ud-right float-right">申请资料</div>
                }
            </div>
        )
    }
}

export default UD