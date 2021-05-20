import "./style/index.css"
import SearchApi from "./Service/SearchApi"
import React, { useState} from 'react';
import Result from "./Result.js"

function App() {

  // states 
  const [searchText, setSearchTex] = useState("");
  const [resultObj , setResultObject] = useState();
  const [errorString, setErrorString] = useState("");
/**
 *  @FLORIAN
 *   Problem : nach SearchApi.search CALL werden die URLS nicht gerendert. Title, Snippet aber schon ?! Async/ React-Render-Lifecycle Problem ????
 * 
 *      SearchApi.search(searchText):
 *         1) führt getSearchObjects(text,limit=10) aus und returned Array mit Objects der Form { title : , snippet: , pageId : }
 *         
 *         2) führt mapPageURl(Array)
 *            - bekommt Array aus getSearchObjects
 *            - fetched zu jedem Entry  die URL via pageID
 *            - fügt Object eine URL prop. hinzu mit gefundener data 
 *            - returned Array mit Objects
 *         
 * 
 *         3) Nachdem 1 und 2 ausgeführt worden sind ( nacheinander .then() ! ) wird folglich ein Promise / Array returned, in dem sich die RICHTIGEN Werte befinden.( console.log gibt sie aus )
 *        
 *        
 *        Ich bekomme hier mit :     
 *            let res = await SearchApi.search(searchText)
 *        die richtigen values und meine Result Components erhalten diese auch ! Außer die URL, diese wird bspw erst gesetzt, wenn man in der Suchleiste einmal die
 *        Leertaste drück und somit ein rerender triggert ?
 * 
 *        Wie kann ich dieses Problem umgehen, ohne wie bei meiner ersten funktionierenden Abgabe es mit Promise.all und alles in einer MONSTER Funktion zu realisieren.
 * 
 *        Wo liegt mein Fehler ? Habe ich nicht richtig Async gearbeitet ? Oder muss ich React klar machen, das nochmal gerendert werden soll ? 
 * 
 */
  async function Search(){
    // Man könnte noch den String aus Sonderzeichen Filter / mit Regex bearbeiten !!!
      if(searchText.length > 2){
        let res = await SearchApi.search(searchText)
        console.log(res )
        if(res.length > 1){
          setResultObject(res)
          setErrorString("")

        }else{
          setErrorString("Nothing found! Try with another search string.")
        }
     }else{
       setErrorString("Please enter at least 3 characters!")
     }
  }
  function checkKeyPressed(e){
        if(e.code === "Enter"){
        Search() 
       }      
  }

  
  return (
    <div className="App">
      <div className="searchComponent">
        <h1>Wikipedia Search Engine</h1>
        <div className="searchBar">
          <input type="text" value={searchText} onChange={(e) => setSearchTex(e.target.value)} onKeyPress={(e)=> checkKeyPressed(e)} placeholder="Enter your search string"></input>
          <button onClick={()=>Search()}>Search</button>
        </div>
        <div>
          <h4 style={{color: "red"}}>{errorString}</h4>
          </div>
      </div>
      <div className="resultdiv">
      {resultObj!== undefined ? resultObj.map((value,index)=>{
      return (<Result title={value.title} snippet={value.snippet} url={value.url} key={index}/>)
      }) : <div/>}
      </div>
    </div>
  );
}

export default App;
