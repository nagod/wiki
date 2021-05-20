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
                     }
                     resultData.push(resultObj)
                 }
                 resolve(resultData)
             }).catch(err => reject(err))
        })
    }

    static async mapPageURl(searchObjects){
        return new Promise((resolve, reject) =>{
            searchObjects.forEach((element)=>{
                let urlForPageLink = `https://de.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${element.pageId}&inprop=url&format=json`;
                fetch(urlForPageLink)
                .then(res => res.json())
                .then(data => {
                    element.url =data.query.pages[element.pageId].fullurl
                }).catch(err => reject(err))
            })
            resolve(searchObjects)
        })        
    }

    static async search(searchText, outputLimit=10){
        /*
        let searchObjects = await this.getSearchObjects(searchText)
        let searchObjectmapped = await this.mapPageURl(searchObjects)
        
        return searchObjectmapped
        */
       

        return new Promise((resolve, reject) =>{
            this.getSearchObjects(searchText).then(data=>{
                this.mapPageURl(data).then(res =>{
                    resolve(res)
                }).catch(err => reject(err))
            }).catch(err => reject(err))
        })
    }

}