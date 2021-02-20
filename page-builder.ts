import * as fs from 'fs';
import * as Async from 'async';
import * as PageUtil from './page-manager-utility';
import config from './page-builder-config.json';


// Command line arguments 
// Argument: page file directory path
async function main() {
    var headerOutput: PageUtil.PageHeaderType[] = [];
    var filelist = fs.readdirSync(config.PageDir);

    console.log(filelist.length);

    var queue = Async.queue((file, callback) => {
        // check page file 
        if (file.endsWith('.page')) {
            var data = fs.readFileSync(config.PageDir + '/' + file).toString();
            var header: PageUtil.PageHeaderType = PageUtil.getPageHeader(data);
            var content: string = PageUtil.getPageContent(data);

            // if datetime exists
            if (header.datetime) {
                header.filepath = file;
                //headerOutput.push(header);
            }
            // if datetime not exists
            else {
                header.datetime = new Date();
                header.filepath = file;
                // write datetime to file
                fs.writeFileSync(file,
                    '/*' + JSON.stringify(header) + '*/\n'
                    + content);
                //headerOutput.push(header);
            }
        }
        console.log("!");
        callback();
    }, 1);
    // queue.drain(() => {
    //     console.log("!: " + headerOutput.length);
    //     headerOutput.sort((a: PageUtil.PageHeaderType, b: PageUtil.PageHeaderType) => {
    //         if (a.datetime != b.datetime) {
    //             return a.datetime.valueOf() - b.datetime.valueOf();
    //         } else {
    //             return a.title.localeCompare(b.title);
    //         }
    //     });

    //     fs.writeFileSync(config.PageDir + "/" + config.BlogHeader,
    //         JSON.stringify(headerOutput));
    // });
    queue.push(filelist);
    await queue.drain();
    console.log("!1: " + headerOutput.length);
}
main();

