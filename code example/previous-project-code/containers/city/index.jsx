import './index.scss'

import React from 'react'

import { ListView, List, SearchBar, Toast, ActivityIndicator, Button, Icon } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {hashHistory } from 'react-router'
import { getCityData, getArea } from '../../fetch/city'

import * as cityActions from '../../actions/cityData' 

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

let hotList = [
  {"value":"310100","label":"上海"},
  {"value":"110100","label":"北京"},
  {"value":"440100","label":"广州"},
  {"value":"440300","label":"深圳"},
  {"value":"420100","label":"武汉"},
  {"value":"120100","label":"天津"},
  {"value":"610100","label":"西安"},
  {"value":"320100","label":"南京"},
  {"value":"330100","label":"杭州"},
  {"value":"510100","label":"成都"},
  {"value":"500100","label":"重庆"},
]

let cityDataList = {};
let g = {
  code :'',//当前点的城市id
  name :''//当前点的城市名

}
class City extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.onSearch = this._onSearch.bind(this)
    this.selCity = this._selCity.bind(this)
    this.header = this._header.bind(this)
    this.row = this._row.bind(this)
    this.state = {
      inputValue: '',
      dataSource: dataSource,
      data:[],
      headerPressCount: 0,
    };
  }
  createDs(ds, province) {
      const dataBlob = {};
      const sectionIDs = [];
      const rowIDs = [];
      Object.keys(province).forEach((item, index) => {
        sectionIDs.push(item);
        dataBlob[item] = item;
        rowIDs[index] = [];

        province[item].forEach((jj) => {
          rowIDs[index].push(jj.value);
          dataBlob[jj.value] = jj.label;
        });
      });
      return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
    }
  _onSearch (val) {
    var pd =  JSON.parse(JSON.stringify( cityDataList )) 
    Object.keys(pd).forEach((item) => {
      pd[item] = pd[item].filter((jj) => {
        var reg = new RegExp(val.replace(/ /g, ''), 'i');//将用户输入的值去空格
        if(reg.test(jj.spell.replace(/ /g,''))){//直接匹配 用户输入的值
          return true
        }else if( reg.test( jj.label) ){//如果用户输入的中文
          return true
        }else if( reg.test(jj.spell.replace(/[ |a-z]/g, '')) ){// 匹配 武汉 WH wh  这种首字母的
          return true
        }
        return false

      });
    });
    this.setState({
      inputValue: val,
      data: pd,
    });
  }

  render() {
      let result = this.isSea();    
      var data = result.data;//搜索有无数据 true是有数据
      var isSearch = result.isSearch;//是否是搜索进来的 true是搜索进来的

      return (
        <div className="city">
            <div className="search">
                <SearchBar
                  value={this.state.inputValue}
                  placeholder="搜索  "
                  onChange={this.onSearch}
                  onClear={() => { this.setState({data: cityDataList, inputValue:''}) }}
                  onCancel={() => { this.setState({data: cityDataList, inputValue:''}) }}
                />
            </div>
            {

              data?
              <ListView.IndexedList
              dataSource={this.createDs(this.state.dataSource, this.state.data)}
              renderHeader={isSearch?null:this.header}
              // renderFooter={() => <span>我是有底线的</span>}
              renderSectionHeader={sectionData => (<div className="ih">{sectionData}</div>)}
              renderRow={this.row}
              className="am-list"
              stickyHeader
              stickyProps={{stickyStyle: { zIndex: 999 },}}
              quickSearchBarStyle={{top: isSearch?'-1000':'185'}}
              // delayTime={1}
              // delayActivityIndicator={<ActivityIndicator size="large" />}
              />
              :
              <div className="noData">没有数据</div>
            }

        </div>
      );
  }
  componentWillMount(){
    g.code = this.props.params.id || '';

  }
  componentDidMount(){
      let result = getCityData();
      result.then((data)=>{
        this.setState({data: data});
        cityDataList = data;
      }, ()=>{})


  }
  componentWillUnmount(){

  }

  isSea(){
      let pd = this.state.data, data = false, isSearch = false;
      Object.keys(pd).forEach((item) => {
          if(pd[item].length>0){
              data = true;
          }
          if(pd[item].length == 0){
              isSearch = true;
          }
      });
      return {
        data: data,
        isSearch:isSearch
      }
  }

  _selCity( sel ){//选择城市 
    g.code = sel.value;
    g.name = sel.label;
    this.props.cityFun.setCity({name: g.name, code:g.code})
    hashHistory.goBack()

  }

  _row(rowData, hd, value){
    return <div className={"list_item " + (g.code==value?'on':null)} onClick={()=>{ this.selCity({value:value,label:rowData }) }}>{rowData}</div>
  }
 
  _header(){
    return (
      <div className="hotCity">
        <div>热门城市</div>
        <ul>
        {
          hotList.map(item=>{
            return <li className={g.code==item.value?"on":null}  onClick={()=>{ this.selCity(item) }}><div>{item.label}</div></li>
          })
        }
        </ul>
      </div>
    )
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
)(City)