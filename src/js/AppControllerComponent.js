import React from "react";
import "../scss/_index.scss";
import {DropdownOptionControllerComponent} from "./Components/DropdownOptionControllerComponent";
import {DropdownHolder} from "./Components/DropdownHolder";

export class AppControllerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            additionalOptions: {}
        };
    }

    handleUpdateAdditionalOptions(options) {
        this.setState({
            additionalOptions: options
        })
    }

    render() {
        return (<>
                <DropdownOptionControllerComponent
                    handleInputChange={(options) => this.handleUpdateAdditionalOptions(options)}
                />
                <DropdownHolder
                    inputOptions={this.state.additionalOptions}
                />
            </>)
    }
}

export default AppControllerComponent;
