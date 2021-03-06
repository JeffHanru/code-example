import './index.scss'

import React from 'react'

import { ListView, List, Toast, ActivityIndicator } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {hashHistory } from 'react-router'
import { getCityData, getArea } from '../../fetch/city'

import * as cityActions from '../../actions/cityData' 

let areaMap = {"110100":"100","120100":"104","130100":"122","130200":"135","130300":"174","130400":"172","130500":"432","130600":"347","130700":"243","130900":"173","131000":"219","131100":"276","140100":"128","140200":"190","140300":"315","140400":"254","140500":"212","140700":"355","140800":"213","150100":"148","150200":"155","150300":"417","150400":"465","150700":"349","210100":"116","210200":"110","210300":"480","210600":"205","220100":"118","220200":"170","220800":"461","230100":"115","230200":"241","230600":"144","310100":"101","320100":"106","320200":"126","320300":"143","320400":"136","320500":"123","320600":"139","320700":"280","320800":"147","320900":"181","321000":"140","321100":"149","321200":"296","321300":"263","330100":"105","330200":"111","330300":"133","330400":"156","330500":"268","330600":"189","330700":"165","330900":"264","331000":"169","331100":"411","340100":"129","340200":"321","340500":"182","340700":"403","340800":"451","341000":"283","341100":"437","341200":"372","341300":"412","341500":"387","341700":"381","341800":"380","350100":"120","350200":"112","350300":"160","350400":"410","350500":"158","350600":"201","350700":"285","350800":"168","350900":"435","360100":"130","360200":"314","360400":"426","360500":"281","360700":"178","360900":"284","361100":"176","370100":"107","370200":"109","370300":"134","370400":"256","370500":"161","370600":"137","370700":"150","370800":"166","370900":"217","371000":"145","371100":"252","371300":"153","371500":"466","371600":"415","410100":"121","410200":"404","410300":"146","410400":"207","410500":"444","410700":"289","411000":"187","411100":"394","411300":"188","411400":"293","411500":"164","411700":"361","420100":"114","420200":"330","420300":"294","420500":"194","420600":"180","420800":"332","420900":"229","421000":"199","430100":"119","430200":"185","430300":"179","430400":"186","430500":"418","430600":"439","430700":"457","430800":"297","431000":"218","431100":"313","431200":"463","433100":"484","440100":"103","440300":"102","440400":"138","440500":"162","440600":"124","440700":"163","440800":"430","440900":"353","441200":"368","441300":"157","441400":"312","441600":"327","441700":"365","441800":"464","441900":"142","442000":"152","445100":"274","445300":"292","450100":"131","450200":"184","450300":"151","450700":"239","450800":"318","450900":"485","451000":"204","451100":"325","451200":"259","451300":"429","451400":"422","460100":"195","460200":"183","469002":"248","500100":"108","510100":"113","510300":"211","510400":"369","510500":"260","510600":"192","510700":"247","510800":"210","510900":"497","511100":"200","511300":"455","511400":"354","511500":"414","511700":"246","511900":"448","512000":"498","520100":"141","520300":"329","520500":"501","522600":"504","522700":"505","530100":"132","530300":"193","530400":"191","530500":"396","530600":"290","530700":"341","530800":"333","532300":"506","532500":"507","532900":"324","542500":"287","610100":"117","610300":"175","610400":"154","610500":"388","610600":"401","610700":"236","610800":"370","610900":"221","620100":"196","620600":"450","620800":"447","620900":"275","621000":"328","630100":"405","640100":"198","650100":"197"};
let dataArea = [],
cityCode = '';
class Area extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceArea: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      animating: true
    }
  }
  

  render() {
      

      return (
        <div className="area">
            <ListView
            dataSource={this.state.dataSourceArea.cloneWithRows(dataArea)}
            renderRow={this.rowArea.bind(this)}
            // renderSeparator={separator}
            initialListSize={100}
            pageSize={100}
            scrollRenderAheadDistance={200}
            scrollEventThrottle={20}
            style={{
              height: document.documentElement.clientHeight,
              margin: '0.1rem 0',
            }}
            scrollerOptions={{ scrollbars: true }}
            />
            <ActivityIndicator toast text={ '加载中...' } animating={ this.state.animating } />
        </div>
      );
  }
  componentWillMount(){
    cityCode = this.props.params.id || '';
  }
  componentDidMount(){
    setTimeout(()=>{
      let result = getArea( areaMap[ cityCode ] )
      result.then((da)=>{
          
          var R = da.getElementsByTagName("Resp")[0]
          var code = R.getAttribute('code')
          var desc = R.getAttribute('desc')
          if(code == '1'){
              var parent = R.getElementsByTagName('parent')
              let data = []
              for(var i in parent){
                if(typeof parent[i] == 'object'){
                  var obj = {}
                  var code = parent[i].getAttribute('adcode')
                  var name = parent[i].getAttribute('careaname')
                  data.push({code , name})
                }
              }
              dataArea = data;
              this.setState({animating: false})
          }
      }, ()=>{
        this.setState({animating: false})
      })
    }, 10)
  }
  componentWillUnmount(){
    dataArea = [];
  }
  rowArea(data, hd, index){
    
    return <div className="list-item" key={index} onClick={()=>{  this.selArea(data) }}>{data.name}</div>
  }
  selArea(data){
    this.props.cityFun.setArea(data);
    hashHistory.goBack()
  }
}

// -------------------redux react 绑定--------------------

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        cityFun: bindActionCreators(cityActions, dispatch),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Area)