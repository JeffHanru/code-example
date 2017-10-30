import './index.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        let data = this.props.data;
        let lv = data.cmonthlyrate.split("-")[0];
        let fs = data.cmonthlyrate.split("|")[1]=="天"?"最低日息":"最低月息"



        let c = data.camountrange.split("-"), reg = /(.+)(.)$/,
            c1 = c[0].match(reg),
            c2 = c[1].match(reg),
            c1_1 = c1[1],
            c1_2 = c1[2],
            c2_1 = c2[1],
            c2_2 = c2[2];
        let label = data.ctag.split('|')


        return (
            <div className="prolist" onClick={this.props.click}>
                <div className="prologo"><img src={data.cprologo} /></div>
                <div className="proinfo">
                    <p className="name clear-fix">
                        <strong className="float-left">{data.cproductname}</strong>
                        <span className="float-right">
                            <cite>{ lv }% </cite>{ fs }
                            <em>{ c1_1 }<i>{ c1_2 }</i>-{ c2_1 }<i>{ c2_2 }</i></em>
                        </span>
                    </p>
                    <p className="slogan">{ data.cprodesc }</p>
                    <div className="label clear-fix">
                        <span className="float-left">
                        {
                            label.map((item, index)=>{
                                return <em key={index}>{ item }</em>
                            })
                        }
                        </span>
                        <cite className="float-right">{ data.capplynum }人申请</cite>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound