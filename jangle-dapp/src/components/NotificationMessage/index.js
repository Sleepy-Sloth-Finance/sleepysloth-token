import React from 'react';

class NewMessageNotification extends React.Component {
    openWindow = () => {
        if (!this.props.link) return;
        //navigate to the link. I'll use location hash but it can be done with any router solution
        window.open(this.props.link, '_blank');
    };

    render() {
        return <div onClick={this.openWindow}>{this.props.title}</div>;
    }
}

export default NewMessageNotification;
