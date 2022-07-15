import React, {useState, useEffect} from "react";


export default (props)=>{
    const [instances, setInstance] = useState([]);
    const [stop, setstop] = useState(0);    
    useEffect(()=>{
        axios.get('').then(response => setInstance(response.data)).catch(err => console.log(err));
},[]);//run on only initial render
 

    return(
        <React.Fragment>
            <nav></nav>
            <table>
                <thead>
                    <th>S.No.</th>
                    <th>User: Instance Name</th>
                    <th>Clone</th>
                </thead>
                <tbody>
                    {
                     instances.map((element, index)=>{
                        return(
                         <tr>
                            <td>{index+1}</td>
                            <td>{element.user}:{element.instance}</td>
                            <td></td>
                         </tr>   
                        )
                     })   
                    }
                </tbody>
            </table>
        </React.Fragment>
    );
};