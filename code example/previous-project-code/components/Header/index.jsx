import './index.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div className="header">
                <span className="back" onClick={()=>{ history.back() }}><i></i></span>
                <span className="title">贷款</span>
            </div>
        )
    }
}

export default Header