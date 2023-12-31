let { task, desc } = require('jake');
let { run, runBg, pipe } = require('@cube-drone/rundmc');

desc("List all tools & options.")
task('default', async () => {
    return run("npx jake -T")
});

const start = async () => {
    await run("nodemon bin.js")
}
desc("Boot up the server.")
task('start', start)

desc("unbootup the server")
task('clean', async () => {
    // nothing to clean
})

desc("run tests")
task('test', async () => {
    await run('npx mocha')
})

const cleanTest = async () => {
    let proc = runBg("node bin.js")

    let success = false
    let messages = []
    try{
        let tests = await pipe("npx mocha")
        console.warn("-----------------")
        for(let line of tests){
            console.log(line)
        }
        success = true
    }
    catch(err){
        console.log("Error running tests");
        for(let line of err){
            console.error(line)
            if(line.indexOf && line.indexOf("failing") > -1){
                messages.push(line)
            }
        }
    }

    if(messages){
        console.error("")
        for(let message of messages){
            console.error(`==> ${message}`)
        }
        console.error("")
    }

    await proc.kill()
    return { success, messages }
}

const ci_test = async () => {
    let { success, messages } = await cleanTest()
    if(!success){
        console.error("Tests failed, not deploying")
        return process.exit(1)
    }
    else{
        return process.exit(0)
    }
}
desc("Run the test suite from clean")
task('ci_test', ci_test)