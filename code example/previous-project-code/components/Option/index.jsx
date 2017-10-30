import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import { Toast } from 'antd-mobile'

import { Picker, List } from 'antd-mobile';


const CustomChildren = props => {
    let switch_ =  props.extra == '请选择';
    let _extra=props.extra
    if(props.children=="是否有人寿保险"){
        _extra={"无寿险保单(本人)":"无","有寿险保单缴费1年以内":"缴费1年以内","有寿险保单已缴费1-3年":"缴费1-3年","有寿险保单已缴费3年以上":"缴费3年以上"}[props.extra]
    }
    return (
        <div onClick={props.onClick} className="opt_item" >
            <div className="opt_left">{props.children}{props.children=="是否有人寿保险"?<span className="opt_add">(本人是投保人)</span>:null}</div>
            <div className={"opt_right "+(switch_?'':'blue')}>{ _extra }<img src={require('./img/arrow.png')} /></div>
        </div>
    )
};
class Opt extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            mValue: ''
        }
    }

    render() {
        let c = this.props.c;//标题
        let seasons = this.props.data;
        return (
            <Picker data={seasons} cols={1} title={c} extra='请选择' value={this.state.mValue}
                onChange={v=>{ this.setState({mValue: v});this.props.click(this.props.t, v) }}
            >
                <CustomChildren>{c}</CustomChildren>
            </Picker>
        )
    }
    componentWillMount(){

    }
    componentDidMount(){//will 和did 只会进来一次  父级显示隐藏的时候 也会进来一次 所以 把 props赋值操作放这里
        if(this.state.mValue == '' && this.props.value != ''){//第一次进来
            this.setState({mValue: [this.props.value]})
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.state.mValue == '' && nextProps.value != ''){//初始化 取缓存 有值的时候 会第二次进来
            this.setState({mValue: [nextProps.value]})
        }
    }
}
export default Opt
