import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { getData } from '../../fetch/detail'
import { ActivityIndicator } from 'antd-mobile'

import UD from './subpage/ud'
import Call from './subpage/call'
import Line from './subpage/line'
import Cancel from './subpage/cancel'

class Detail extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            data: '',
            animating: false
        }
    }
    render() {
        let data = this.state.data;
        return (
            <div>
            {
                data != ''?
                <div>
                    <UD iusetimes={data.iusetimes} imoney={data.imoney}  />
                    {
                        data.cphone?<Call cname={data.cname} cphone={data.cphone} />:null
                    }
                    
                    <Line data={data} />
                    {
                        data.applystatus == 0 || data.applystatus == 6?<Cancel iapplyid={this.props.params.id} click={this.gain.bind(this)}/>:null

                    }
                    
                </div>
                :null
            }
            <ActivityIndicator toast text="正在加载" animating={ this.state.animating } />
            </div>
        )
    }

    componentDidMount(){
        this.gain()
        
    }
    gain(){
        let id = this.props.params.id;

        this.setState({animating: true})
        let result = getData(id);
        result.then(da=>{
            this.setState({animating: false})
            if(da.code != '1')return Toast.info(da.desc, 1.5, null, false);
            let data = da.data[0]
            this.setState({data})
        }, (ex)=>{
            this.setState({animating: false})
            Toast.info('服务器异常,请稍后再试', 1.5, null, false);
            if (__DEV__) {
                console.error('获取订单详情报错, ', ex.message)
            }
        })
    }

}

export default Detail