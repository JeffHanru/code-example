
import './index.scss'

import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import Draggable from 'react-draggable';
import { hashHistory } from 'react-router'
import LocalStore from '../../util/localStore';
import { POSITION } from '../../config/localStoreKey';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as GainUserINfo from '../../actions/userinfo.js' 


import { Link } from 'react-router'
import { Toast } from 'antd-mobile'


let width = document.body.clientWidth;
let height = document.documentElement.clientHeight;

let g = {
    width: width -45,//45 是logo 的宽高
    height: height -45,
    x: width-55,//55 是随便定的 初始化位置用的
    y: height-85,
}
class Me extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.goLogin = this._goLogin.bind(this)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        
        return (
            <Draggable
                bounds={{top: 0, left: 0, right: g.width, bottom: g.height}}
                axis="both"
                handle=".handle"
                defaultPosition={{x: g.x, y: g.y}}
                grid={[2,2]}
                onStop={this.handleStop}
            >
                <div id="meDiv" className="handle" onClick={ this.goLogin } ></div>
            </Draggable>
        )
    }
    componentWillMount(){
        let position = LocalStore.getItem(POSITION)
        if(position != null){
            position = JSON.parse(position),
            Object.assign(g, position)
        }
    }
    componentDidMount(){
        this.props.userInfoActions.getToken()
    }
    _goLogin(){
        if(this.props.userinfo.token != ''){
            hashHistory.push('/user')
        }else{
            hashHistory.push('/login')
        }
    }
    handleStop(){
        var meArr = document.querySelector('#meDiv').style.transform.replace(/[^0-9\-,]/g,'').split(',');
        let position = {
            x: +meArr[0],
            y: +meArr[1]
        }
        LocalStore.setItem(POSITION, JSON.stringify(position))
    }
}

//------------------------------- Redux ----------------------------------
function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userInfoActions: bindActionCreators(GainUserINfo, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Me)

