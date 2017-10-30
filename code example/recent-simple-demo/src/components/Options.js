import React from 'react';
import Option from './Option'

const Options = (props) => {
    return (
        <div>
            <div className="widget-header">
                <h3 className="widget-header__title">Your Options</h3>
                <button
                    className="button button--link"
                    onClick={()=>{
                        props.handleDeleteOption()
                    }}>Remove All</button>
            </div>

            {props.options.length === 0 && <p className="widget__message">Please add an Ooption</p>}
            {
                props.options.map((item,index)=>{
                    return (
                        <Option
                            content={item} key={index} count={index+1}
                            handleDeleteOpt = {props.handleDeleteOpt}
                        />
                    )
                })
            }
        </div>
    )
}

// class Options extends React.Component{
//
//     render() {
//         return (
//             <div>
//                 <button onClick={this.props.handleDeleteOption}>Remove All</button>
//                 {
//                     this.props.options.map((item,index)=>{
//                         return (
//                             <Option content={item} key={index}/>
//                         )
//                     })
//                 }
//             </div>
//         )
//     }
// }


export default Options