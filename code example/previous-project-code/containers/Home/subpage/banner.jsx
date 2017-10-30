import './style.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'



class Banner extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div className="banner"></div>
        )
    }
}

export default Banner