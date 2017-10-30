import React from 'react';

const Option = (props) => {
    return (
        <div className="option">
            <p className="option__text">{props.count}. {props.content}</p>
            <button
                className="button button--link"
                onClick={(e) => {
                    props.handleDeleteOpt(props.content)
                }}
            >
                remove
            </button>
        </div>
    )
}

export default Option;

// class Option extends React.Component {
//     render() {
//         return (
//             <p>
//                 {this.props.content}
//             </p>
//         )
//     }
// }