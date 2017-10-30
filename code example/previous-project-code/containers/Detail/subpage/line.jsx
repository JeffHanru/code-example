import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class Line extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        let data = this.props.data;
        let on1 = '', on2 = '', on3 = '';//当前状态
        if(!data.cauditdate){
            on1 = 'on'
        }else{
            if(!data.cbuydate){
                on2 = 'on'
            }else{
                on3 = 'on'
            }
        }
        return (
            <div className="detail_line">
                <div className={"clear-fix grey "+on1}>
                    <div className="float-left"><span>申请</span></div>
                    <div>
                        <span>{data.applydesc}</span>
                        <span>{data.applydate}</span>
                    </div>
                </div>
                <div className={"clear-fix "+ on2+(!!data.cbuydate? ' grey': '')}>
                    <div className="float-left"><span>初审</span></div>
                    {
                        data.cauditdate?
                        <div>
                            <span>{data.cauditdesc}</span>
                            <span>{data.cauditdate}</span>
                        </div>:null
                    }
                    
                </div>
                <div className={"clear-fix "+on3}>
                    <div className="float-left"><span>接单</span></div>
                    {
                        data.cbuydate?
                        <div>
                            <span>信贷经理已接单</span>
                            <span>{data.cbuydate}</span>
                        </div>:null
                    }
                    
                </div>
            </div>
        )
    }
}

export default Line