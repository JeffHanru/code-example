import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

import ProList from '../../../components/ProList'

class List extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.goJump = this._goJump.bind(this)
        this.state = {
            data:[],
        }
    }
    


    render() {
        let data = this.props.data
        return (
            <div className="result_list">
                {
                    data.map((item, index)=>{
                        return <ProList data={item} key={index} click={()=>{ this.goJump(item.iproductid, item.cproductpageurl, item.curl, item.cproductname ) }}/>
                    })
                }

            </div>
        )
    }
    _goJump(iproductid,url,curl,name){
        localStorage.setItem("iproductid",iproductid)
        if(!!url){
            if(document.domain=="hsk.gs.9188.com"){
                var realUrL="http://hsk.gs.9188.com"+url.match(/(.+)(com)(.+)/)[3]
            }else {
				var realUrL = url
			}
        }else{
			var realUrL=curl
			// _czc.push(['_trackEvent', '栏目-申请页+yycgsb' , name + '+ ', "ceshi", '1', '点击次数']);//计数
		}
		
		location.href = realUrL+'&iproductid='+iproductid;
    }
}

export default List