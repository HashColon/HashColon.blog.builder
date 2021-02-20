"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const Async = __importStar(require("async"));
const PageUtil = __importStar(require("./page-manager-utility"));
const page_builder_config_json_1 = __importDefault(require("./page-builder-config.json"));
// Command line arguments 
// Argument: page file directory path
async function main() {
    var headerOutput = [];
    var filelist = fs.readdirSync(page_builder_config_json_1.default.PageDir);
    console.log(filelist.length);
    var queue = Async.queue((file, callback) => {
        // check page file 
        if (file.endsWith('.page')) {
            var data = fs.readFileSync(page_builder_config_json_1.default.PageDir + '/' + file).toString();
            var header = PageUtil.getPageHeader(data);
            var content = PageUtil.getPageContent(data);
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
                fs.writeFileSync(file, '/*' + JSON.stringify(header) + '*/\n'
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
//# sourceMappingURL=page-builder.js.map