import { govcyFrontendRenderer } from '@gov-cy/govcy-frontend-renderer';
const renderer = new govcyFrontendRenderer();

// Define the input data
const inputData = 
{    
    "site" : {
        "lang" : "en"
    },
    "pageData": {
        "layout": "",
    }
};

// Define the JSON template 
let inputJson =  
{
    "sections": [
        {
            "name": "main",
            "elements": [
                {
                    "element": "form",
                    "params": {
                        "elements": [
                            {
                                "element": "textInput",
                                "params": 
                                {
                                    "label":{"en":"What is your name?","el":"Ποιο είναι το όνομα σας;"}
                                    ,"id":"name"
                                    ,"name":"name"
                                    ,"isPageHeading": true
                                    ,"autocomplete":"tel"
                                }
                            },
                            {
                                "element": "button",
                                "params": 
                                {
                                    "text":{"en":"Continue","el":"Συνέχεια"}
                                    , "type":"submit"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ]
}
;

// Render
let rtn = renderer.renderFromJSON(inputJson, inputData)
console.log(rtn);