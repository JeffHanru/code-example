import './style.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class Warning extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div className="warning">
                <img src={require('../img/tip.png')}/>
                资质请准确填写,以便为您量身推荐贷款产品
            </div>
        )
    }
}

export default Warning