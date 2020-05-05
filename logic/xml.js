const xml2js = require('xml2js');
const { toXML } = require('jstoxml');
const File = require('../util/myFile');
let file = new File();

class Xml{
    constructor(){
        this.items = [];
    }

    async parseFile(filename){
        let data = await file.read(filename);
        return this.parse(data);
    }

    async parse(content){
        let parser = new xml2js.Parser();
        let result = await parser.parseStringPromise(content);
        return this.handle(result);
    }

    async write(content, filename){
        try{
             await file.save(filename, content);
             return true;
        }catch(err){
            console.error('write xml failed: [%s]', err);
            return false;
        }
     }

    async writeObj(obj, option, filename){
        try{
            let content = toXML(obj, option);
            await file.save(filename, content);
            // console.log('write obj to xml file succeed');
            return true;
        }catch(err){
            console.error('write obj to xml filr failed: [%s]', err);
            return false;
        }
     }
}


class RssXml extends Xml{
    constructor(){
        super();
    }

    handle(result){
        try{
            let channel = result.rss.channel[0];
            let info = {
                'title': channel.title[0].trim(),
                'link': channel.link[0].trim(),
                'description': channel.description[0].trim(),
                // 'href': ''
                // pubDate[0].trim()
            }

            let items = [];
            channel.item.forEach(item => {
                items.push({
                    'title': item.title[0].trim(),
                    'guid': item.guid[0],
                    'description': item.description[0].trim(),
                    'pubDate': item.pubDate[0].trim(),
                    'link': item.link[0].trim()
                });
            });

            return {
                'info': info, 
                'items': items
            }
        }catch(err){
            console.log(`RssXml handle failed: `, err);
        }
    }
}


module.exports = {
    RssXml
};