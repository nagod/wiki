import "./style/index.css"
import SearchApi from "./Service/SearchApi"
import React, { useState} from 'react';
import Result from "./Result.js"

function App() {

  // states 
  const [searchText, setSearchTex] = useState("");
  const [resultObj , setResultObject] = useState([]);
  const [errorString, setErrorString] = useState("");

  async function Search(){
    if(searchText.length > 2){
      SearchApi.search(searchText)
      .then(data=>{
        if(data.length > 1){
          setResultObject([...data])
          setErrorString("")
        } else{
          setErrorString("Nothing found! Try with another search string.")
        }
      }).catch(err => console.log(err))
    } else{
      setErrorString("Please enter at least 3 characters!")
    }
  }
  function checkKeyPressed(e){
        if(e.code === "Enter"){
        Search();
       }
      
  }
  const data = resultObj.map((value,index)=>{
    return (<div><Result title={value.title} snippet={value.snippet} url={value.url} key={index}/></div>)
  })

  return (
    <div className="App">
      <div className="searchComponent">
        <h1>Wikipedia Search Engine</h1>
        <div className="searchBar">
          <input value={searchText} onChange={(e) => setSearchTex(e.target.value)} onKeyPress={(e)=> checkKeyPressed(e)} placeholder="Enter your search string"></input>
          <button onClick={()=>Search()}>Search</button>
        </div>
        <div>
          <h4 style={{color: "red"}}>{errorString}</h4>
          </div>
      </div>
      <div className="resultdiv">
      {data}
      </div>
    </div>
  );
}

export default App;