
/*

------------------------------------
XBOX / NAMES / GameCube / SUPER NES
------------------------------------
0   -   A       -   1       -   1
1   -   B       -   2       -   2
2   -   X       -   0       -   0
3   -   Y       -   3       -   3
4   -   LB      -   .       -   4
5   -   RB      -   7       -   5
6   -   LT      -   4       -   .
7   -   RT      -   5       -   .
8   -   BACK    -   .       -   8
9   -   START   -   9       -   9
10  -   LSTICK  -   .       -   .
11  -   RSTICK  -   .       -   .
12  -   CROSSU  -   12      -   .
13  -   CROSSD  -   14      -   .
14  -   CROSSL  -   15      -   .
15  -   CROSSR  -   13      -   .
------------------------------------
XBOX / NAMES / GameCube / SUPER NES
------------------------------------
0   -   LEFTH   -   0       -   0
1   -   LEFTV   -   1       -   1
2   -   RIGHTH  -   5       -   .
3   -   RIGHTV  -   2       -   .
4   -   ?       -   9?      -   .
5   -   ?       -   9?      -   .


 */

import {Component} from "../../core/Component";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

export interface Input {
    type:string,
    device_num:number,
    input_ref:string,// button number in string, axis number in string, key lowercase value
    threshold:number, // threshold for analog value to convert into boolean ; if negative, the value must be lower, if positive the value mut be greater
}

// BUG : it seems the GAMECUBE gamepads are linked in random order O_o !!!! to be checked
// EDIT it seems ok with ONE XBOX gamepad (always the #0) : to check with several O_o

export class InputComponent implements Component {

    // INTERFACE METHOD
    getName(): string {
        return InputComponent.name;
    }


    //-------------------------------------------------------------------------------------
    // PRIVATE PROPERTIES
    //-------------------------------------------------------------------------------------
    // key states are updated during events and polled in isOn / isOFF methods
    private keyState:{[id:string]:boolean} = {};
    // button states are updated in update loop. When a change is noticed, the linked callbacks are called during update loop as well
    private butState:{[id:string]:{devNum:number,butNum:number,state:boolean}} = {};
    private axisState:{[id:string]:{devNum:number,butNum:number,state:boolean,input:Input}} = {};
    // callback list is filled using registerEvent method and used both in keyboard events and gamepad button polling
    private callbackList:{ [id:string] : (actionName:string,buttonState:boolean)=>void } = {};
    // List of actions related to a key
    private keyList:{[id:string]:Input} = {};
    // List of actions related to a gamepad button
    private buttonList:{[id:string]:Input} = {};
    // List of actions related to a gamepad axis
    private gamePadAxisList:{[id:string]:Input} = {};


    //-------------------------------------------------------------------------------------
    // BUTTON AND AXIS IDs TRANSLATION
    //-------------------------------------------------------------------------------------
    // Translate BUTTON NAMES to BUTTON NUMBERS (XBOX IDs)
    private readonly buttonNames:{[id:string]:string} = {
        "A"     :"0",
        "B"     :"1",
        "X"     :"2",
        "Y"     :"3",
        "LB"    :"4",
        "RB"    :"5",
        "LT"    :"6",
        "RT"    :"7",
        "BACK"  :"8",
        "START" :"9",
        "LSTICK":"10",
        "RSTICK":"11",
        "CROSSU":"12",
        "CROSSD":"13",
        "CROSSL":"14",
        "CROSSR":"15"
    };
    // Translate AXIS NAMES to AXIS NUMBERS (XBOX IDs)
    private readonly axisNames:{[id:string]:string} = {
        "LEFTH" : "0",
        "LEFTV" : "1",
        "RIGHTH": "2",
        "RIGHTV": "3",
    };
    // Translate XBOX IDs to Mayflash Gamecube IDs
    private readonly buttonsMayFlashGC:number[] = [1,2,0,3,-1,7,4,5,-1,9,-1,-1,12,14,15,13];
    private readonly axisMayFlashGC:number[] = [0,1,5,2];

    private readonly buttonsSuperNes:number[] = [1,2,0,3,4,5,-1,-1,8,9,-1,-1,-1,-1,-1,-1];
    private readonly axisSuperNes:number[] = [0,1,-1,-1];



    //-------------------------------------------------------------------------------------
    // FUNCTIONS FOR IDs TRANSLATION
    //-------------------------------------------------------------------------------------
    // Axis
    private translateAxisIDs(devNum:number, axiNum):number {
        let pad = navigator.getGamepads()[devNum];
        let result = axiNum;
        if( pad ){
            let name = pad.id.toLowerCase();
            //------------------------------
            // ----- MAYFLASH GAMECUBE -----
            //------------------------------
            if( name.includes('mayflash') && name.includes('gamecube') ){
                // Translate button number
                result = this.axisMayFlashGC[axiNum];
            }
            //-----------------------------
            // -----  USB SUPER NES   -----
            //-----------------------------
            if( name.includes('0810-e501-usb') ){
                // Translate button number
                result = this.axisSuperNes[axiNum];
            }
        }
        return result;
    }
    // Buttons
    private translateButtonIDs(devNum:number, butNum):number{
        let pad = navigator.getGamepads()[devNum];
        let result = butNum;
        if( pad ){
            let name = pad.id.toLowerCase();
            //------------------------------
            // ----- MAYFLASH GAMECUBE -----
            //------------------------------
            if( name.includes('mayflash') && name.includes('gamecube') ){
                // Translate button number
                result = this.buttonsMayFlashGC[butNum];
            }
            //-----------------------------
            // -----  USB SUPER NES   -----
            //-----------------------------
            if( name.includes('0810-e501-usb') ){
                // Translate button number
                result = this.buttonsSuperNes[butNum];
            }
        }
        return result;
    }


    //-------------------------------------------------------------------------------------
    // CALLBACKS for KEYBOARD event operation (rising edge or falling edge)
    //-------------------------------------------------------------------------------------
    // Check if the action callbacks are linked to any gamepad buttons
    updateScript(delta: number) {

        // Update button states (each of them)
        Object.keys(this.butState).forEach( (k) =>{
            let dN = this.butState[k].devNum;
            let bN = this.butState[k].butNum;
            let st = this.butState[k].state;
            // Check the level for the current button/device
            let pad = navigator.getGamepads()[dN];
            if(pad){
                let but = pad.buttons[bN];
                if( but ){
                    let curSt = but.pressed;
                    if(st != curSt){
                        // State change : call the callback (if it exists)
                        // console.log("state change (device:"+dN+" / button:"+bN+" / "+st+"->"+curSt+")");
                        // look for action in the button list
                        Object.keys(this.buttonList).forEach( (k)=>{
                            let dN2 = this.buttonList[k].device_num;
                            let bN2 = this.translateButtonIDs( dN2, this.buttonList[k].input_ref );
                            if( dN==dN2 && bN==bN2 ){
                                // We have found the action : find it in the callback list
                                if( this.callbackList[k] ){
                                    this.callbackList[k](k, curSt);
                                }
                            }
                        } );
                        // Store new state for future use
                        this.butState[k].state = curSt;
                    }
                }
            }
        });
        Object.keys(this.axisState).forEach( (k) =>{
            let dN = this.axisState[k].devNum;
            let bN = this.axisState[k].butNum;
            let st = this.axisState[k].state;
            let input = this.axisState[k].input;
            // Check the level for the current button/device
            let pad = navigator.getGamepads()[dN];
            if(pad){
                let but = pad.buttons[bN];
                if( but ){
                    let curSt;
                    let axiNum = parseInt(input.input_ref);
                    axiNum = this.translateAxisIDs(dN,axiNum);
                    if( navigator.getGamepads()[dN].axes[axiNum] ){
                        // check thresholds before update state
                        if (input.threshold >= 0) {
                            curSt =  (navigator.getGamepads()[dN].axes[axiNum] > input.threshold);
                        } else  {
                            curSt = (navigator.getGamepads()[dN].axes[axiNum] < input.threshold);
                        }
                    }
                        // State change : call the callback (if it exists)
                        // console.log("state change (device:"+dN+" / button:"+bN+" / "+st+"->"+curSt+")");
                        // look for action in the button list
                        Object.keys(this.buttonList).forEach( (k)=>{
                            let dN2 = this.buttonList[k].device_num;
                            let bN2 = this.translateAxisIDs( dN2, this.buttonList[k].input_ref );
                            if( dN==dN2 && bN==bN2 ){
                                // We have found the action : find it in the callback list
                                if( this.callbackList[k] ){
                                    this.callbackList[k](k, curSt);
                                }
                            }
                        } );
                        // Store new state for future use
                        this.axisState[k].state = curSt;
                }
            }
        });
    }
    // Check if the keyboard event is linked to a callback
    private checkKeyBoardEvent(evt:KeyboardEvent) {
        // update key state
        this.keyState[evt.key] = (evt.type==="keydown");
        // check this is not a repeat
        if(evt.repeat == false) {
            // look for event in the key list
            Object.keys(this.keyList).forEach( (k)=>{
                if( this.keyList[k].input_ref == evt.key ){
                    // We have found the action : find it in the callback list
                    if( this.callbackList[k] ){
                        this.callbackList[k](k, evt.type==="keydown");
                    }
                }
            } );
        }
    }


    //-------------------------------------------------------------------------------------
    // CONSTRUCTOR with listeners on KEYBOARD
    //-------------------------------------------------------------------------------------
    public constructor() {
        // KEY UP LISTENER
        window.document.addEventListener('keyup', (evt)=>{
            this.checkKeyBoardEvent(evt);
        });
        // KEY DOWN LISTENER
        window.document.addEventListener('keydown', (evt)=>{
            this.checkKeyBoardEvent(evt);
        });
    }


    //-------------------------------------------------------------------------------------
    // REGISTER actions linked to buttons, axis or keys
    //-------------------------------------------------------------------------------------
    // register action name : action name is linked to a specific input key, button or axis
    register(actionName: string, inputObject: Input) {
        if(inputObject.type==="key"){
            if( this.keyList[actionName] ){
                throw new Error("action name already registered in Key !");
            }
            this.keyList[actionName] = inputObject;
        }
        else if(inputObject.type==="button"){
            if( this.buttonList[actionName] ){
                throw new Error("action name already registered in Button !");
            }
            console.log("Add action "+actionName+" to buttons with dev "+inputObject.device_num+" and ref "+inputObject.input_ref);
            this.buttonList[actionName] = inputObject;
            // Convert Button name into Button ID (XBOX)
            this.buttonList[actionName].input_ref = this.buttonNames[this.buttonList[actionName].input_ref];
            // Add button state
            let dN = this.buttonList[actionName].device_num;
            let bN = this.translateButtonIDs(dN,this.buttonList[actionName].input_ref);
            if( this.butState[dN+"_"+bN] ){
                if(bN != -1){
                    throw new Error("button state is already registered ("+dN+" / "+bN+"/)");
                }
                else{
                    return;
                }
            }
            this.butState[dN+"_"+bN] = {devNum:dN, butNum:bN, state:false};
        }
        else if(inputObject.type==="gamepadaxis"){
            if( this.gamePadAxisList[actionName] ){
                throw new Error("action name already registered in Gamepad axis !");
            }
            console.log("Add action "+actionName+" to gamepadaxis with dev "+inputObject.device_num+" and ref "+inputObject.input_ref);
            this.gamePadAxisList[actionName] = inputObject;
            // Convert Button name into Button ID (XBOX)
            this.gamePadAxisList[actionName].input_ref = this.axisNames[this.gamePadAxisList[actionName].input_ref];
            if( Math.abs(inputObject.threshold) < 0.2 ){
                console.log("WARNING : this gamepadaxis action has a low threshold value. Please check this value is correct !");
            }
            let dN = this.gamePadAxisList[actionName].device_num;
            let bN = this.translateAxisIDs(dN,this.gamePadAxisList[actionName].input_ref);
            if( this.axisState[dN+"_"+bN+"_"+inputObject.threshold] ){
                if(bN != -1){
                    throw new Error("gamePadAxisList state is already registered ("+dN+" / "+bN+"/)");
                }
                else{
                    return;
                }
            }
            this.axisState[dN+"_"+bN+"_"+inputObject.threshold] = {devNum:dN, butNum:bN, state:false,input:inputObject};
        }
        else{
            throw new Error("Bad input action type !!");
        }
    }


    //-------------------------------------------------------------------------------------
    // REGISTER action events (only works for keys for the moment as we have some problems to get button up/down events)
    //-------------------------------------------------------------------------------------
    // Register event : gives a callback that is called whenever the event occurs
    registerEvent(actionName:string, callback:(actionName:string,buttonState:boolean)=>void ){
        // Check the action name callback is already registered
        if( this.callbackList[actionName] ) {
            throw new Error("Action name is already registered in callback list !");
        }
        this.callbackList[actionName] = callback;
    }


    //-------------------------------------------------------------------------------------
    // READING logic state of buttons, axis, keys
    //-------------------------------------------------------------------------------------
    isOFF(actionName: string): boolean {
        return !this.isON(actionName);
    }
    isON(actionName: string): boolean {
        //- - - - - - - - - - - - - -
        // Look into keys
        //- - - - - - - - - - - - - -
        let input = this.keyList[actionName];
        let state = false;
        if(input){
            state = this.keyState[input.input_ref];
        }
        //- - - - - - - - - - - - - -
        // Look into buttons
        //- - - - - - - - - - - - - -
        input = this.buttonList[actionName];
        if (input) {
            // Get gamepad device number
            let devNum = input.device_num;
            // sometimes the gamepad is not recognized (undefined) by the internet client
            if( navigator.getGamepads()[devNum] ) {
                let butNum = parseInt(input.input_ref);
                butNum = this.translateButtonIDs(devNum,butNum);
                if( navigator.getGamepads()[devNum].buttons[butNum] ){
                    state = state || navigator.getGamepads()[devNum].buttons[butNum].pressed;
                }
            }
        }
        //- - - - - - - - - - - - - -
        // Look into axis
        //- - - - - - - - - - - - - -
        input = this.gamePadAxisList[actionName];
        if (input) {
            // Get gamepad device number
            let devNum = input.device_num;
            // sometimes the gamepad is not recognized (undefined) by the internet client
            if( navigator.getGamepads()[devNum] ) {
                let axiNum = parseInt(input.input_ref);
                axiNum = this.translateAxisIDs(devNum,axiNum);
                if( navigator.getGamepads()[devNum].axes[axiNum] ){
                    // check thresholds before update state
                    if (input.threshold >= 0) {
                        state = state || (navigator.getGamepads()[devNum].axes[axiNum] > input.threshold);
                    } else  {
                        state = state || (navigator.getGamepads()[devNum].axes[axiNum] < input.threshold);
                    }
                }
            }
        }
        // Return result state
        return !!state;
    }

    //-------------------------------------------------------------------------------------
    // READING analog value of buttons, axis, keys
    //-------------------------------------------------------------------------------------
    // If the linked input is an axis, it returns the analog value BETWEEN 0.0 and 1.0
    // If the input is a key or a button, it just returns either 0.0 or 1.0 according to current state (pressed or released)
    getAnalogValue(actionName:string):number {
        // init local variable
        let result:number = 0.0;
        //- - - - - - - - - - - - - -
        // Look into axis
        //- - - - - - - - - - - - - -
        let input = this.gamePadAxisList[actionName];
        if( input ) {
            // Get gamepad device number
            let devNum = input.device_num;
            // sometimes the gamepad is not recognized (undefined) by the internet client
            if (navigator.getGamepads()[devNum]) {
                let axiNum = parseInt(input.input_ref);
                axiNum = this.translateAxisIDs(devNum,axiNum);
                if( navigator.getGamepads()[devNum].axes[axiNum] ) {
                    let analogV = navigator.getGamepads()[devNum].axes[axiNum];
                    if (input.threshold > 0) {
                        if(analogV < input.threshold) {
                            analogV = 0;
                        }
                    } else {
                        if(analogV > input.threshold) {
                            analogV = 0;
                        }
                    }
                    analogV = Math.abs(analogV);
                    result = Math.max(result, analogV);
                }
            }
        }
        //- - - - - - - - - - - - - -
        // Look into keys
        //- - - - - - - - - - - - - -
        input = this.keyList[actionName];
        if(input){
            if( this.keyState[input.input_ref] ){
                result = Math.max(result,1);
            }
        }
        //- - - - - - - - - - - - - -
        // Look into buttons
        //- - - - - - - - - - - - - -
        input = this.buttonList[actionName];
        if (input) {
            // Get gamepad device number
            let devNum = input.device_num;
            // sometimes the gamepad is not recognized (undefined) by the internet client
            if( navigator.getGamepads()[devNum] ) {
                let butNum = parseInt(input.input_ref);
                butNum = this.translateButtonIDs(devNum,butNum);
                if( navigator.getGamepads()[devNum].buttons[butNum] ){
                    if( navigator.getGamepads()[devNum].buttons[butNum].pressed ){
                        result = Math.max(result,1);
                    }
                }
            }
        }
        // return the computation between all keys, buttons and axis
        return result;
    }

}