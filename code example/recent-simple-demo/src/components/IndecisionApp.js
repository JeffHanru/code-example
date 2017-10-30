import React from 'react'
import AddOption from './AddOption'
import Header from './Header'
import Action from './Action'
import Options from './Options'
import validator from 'validator';
import OptionModal from './OptionModal'

export default class IndecisionApp extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.handleDeleteOptions=this.handleDeleteOptions.bind(this);
    //     this.handlePick = this.handlePick.bind(this);
    //     this.handleAddOption = this.handleAddOption.bind(this);
    //     this.handleDeleteOption= this.handleDeleteOption.bind(this);
    //     this.state = {
    //         option: props.option
    //     }
    // }

    state = {
        option: [],
        selectedOption: undefined
    }

    componentDidMount =() => {

        try{
            const json = localStorage.getItem('options')
            const options = JSON.parse(json);

            if(options){
                this.setState(() => ({
                    option: options
                }))
            }
        } catch(e) {
            //
        }

    }

    componentDidUpdate = (prevProps,prevState) => {
        if(prevState.option.length !== this.state.option.length) {
            const json = JSON.stringify(this.state.option);
            localStorage.setItem('options',json);
            console.log('save data');
        }
        console.log('componentDidUpdate!');
    }



    componentWillUnmount=()=> {
        console.log('componentWillUnmount');
    }



    handleDeleteOptions = ()=> {
        // this.setState((prevState)=>{
        //     return {
        //         option : []
        //     }
        // })

        this.setState(() => ({
            option: []
        }))
    }

    handlePick= () => {
        let pickedItemIndex = Math.floor(Math.random()*this.state.option.length);
        let pickedItem = this.state.option[pickedItemIndex]
        //console.log(pickedItem)
        this.setState(()=>({
            selectedOption: pickedItem
        }))
    }

    handleDeleteOption = (optionToRemove) => {
        //console.log('hdo',optionToRemove);

        this.setState((prevState)=>({
            option: prevState.option.filter((option)=>{
                return optionToRemove !== option;
            })
        }))
    }

    handleAddOption =(option) => {
        if(!option){
            return 'Enter valid value to add item';
        }else if(this.state.option.indexOf(option) > -1){
            return 'This option already exists';
        }

        this.setState((prevState)=>({
            option: prevState.option.concat([option])
        }))
    }

    handleToggleOff = () => {
        this.setState(()=>({
            selectedOption: false
        }))
    }

    render() {
        const title = 'Indecision';
        const subtitle = 'Put your life in the hand of a computer';
        return (
            <div>
                <Header title={title} subtitle={subtitle}/>
                <div className="container">
                    <Action
                        hasOptions={this.state.option.length > 0}
                        handlePick = {this.handlePick}
                    />
                    <div className="widget">
                        <Options
                            options={this.state.option}
                            handleDeleteOption = {this.handleDeleteOptions}
                            handleDeleteOpt = {this.handleDeleteOption}
                        />
                        <AddOption
                            handleAddoption = {this.handleAddOption}
                        />
                    </div>
                </div>
                <OptionModal
                    selectedOption = {this.state.selectedOption}
                    handleToggleOff = {this.handleToggleOff}
                />
            </div>
        )
    }
}

IndecisionApp.defaultProps = {
    option: []
}