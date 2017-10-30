import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class Prompt extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <h1></h1>
        )
    }
}

export default Prompt