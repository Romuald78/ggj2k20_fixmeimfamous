import * as React from 'react';
import {ModuleGrid} from "../main/ggj2020/ModuleGrid";
import {List, Paper} from "@material-ui/core";

interface State {
}

interface Props {
    color:string,
    team:string,
    modulegrid: ModuleGrid,
}

class ModuleImg extends React.Component<{ id: number }, {}> {
    mapIdToImage(id: number): string {
        return "/assets/main_atlas/modules/module_" + id + "/module_" + id + "_0.png";
    }

    public render() {
        return (
            <React.Fragment>
                {this.props.id !== 0 &&
                    <img style={{width:"32px",height:"32px"}} draggable={false} alt={this.mapIdToImage(this.props.id)} src={this.mapIdToImage(this.props.id)}/>
                }
                {this.props.id === 0 &&
                    <div style={{width:"32px",height:"32px"}} />
                }
            </React.Fragment>
        );
    }
}

class TargetPreview extends React.Component<Props, State> {

    componentDidMount() {
        console.log(this.props.modulegrid);
    }

    componentWillUnmount() {
    }

    public render() {
        return (
            <React.Fragment>
                <Paper style={{backgroundColor:this.props.color,margin:"20px"}}>
                    <span> Team {this.props.team} target:</span>
                {this.props.modulegrid.grid.map((column,index) => {
                    return <div style={{display:"flex",justifyContent:"center"}} key={"index"}>{column.map((item,index2) => {
                        return <ModuleImg key ={index+"_"+index2+"_"+this.props.color} id={item}/>
                    })}</div>
                })}
            </Paper>
            </React.Fragment>
        );
    }
}

export default TargetPreview;
