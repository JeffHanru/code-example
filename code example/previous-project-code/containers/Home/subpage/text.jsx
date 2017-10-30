import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'


let isFix = { marginTop: '0'};

class Text extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }
    render() {
        return (
            <div className="Text">
                <div className="ts">友情提示:收到贷款之前请不要支付任何费用</div>

                <div className="beian" style={isFix}>
                    <p>上海彩亿互联网金融信息服务有限公司</p>
                    <p>Copyright©youyuwo.com-有鱼金融沪ICP备13032924号-8</p>
                </div>

            </div>
        )
    }
    componentDidMount(){
        let $0H = document.querySelector('.ts').clientHeight;//友情提示 自身高度
        let $1H = document.querySelector('.beian').clientHeight;//公司 自身高度
        let CH = document.documentElement.clientHeight;//窗口可视高度
        let $0_st = document.querySelector('.ts').offsetTop;//友情提示 距离顶部高度

        let mid = CH - $0_st - $0H - $1H
        if(mid > 100){

            isFix = { marginTop: (mid-10)+'px'};


            this.setState({refresh: 1})
        }else{
            isFix = { marginTop: '100px'};
        }
        
    }
}

export default Text