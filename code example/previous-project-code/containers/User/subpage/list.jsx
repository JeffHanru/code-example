import React from 'react'


import { RefreshControl, ListView } from 'antd-mobile';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Link } from 'react-router'



import OrderList from '../../../components/OrderList'

class List extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      refreshing: false,
      data:[]
    };
  }
  onRefresh(){
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({
        refreshing: false,
      });
    }, 100);
  };
  onScroll(){
  };
  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F1F1F1',
          height: '.2rem',
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    return (
      <ListView
        dataSource={this.state.dataSource.cloneWithRows(this.props.data)}
        renderRow={this.renderRow}
        // renderSeparator={separator}
        initialListSize={100}
        pageSize={100}
        scrollRenderAheadDistance={200}
        scrollEventThrottle={20}
        onScroll={this.onScroll}
        style={{
          height: document.documentElement.clientHeight-40,
          margin: '0.1rem 0',
        }}
        scrollerOptions={{ scrollbars: true }}
        refreshControl={<RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
        />}
      />
    );
  }
    renderRow (rowData, sectionID, rowID){//dataSource 数组值 sectionID 标题  rowID 组数index
        let url = "/detail/"+rowData.iapplyid
        return <Link to={url} key={rowID}><OrderList data={rowData} /></Link>
    };
}

export default List
