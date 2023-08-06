const puppeteer = require('puppeteer');
const codeObj=require("./hrcodes")
const loginlink = 'https://www.hackerrank.com/auth/login';
const email = 'xosokit285@wusehe.com';
const password = '123456'

let browseropen = puppeteer.launch({
    headless : false,
    args :['--start-maximized'],
    defaultViewport: null
})

let page;

browseropen.then(function(browserobj){
    let browseropenpromise = browserobj.newPage();
    return browseropenpromise;
}).then(function(newTab) {
    page = newTab;
    let hackerrankopenpromise = newTab.goto(loginlink);
    return hackerrankopenpromise;
}).then(function(){
    let typehkpromise = page.type("input[id='input-1']", email, {delay : 50});
    //delay is added to slow down the typing
    return typehkpromise;
}).then(function(){
    let enterpassword = page.type("input[type = 'password']", password, {delay : 40});
    return enterpassword;
}).then(function(){
    let loginbuttonclick = page.click("button[data-analytics='LoginPassword']", {delay : 40});
    // instad of whole seletcor, for input and buttons ->
    //tag_name[propeties] can be easier
    return loginbuttonclick;
}).then(function (){
    let clickonalgopromise = waitandclick("a[data-cd-topic-slug='algorithms']", page);
    return clickonalgopromise;
}).then(function(){
    //let gettowarmup = page.$$("input[value='warmup']", {delay:50});
    let gettowarmup = waitandclick("input[value='warmup']",page);
    //puppeteer don't work with input tags.
    //they show that checkbox is visibly selected but does not show he check sign.
    //hence it is not working
    return gettowarmup;
}).then(function(){
    let waitfor3seconds = page.waitForTimeout(2000);
    return waitfor3seconds;
})
.then(function(){
    let allchallengedPromise=page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",{delay:50});
    // page.$$ is shortcut for page.querySelectorAll
    return allchallengedPromise;
}).then(function(questionarray){
    console.log("NO. OF QUESTIONS: ", questionarray.length);
    let questionswillbesolved = questionsolver(page, questionarray[0], codeObj.answers[0])
    //we cannnot type in the area for code due to automated compiler like VS code
    // there, if we write a for then the parenthesis () comes automatically, so it will create problem for us while typing
    //  so there is a 'text against custom input' option there where we can write our code.
    return questionswillbesolved;
})

function waitandclick(selector,cPage){
    return new Promise(function(resolve,reject){
        let waitForModelPromise=cPage.waitForSelector(selector);
        waitForModelPromise.then(function(){
            let clickModel=cPage.click(selector);
            return clickModel;
        }).then(function(){
            resolve();
        }).catch(function(err){
            reject("Error from wait and click.");
        })
    })

}

function questionsolver(page, question, answer){
    return new Promise(function(resolve, reject){
        let questionwillbeclicked = question.click()
        questionwillbeclicked.then(function (){
            let editorInFocusPromise = waitandclick('.view-lines.monaco-mouse-cursor-text', page)
            return editorInFocusPromise;
        }).then(function (){
            //return page.$$(".checkbox-input", {delay:50});
            return waitandclick(".checkbox-input", page);
        }).then(function(){
            return page.waitForSelector("textarea.custominput");
            //let editorInFocusPromise = waitandclick('.view-lines.monaco-mouse-cursor-text', page)
        }).then(function(){
            return page.type("textarea.custominput",answer,{delay:10});

        }).then(function(){
            let ctrlIsPreses=page.keyboard.down("Control");
            return ctrlIsPreses;
        }).then(function(){
            let AisPresses=page.keyboard.press("A",{delay:100});
            return AisPresses;
        }).then(function(){
            let XisPresses=page.keyboard.press("X",{dealy:100});
            return XisPresses;
        }).then(function(){
            let ctrlIsUnPressed=page.keyboard.up("Control");
            return ctrlIsUnPressed;
        }).then(function(){
            let mainEditorInFocusPromise=waitandclick(".monaco-editor.no-user-select.vs",page);
            return mainEditorInFocusPromise;
        }).then(function(){
            let ctrlIsPreses=page.keyboard.down("Control");
            return ctrlIsPreses;
        }).then(function(){
            let AisPresses=page.keyboard.press("A",{delay:100});
            return AisPresses;
        }).then(function(){
            let AisPresses=page.keyboard.press("V",{delay:100});
            return AisPresses;

        }).then(function(){
            let ctrlIsUnPressed=page.keyboard.up("Control");
            return ctrlIsUnPressed;
        }).then(function(){
            return page.click(".hr-monaco__run-code",{delay:50});
        })
    
    })
}