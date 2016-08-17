import React from 'react';
import {rand} from './util';

export const HttpDataList = React.createClass({
    render: function () {
        const items = mapKeyVals(this.props.items, (key, val) => <tr key={rand()}><td className="mdl-data-table__cell--non-numeric">{key}</td><td className="mdl-data-table__cell--non-numeric">{val}</td></tr>);
        const label = this.props.label || this.props.name;
        if(items.length>0) {
            return <div>
                <div className="mdl-card__title mdl-card--expand">
                    <h6 className="mdl-card__title-text">{label}</h6>
                </div>
                <table className="mdl-data-table mdl-js-data-table mdl-data-table">
                <thead>
                <tr>
                    <th className="mdl-data-table__cell--non-numeric">Name</th>
                    <th className="mdl-data-table__cell--non-numeric">Value</th>
                </tr>
                </thead>
                <tbody>
                {items}
                </tbody>
            </table>
                </div>
        }else{
            return null;
        }
    }
});

export const HttpDataEditor = React.createClass({
    getInitialState: function(){
        return {
            numberOfItems: this.props.items ? Object.keys(this.props.items).length : 0
        }
    },
    addItem:function () {
        this.setState({
            numberOfItems: this.state.numberOfItems+1
        });
    },
    updateMap: function(){
        const newState = {};
        for(let i=0; i < Object.keys(this.refs).length; i+=2){
            var keyName = Object.keys(this.refs)[i];
            var valueName = Object.keys(this.refs)[i+1];


            const k = this.refs[keyName].value;
            const v = this.refs[valueName].value;

            if(k!=="" || v!=="") {
                newState[k] = v;
            }
        }
        this.props.onChange({
            target: {
                name: this.props.name,
                value: newState
            }
        })
    },
    createInput: function (ref, key, val) {
        return (
        <div className="mdl-textfield mdl-js-textfield">
            <input ref={ref+"key"} className="mdl-textfield__input" type="text" value={key} onChange={this.updateMap} />
            <i className="material-icons">chevron_right</i>
            <input ref={ref+"value"} className="mdl-textfield__input" type="text" value={val} onChange={this.updateMap} />
        </div>
        )
    },
    render: function () {
        const label = this.props.label || this.props.name;
        const items = mapKeyVals(this.props.items, (key, val, i) => this.createInput(this.props.name+i, key, val));
        items.push(this.createInput(this.props.name+(items.length+1), "", ""));

        const remainingItems = this.state.numberOfItems+1 - items.length;

        for(let i=0; i < remainingItems; i++){
            const newItem = this.createInput(this.props.name+(i+items.length), "", "")
            items.push(newItem)
        }

        return <HttpDataView onClick={this.addItem} name={label} items={items}/>
    }
});

const HttpDataView = React.createClass({
    render: function () {
        return (
            <div className="list-editor">
                <label>{this.props.name}</label>
                <ul>{this.props.items}</ul>
            </div>
        )
    }
})

function mapKeyVals(items, f) {
    if (items) {
        let i = -1;
        return Object.keys(items).map(function (key) {
            i++;
            let value = items[key];
            return (
                f(key, value, i)
            )
        });
    }
    return [];
}