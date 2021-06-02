export default class SearchApi{

    static async getSearchObjects(searchWord, outputLimit=10){

        let searchURL = `https://de.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${searchWord}&limit=${outputLimit}&namespace=0&format=json&prop=info|extracts&inprop=url`
        //array for all found searchObjs
        let resultData = []
        return new Promise((resolve, reject)=>{
            fetch(searchURL)
            .then(response => response.json())
            .then(data =>{
                 for(let key in data.query.search){
                     let resultObj = {
                         title : data.query.search[key].title,
                         snippet: data.query.search[key].snippet,
                         pageId : data.query.search[key].pageid,
                         url :null
                     }
                     resultData.push(resultObj)
                 }
                 resolve(resultData)
             }).catch(err => reject(err))
        })
    }

    static async mapPageURl(searchObjects){
        // prepare all URL for given Objects
        let urls = searchObjects.map(element =>`https://de.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${element.pageId}&inprop=url&format=json`);

        let result = await Promise.all(urls.map(entry => fetch(entry)))
        let resultJson = await Promise.all(result.map(entry => entry.json()))

        resultJson.forEach(data =>{
            const ObjectId = Object.keys(data.query.pages)
            const pageId = data.query.pages[ObjectId].pageid
            let obj = searchObjects.find(element => element.pageId === pageId)
            obj.url = data.query.pages[pageId].fullurl
        })
        return searchObjects
    }

    static async search(searchText, outputLimit=10){
        // Obj. without vaild url
        const rawSearchObjs = await this.getSearchObjects(searchText);
        const  finalSearchObjs =  await this.mapPageURl(rawSearchObjs)
        
        // Objs with valid url 
        return finalSearchObjs;   
    }
}