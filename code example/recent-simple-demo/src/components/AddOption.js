import React from 'react';


export default class AddOption extends React.Component{

    // constructor(props) {
    //     super(props);
    //     this.handleAddOption = this.handleAddOption.bind(this);
    //     this.state = {
    //         error: undefined
    //     }
    // }

    state = {
        error: undefined
    }

    handleAddOption=(e) => {
        e.preventDefault();
        const option = e.target.elements.option.value.trim();
        const error = this.props.handleAddoption(option);
        // if(option){
        //     this.props.handleAddoption(option)
        // }
        this.setState(()=>{
            return {
                error
            }
        })
        if(!error){
            e.target.elements.option.value='';
        }

    }

    render() {
        return (
            <div>
                {this.state.error && <p className="add-option-error">{this.state.error}</p>}
                <form onSubmit={this.handleAddOption}
                      className="add-option"
                >
                    <input className="add-option__input" type="text" name="option"/>
                    <button className="button">Submit</button>
                </form>
            </div>
        )
    }
}

