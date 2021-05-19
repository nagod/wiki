export default class SearchApi{

     // basic url for api call 
    url = "https://en.wikipedia.org/w/api.php"; 

    
    static  async search(searchText, outputLimit=10){
        
    
       return new Promise((resolve,reject)=>{

        // Api URL with dymaic params
        let searchURL = `https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${searchText}&limit=${outputLimit}&namespace=0&format=json&prop=info|extracts&inprop=url`

        let resultData = []
        
        
        fetch(searchURL)
        .then(response => response.json())
        .then(data =>{
             for(let key in data.query.search){
                 let resultObj = {
                     title : data.query.search[key].title,
                     snippet: data.query.search[key].snippet,
                     pageId : data.query.search[key].pageid
                 }
                 resultData.push(resultObj)
             }
         }).then(res =>{
             let allPromises = []
             resultData.forEach(entry=>{
                 let urlForPageLink = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${entry.pageId}&inprop=url&format=json`;
                 
                 let promise = fetch(urlForPageLink).then(res => res.json())
                 allPromises.push(promise)
             })
             Promise.all(allPromises).then(values=> values.forEach((data,index) => {
                for(let key in data.query.pages){
                    resultData[index].url = data.query.pages[key].fullurl                
                }
             })).then(res => resolve(resultData))
         })
        .catch(err => reject(err))
       })
    }
}