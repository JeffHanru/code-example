import './index.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        let data = this.props.data
        let month = {'0':'3','1':'6','2':'12','3':'2','4':'3','5':'5','6':'10'}[data.iusetimes] || '';
        let state = {'0':'待内审','1':'待接单','2':'已接单','3':'申请失败','4':'已取消','5':'已接单','6':'待内审','7':'待修改','8':'已接单','9':'已接单','10':'申请失败','11':'申请失败'}[data.applystatus] || '已接单';
        return (
            <div className="order_list">
                <div className="div1 clear-fix"><p className="money float-left">贷款金额：<span>{ data.imoney }</span>万元</p><p className="apply_time float-right">{ data.applydate }申请</p></div>
                <div className="div2 clear-fix"><p className="date float-left">贷款期限：<span>{ month }</span>个月</p><p className="label float-right">{ state }</p></div>
		    </div>
        )
    }
    componentWillMount(){
        
    }
}

export default NotFound

/*
 '0':'待内审','1':'待接单','2':'已接单','3':'申请失败','4':'已取消','5':'已退款',
'6':'待认领','7':'待修改','8':'退款核实','9':'待退款',10:'申请失败',11:'自动下架'
6显示0
589都显示2
10 11都显示3
*/
