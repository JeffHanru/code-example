import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { Button } from 'antd-mobile'

class Call extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        let cname = this.props.cname;
        let cphone = 'tel:'+this.props.cphone;
        return (
            <div className="call">
                <div className="float-left"><img src={require('../img/header_icon.png')} />{ cname }</div>
                <div className="float-right"><Button className="btn" type="primary" onClick={this.callTel.bind(this, cphone)}>拨打</Button></div>
            </div>
        )
    }
    callTel(tel){
        location.href=tel;
    }
}

export default Call