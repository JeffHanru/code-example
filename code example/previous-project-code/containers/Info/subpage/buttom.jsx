import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { ActivityIndicator } from 'antd-mobile'

import { Link } from 'react-router'
class Buttom extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div className="option_btn" onClick={this.props.click}>确认提交<ActivityIndicator animating={ this.props.loading } /></div>
        )
    }
}

export default Buttom