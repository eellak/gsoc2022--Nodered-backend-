import { useState } from "react";

export default (props)=>{
const [value,setValue] = useState(false);
    return(
        <input type="checkbox" name="props.name"></input>
    );

};